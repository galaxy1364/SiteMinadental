import type { VercelRequest, VercelResponse } from '@vercel/node';
import { healthCheck } from '../server/db.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestId = String(req.headers['x-request-id'] || crypto.randomUUID());
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Request-Id', requestId);

  if (req.method !== 'GET') return res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED', requestId });

  const checks: Record<string, unknown> = {
    database: { ok: false },
    sms: { configured: Boolean(process.env.SMS_PROVIDER && process.env.SMS_API_KEY) },
    push: { configured: Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) },
    ai: { configured: Boolean(process.env.OPENAI_API_KEY) },
    minadent: { configured: Boolean(process.env.MINADENT_API_URL && process.env.MINADENT_CLIENT_SECRET) },
    googleAds: { configured: Boolean(process.env.GOOGLE_ADS_DEVELOPER_TOKEN) },
    meta: { configured: Boolean(process.env.META_ACCESS_TOKEN) },
    bale: { configured: Boolean(process.env.BALE_BOT_TOKEN) },
    eitaa: { configured: Boolean(process.env.EITAA_BOT_TOKEN) },
    rubika: { configured: Boolean(process.env.RUBIKA_BOT_TOKEN) }
  };

  try {
    checks.database = await healthCheck();
  } catch (error) {
    checks.database = { ok: false, error: error instanceof Error ? error.message : 'database_unavailable' };
  }

  const databaseOk = Boolean((checks.database as { ok?: boolean }).ok);
  return res.status(databaseOk ? 200 : 503).json({
    ok: databaseOk,
    service: 'mina-dental-enterprise-api',
    version: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    time: new Date().toISOString(),
    requestId,
    checks
  });
}
