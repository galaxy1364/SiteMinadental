'use strict';

const crypto = require('node:crypto');

function configuration() {
  return {
    webhookUrl: process.env.MINADENT_WEBHOOK_URL || '',
    webhookSecret: process.env.MINADENT_WEBHOOK_SECRET || '',
  };
}

function isConfigured() {
  const cfg = configuration();
  return Boolean(cfg.webhookUrl && cfg.webhookSecret);
}

async function forwardEvent(type, payload, idempotencyKey, requestId) {
  const cfg = configuration();
  if (!cfg.webhookUrl || !cfg.webhookSecret) {
    return { ok: false, status: 503, code: 'CONNECTION_NOT_CONFIGURED' };
  }

  const event = {
    contract_version: '2026-08-02.v1',
    event_id: crypto.randomUUID(),
    request_id: requestId,
    idempotency_key: idempotencyKey,
    occurred_at: new Date().toISOString(),
    source: 'siteminadental',
    type,
    payload,
  };
  const raw = JSON.stringify(event);
  const signature = crypto.createHmac('sha256', cfg.webhookSecret).update(raw).digest('hex');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(cfg.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
        'X-MinaDent-Contract': event.contract_version,
        'X-MinaDent-Signature': `sha256=${signature}`,
        'X-Request-Id': requestId,
      },
      body: raw,
      signal: controller.signal,
    });
    if (!response.ok) {
      return {
        ok: false,
        status: 502,
        code: 'UPSTREAM_REJECTED',
        upstream_status: response.status,
      };
    }
    return { ok: true, status: 202, receipt_id: event.event_id };
  } catch (error) {
    return {
      ok: false,
      status: 502,
      code: error && error.name === 'AbortError' ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_UNREACHABLE',
    };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { forwardEvent, isConfigured };
