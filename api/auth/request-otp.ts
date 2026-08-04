import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { createHash, randomInt } from 'node:crypto';
import { pool } from '../../server/db.js';
import { clientFingerprint, rateLimit } from '../../server/security.js';

const Input = z.object({ mobile: z.string().regex(/^09\d{9}$/), purpose: z.enum(['login','booking','admin']).default('login') });
const hash = (value: string) => createHash('sha256').update(value).digest('hex');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestId = String(req.headers['x-request-id'] || crypto.randomUUID());
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Request-Id', requestId);
  if (req.method !== 'POST') return res.status(405).json({ ok:false, code:'METHOD_NOT_ALLOWED', requestId });
  if (!process.env.DATABASE_URL || !process.env.SMS_PROVIDER || !process.env.SMS_API_KEY) {
    return res.status(503).json({ ok:false, code:'OTP_NOT_CONFIGURED', requestId });
  }
  const parsed = Input.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok:false, code:'VALIDATION_ERROR', issues:parsed.error.issues, requestId });
  const fp = hash(clientFingerprint(req));
  const mobileHash = hash(parsed.data.mobile);
  const ipLimit = await rateLimit(`otp:ip:${fp}`, 5, 900);
  const mobileLimit = await rateLimit(`otp:mobile:${mobileHash}`, 3, 900);
  if (!ipLimit.allowed || !mobileLimit.allowed) return res.status(429).json({ ok:false, code:'RATE_LIMITED', requestId });

  const code = String(randomInt(100000, 999999));
  const codeHash = hash(`${code}:${process.env.AUTH_SECRET}`);
  await pool.query(
    `INSERT INTO otp_challenge(destination,purpose,code_hash,expires_at)
     VALUES($1,$2,$3,now()+interval '2 minutes')`,
    [parsed.data.mobile, parsed.data.purpose, codeHash]
  );
  await pool.query(
    `INSERT INTO outbox_message(channel,recipient,template_code,payload)
     VALUES('sms',$1,'otp',$2::jsonb)`,
    [parsed.data.mobile, JSON.stringify({ code, purpose: parsed.data.purpose, requestId })]
  );
  return res.status(202).json({ ok:true, expiresInSeconds:120, requestId });
}
