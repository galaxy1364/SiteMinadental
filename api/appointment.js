'use strict';

const crypto = require('node:crypto');
const { applyCors, ensureJsonBody, json, requestId } = require('./_lib/http');
const { forwardEvent } = require('./_lib/forward');
const { validateAppointment } = require('./_lib/validation');

module.exports = async function handler(req, res) {
  if (!applyCors(req, res)) {
    return json(res, 403, { ok: false, code: 'ORIGIN_NOT_ALLOWED' });
  }
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
  }

  const parsed = ensureJsonBody(req);
  if (!parsed.ok) {
    return json(res, parsed.status, { ok: false, code: parsed.code });
  }

  const validated = validateAppointment(parsed.body);
  if (!validated.ok) {
    return json(res, 422, {
      ok: false,
      code: 'VALIDATION_FAILED',
      errors: validated.errors,
    });
  }

  const rid = requestId(req);
  const idempotencyKey = String(
    req.headers['idempotency-key'] || crypto.randomUUID(),
  ).slice(0, 128);
  const result = await forwardEvent(
    'public.appointment.requested',
    validated.value,
    idempotencyKey,
    rid,
  );

  if (!result.ok) {
    return json(res, result.status, {
      ok: false,
      code: result.code,
      request_id: rid,
      upstream_status: result.upstream_status || null,
    });
  }

  return json(res, 202, {
    ok: true,
    status: 'ACCEPTED',
    receipt_id: result.receipt_id,
    request_id: rid,
  });
};
