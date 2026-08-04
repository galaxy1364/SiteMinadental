import { SignJWT, jwtVerify } from 'jose';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHash, randomBytes } from 'node:crypto';
import { pool } from './db.js';

const secretValue = process.env.AUTH_SECRET || '';
const secret = new TextEncoder().encode(secretValue);

export type Actor = { userId: string; roles: string[]; sessionId: string };

export function requireConfiguredSecret() {
  if (secretValue.length < 32) throw new Error('AUTH_SECRET_NOT_CONFIGURED');
}

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

export async function createSession(userId: string, roles: string[], ipPrefix: string, userAgent: string) {
  requireConfiguredSecret();
  const opaque = randomBytes(32).toString('base64url');
  const tokenHash = sha256(opaque);
  const session = await pool.query<{ id: string }>(
    `INSERT INTO session_token (user_id, token_hash, user_agent_hash, ip_prefix, expires_at)
     VALUES ($1,$2,$3,$4,now() + interval '30 days') RETURNING id`,
    [userId, tokenHash, sha256(userAgent.slice(0, 500)), ipPrefix.slice(0, 64)]
  );
  const sessionId = session.rows[0].id;
  const token = await new SignJWT({ roles, sid: sessionId, nonce: opaque })
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
  const nonce = String(verified.payload.nonce || '');
  const roles = Array.isArray(verified.payload.roles) ? verified.payload.roles.map(String) : [];
  if (!userId || !sessionId || !nonce) throw new Error('INVALID_SESSION');
  const active = await pool.query(
    `SELECT 1 FROM session_token WHERE id=$1 AND user_id=$2 AND token_hash=$3 AND revoked_at IS NULL AND expires_at > now()`,
    [sessionId, userId, sha256(nonce)]
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
       INSERT INTO rate_limit_bucket (bucket_key, window_started_at, hits, updated_at)
       VALUES ($1, now(), 1, now())
       ON CONFLICT (bucket_key) DO UPDATE SET
         hits = CASE WHEN rate_limit_bucket.window_started_at < now() - make_interval(secs => $3)
                     THEN 1 ELSE rate_limit_bucket.hits + 1 END,
         window_started_at = CASE WHEN rate_limit_bucket.window_started_at < now() - make_interval(secs => $3)
                                  THEN now() ELSE rate_limit_bucket.window_started_at END,
         updated_at = now()
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
