import { SignJWT, jwtVerify } from 'jose';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { pool } from './db.js';

const secretValue = process.env.AUTH_SECRET || '';
const secret = new TextEncoder().encode(secretValue);

export type Actor = { userId: string; roles: string[]; sessionId: string };

export function requireConfiguredSecret() {
  if (secretValue.length < 32) throw new Error('AUTH_SECRET_NOT_CONFIGURED');
}

export async function createSession(userId: string, roles: string[], ipHash: string, userAgent: string) {
  requireConfiguredSecret();
  const session = await pool.query<{ id: string }>(
    `INSERT INTO user_session (user_id, token_hash, ip_hash, user_agent, expires_at)
     VALUES ($1, encode(digest(gen_random_uuid()::text,'sha256'),'hex'), $2, $3, now() + interval '30 days')
     RETURNING id`,
    [userId, ipHash, userAgent.slice(0, 500)]
  );
  const sessionId = session.rows[0].id;
  const token = await new SignJWT({ roles, sid: sessionId })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret);
  return { token, sessionId };
}

export async function authenticate(req: VercelRequest): Promise<Actor> {
  requireConfiguredSecret();
  const auth = String(req.headers.authorization || '');
  const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const cookie = String(req.headers.cookie || '').match(/(?:^|; )mina_session=([^;]+)/)?.[1] || '';
  const token = bearer || decodeURIComponent(cookie);
  if (!token) throw new Error('UNAUTHENTICATED');
  const verified = await jwtVerify(token, secret, { algorithms: ['HS256'] });
  const userId = verified.payload.sub;
  const sessionId = String(verified.payload.sid || '');
  const roles = Array.isArray(verified.payload.roles) ? verified.payload.roles.map(String) : [];
  if (!userId || !sessionId) throw new Error('INVALID_SESSION');
  const active = await pool.query(
    `SELECT 1 FROM user_session WHERE id=$1 AND user_id=$2 AND revoked_at IS NULL AND expires_at > now()`,
    [sessionId, userId]
  );
  if (!active.rowCount) throw new Error('SESSION_REVOKED');
  return { userId, roles, sessionId };
}

export function requireRole(actor: Actor, allowed: string[]) {
  if (!actor.roles.some(role => allowed.includes(role))) throw new Error('FORBIDDEN');
}

export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const result = await pool.query<{ allowed: boolean; remaining: number }>(
    `WITH upsert AS (
       INSERT INTO rate_limit_bucket (bucket_key, window_started_at, hits)
       VALUES ($1, date_trunc('second', now()), 1)
       ON CONFLICT (bucket_key) DO UPDATE SET
         hits = CASE WHEN rate_limit_bucket.window_started_at < now() - make_interval(secs => $3)
                     THEN 1 ELSE rate_limit_bucket.hits + 1 END,
         window_started_at = CASE WHEN rate_limit_bucket.window_started_at < now() - make_interval(secs => $3)
                                  THEN now() ELSE rate_limit_bucket.window_started_at END
       RETURNING hits
     ) SELECT (hits <= $2) AS allowed, GREATEST($2-hits,0)::int AS remaining FROM upsert`,
    [key, limit, windowSeconds]
  );
  return result.rows[0];
}

export function clientFingerprint(req: VercelRequest) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || String(req.socket?.remoteAddress || 'unknown');
}

export function setSessionCookie(res: VercelResponse, token: string) {
  res.setHeader('Set-Cookie', `mina_session=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000`);
}
