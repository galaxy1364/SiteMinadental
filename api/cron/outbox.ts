import type { VercelRequest, VercelResponse } from '@vercel/node';
import webpush from 'web-push';
import { pool } from '../../server/db.js';

const BATCH_SIZE = 25;

function authorized(req: VercelRequest) {
  const expected = process.env.CRON_SECRET || '';
  const supplied = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  return expected.length >= 24 && supplied === expected;
}

async function sendSms(recipient: string, payload: unknown, templateCode?: string | null) {
  const endpoint = process.env.SMS_ENDPOINT;
  const apiKey = process.env.SMS_API_KEY;
  if (!endpoint || !apiKey) throw new Error('SMS_NOT_CONFIGURED');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ recipient, templateCode, payload })
  });
  if (!response.ok) throw new Error(`SMS_HTTP_${response.status}`);
}

async function sendPush(recipient: string, payload: unknown) {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;
  if (!publicKey || !privateKey || !subject) throw new Error('PUSH_NOT_CONFIGURED');
  webpush.setVapidDetails(subject, publicKey, privateKey);
  const parsed = typeof payload === 'string' ? JSON.parse(payload) : payload;
  await webpush.sendNotification(JSON.parse(recipient), JSON.stringify(parsed));
}

async function sendGeneric(channel: string, recipient: string, payload: unknown) {
  const envName = `${channel.toUpperCase()}_ENDPOINT`;
  const tokenName = `${channel.toUpperCase()}_BOT_TOKEN`;
  const endpoint = process.env[envName];
  const token = process.env[tokenName];
  if (!endpoint || !token) throw new Error(`${channel.toUpperCase()}_NOT_CONFIGURED`);
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ recipient, payload })
  });
  if (!response.ok) throw new Error(`${channel.toUpperCase()}_HTTP_${response.status}`);
}

async function deliver(row: any) {
  if (row.channel === 'sms') return sendSms(row.recipient, row.payload, row.template_code);
  if (row.channel === 'push') return sendPush(row.recipient, row.payload);
  if (['bale', 'eitaa', 'rubika'].includes(row.channel)) return sendGeneric(row.channel, row.recipient, row.payload);
  throw new Error(`UNSUPPORTED_CHANNEL_${row.channel}`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestId = String(req.headers['x-request-id'] || crypto.randomUUID());
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Request-Id', requestId);
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED', requestId });
  if (!authorized(req)) return res.status(401).json({ ok: false, code: 'UNAUTHORIZED', requestId });
  if (!process.env.DATABASE_URL) return res.status(503).json({ ok: false, code: 'DATABASE_NOT_CONFIGURED', requestId });

  const client = await pool.connect();
  const summary = { claimed: 0, sent: 0, failed: 0, deadLettered: 0 };
  try {
    await client.query('BEGIN');
    const claimed = await client.query(
      `WITH picked AS (
         SELECT id FROM outbox_message
         WHERE status='pending' AND available_at <= now()
         ORDER BY created_at
         FOR UPDATE SKIP LOCKED
         LIMIT $1
       )
       UPDATE outbox_message o
       SET status='processing', attempts=attempts+1
       FROM picked WHERE o.id=picked.id
       RETURNING o.*`,
      [BATCH_SIZE]
    );
    await client.query('COMMIT');
    summary.claimed = claimed.rowCount || 0;

    for (const row of claimed.rows) {
      try {
        await deliver(row);
        await pool.query(`UPDATE outbox_message SET status='sent', sent_at=now(), last_error=NULL WHERE id=$1`, [row.id]);
        summary.sent++;
      } catch (error) {
        const message = error instanceof Error ? error.message.slice(0, 500) : 'delivery_failed';
        const terminal = Number(row.attempts || 0) >= 8;
        const delaySeconds = Math.min(6 * 60 * 60, Math.pow(2, Number(row.attempts || 1)) * 60);
        await pool.query(
          `UPDATE outbox_message
           SET status=$2, last_error=$3,
               available_at=CASE WHEN $2='pending' THEN now()+make_interval(secs=>$4) ELSE available_at END
           WHERE id=$1`,
          [row.id, terminal ? 'failed' : 'pending', message, delaySeconds]
        );
        summary.failed++;
        if (terminal) summary.deadLettered++;
      }
    }

    await pool.query(
      `INSERT INTO audit_log(actor_type,action,entity_type,request_id,after_data,integrity_hash)
       VALUES('system','outbox.process','outbox_batch',$1,$2::jsonb,
       encode(digest($1||$2,'sha256'),'hex'))`,
      [requestId, JSON.stringify(summary)]
    );
    return res.status(200).json({ ok: true, requestId, summary });
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('outbox_worker_failed', { requestId, error });
    return res.status(500).json({ ok: false, code: 'OUTBOX_WORKER_FAILED', requestId });
  } finally {
    client.release();
  }
}
