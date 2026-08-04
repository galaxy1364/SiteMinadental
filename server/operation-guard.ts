import crypto from 'node:crypto';
import type { PoolClient } from 'pg';

export type GuardResult<T> =
  | { replay: true; statusCode: number; response: T }
  | { replay: false; lockKey: string };

export function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  const object = value as Record<string, unknown>;
  return `{${Object.keys(object).sort().map(key => `${JSON.stringify(key)}:${canonicalJson(object[key])}`).join(',')}}`;
}

export function requestFingerprint(scope: string, actorId: string, body: unknown): string {
  return crypto.createHash('sha256').update(`${scope}\n${actorId}\n${canonicalJson(body)}`).digest('hex');
}

export async function beginGuard<T>(
  client: PoolClient,
  params: { scope: string; idempotencyKey: string; actorId: string; body: unknown; ttlMinutes?: number }
): Promise<GuardResult<T>> {
  const fingerprint = requestFingerprint(params.scope, params.actorId, params.body);
  const ttl = Math.min(Math.max(params.ttlMinutes ?? 1440, 5), 10080);
  const inserted = await client.query(
    `INSERT INTO operation_registry(scope,idempotency_key,actor_id,request_fingerprint,status,expires_at)
     VALUES($1,$2,$3,$4,'processing',now()+make_interval(mins=>$5))
     ON CONFLICT(scope,idempotency_key) DO NOTHING
     RETURNING scope`,
    [params.scope, params.idempotencyKey, params.actorId, fingerprint, ttl]
  );
  if (inserted.rowCount) return { replay: false, lockKey: fingerprint };

  const existing = await client.query(
    `SELECT request_fingerprint,status,response_status,response_body
       FROM operation_registry
      WHERE scope=$1 AND idempotency_key=$2 AND expires_at>now()
      FOR UPDATE`,
    [params.scope, params.idempotencyKey]
  );
  if (!existing.rowCount) throw new Error('IDEMPOTENCY_REGISTRY_EXPIRED');
  const row = existing.rows[0];
  if (row.request_fingerprint !== fingerprint) throw new Error('IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD');
  if (row.status === 'completed') {
    return { replay: true, statusCode: Number(row.response_status || 200), response: row.response_body as T };
  }
  throw new Error('OPERATION_ALREADY_IN_PROGRESS');
}

export async function completeGuard(
  client: PoolClient,
  params: { scope: string; idempotencyKey: string; statusCode: number; response: unknown }
) {
  await client.query(
    `UPDATE operation_registry
        SET status='completed',response_status=$3,response_body=$4::jsonb,completed_at=now()
      WHERE scope=$1 AND idempotency_key=$2`,
    [params.scope, params.idempotencyKey, params.statusCode, JSON.stringify(params.response)]
  );
}

export async function failGuard(client: PoolClient, scope: string, idempotencyKey: string, errorCode: string) {
  await client.query(
    `UPDATE operation_registry SET status='failed',error_code=$3,completed_at=now()
      WHERE scope=$1 AND idempotency_key=$2`,
    [scope, idempotencyKey, errorCode.slice(0, 120)]
  );
}
