'use strict';

const { json } = require('./_lib/http');
const { isConfigured } = require('./_lib/forward');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
  }

  const aiConfigured = Boolean(
    process.env.AI_GATEWAY_API_KEY && process.env.AI_GATEWAY_MODEL,
  );
  const allowedOriginsConfigured = Boolean(process.env.ALLOWED_ORIGINS);

  return json(res, 200, {
    ok: true,
    service: 'kimi-dental-site-backend',
    contract_version: '2026-08-02.v1',
    environment: process.env.VERCEL_ENV || 'unknown',
    deployment: process.env.VERCEL_GIT_COMMIT_SHA || null,
    capabilities: {
      site_webhook: isConfigured(),
      assistant: aiConfigured,
      allowed_origins: allowedOriginsConfigured,
      durable_rate_limit: false,
    },
    production_ready: isConfigured() && aiConfigured && allowedOriginsConfigured,
    timestamp: new Date().toISOString(),
  });
};
