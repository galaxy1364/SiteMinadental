import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createCipheriv, createHash, randomBytes } from 'node:crypto';
import { pool } from '../../server/db.js';

function authorized(req: VercelRequest) {
  const expected = process.env.CRON_SECRET || '';
  const supplied = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  return expected.length >= 24 && supplied === expected;
}

function encrypt(data: Buffer, keyHex: string) {
  const key = Buffer.from(keyHex, 'hex');
  if (key.length !== 32) throw new Error('BACKUP_KEY_INVALID');
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([Buffer.from('MDB1'), iv, tag, ciphertext]);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestId = String(req.headers['x-request-id'] || crypto.randomUUID());
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Request-Id', requestId);
  if (req.method !== 'GET' && req.method !== 'POST') return res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED', requestId });
  if (!authorized(req)) return res.status(401).json({ ok: false, code: 'UNAUTHORIZED', requestId });
  if (!process.env.DATABASE_URL || !process.env.BACKUP_UPLOAD_URL || !process.env.BACKUP_ENCRYPTION_KEY) {
    return res.status(503).json({ ok: false, code: 'BACKUP_NOT_CONFIGURED', requestId });
  }

  const backupId = crypto.randomUUID();
  try {
    const tables = ['app_user','role','user_role','patient','clinic_schedule','appointment','otp_challenge','session_token','conversation','conversation_message','push_subscription','outbox_message','campaign_attribution','audit_log'];
    const payload: Record<string, unknown> = { schemaVersion: 1, createdAt: new Date().toISOString(), backupId, tables: {} };
    for (const table of tables) {
      const result = await pool.query(`SELECT * FROM ${table}`);
      (payload.tables as Record<string, unknown>)[table] = result.rows;
    }
    const plain = Buffer.from(JSON.stringify(payload));
    const encrypted = encrypt(plain, process.env.BACKUP_ENCRYPTION_KEY);
    const checksum = createHash('sha256').update(encrypted).digest('hex');
    const objectKey = `mina-dental/${new Date().toISOString().slice(0,10)}/${backupId}.mdb`;

    const upload = await fetch(process.env.BACKUP_UPLOAD_URL, {
      method: 'PUT',
      headers: {
        'content-type': 'application/octet-stream',
        'x-object-key': objectKey,
        'x-checksum-sha256': checksum,
        authorization: `Bearer ${process.env.BACKUP_UPLOAD_TOKEN || ''}`
      },
      body: encrypted
    });
    if (!upload.ok) throw new Error(`BACKUP_UPLOAD_HTTP_${upload.status}`);

    await pool.query(
      `INSERT INTO system_backup(id,provider,object_key,checksum_sha256,encrypted,status)
       VALUES($1,$2,$3,$4,true,'verified')`,
      [backupId, 'external-object-storage', objectKey, checksum]
    );
    await pool.query(
      `INSERT INTO audit_log(actor_type,action,entity_type,entity_id,request_id,after_data,integrity_hash)
       VALUES('system','backup.create','system_backup',$1,$2,$3::jsonb,
       encode(digest($1||$2||$3,'sha256'),'hex'))`,
      [backupId, requestId, JSON.stringify({ objectKey, checksum, bytes: encrypted.length })]
    );
    return res.status(200).json({ ok: true, requestId, backupId, objectKey, checksum, bytes: encrypted.length });
  } catch (error) {
    console.error('backup_failed', { requestId, backupId, error });
    try {
      await pool.query(
        `INSERT INTO system_backup(id,provider,object_key,checksum_sha256,encrypted,status)
         VALUES($1,'external-object-storage',$2,'pending',true,'failed') ON CONFLICT DO NOTHING`,
        [backupId, `failed/${backupId}`]
      );
    } catch {}
    return res.status(500).json({ ok: false, code: 'BACKUP_FAILED', requestId });
  }
}
