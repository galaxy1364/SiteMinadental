'use strict';

const crypto = require('node:crypto');
const MAX_BODY_BYTES = 32 * 1024;

function setSecurityHeaders(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
}

function json(res, status, body) {
  setSecurityHeaders(res);
  return res.status(status).json(body);
}

function requestId(req) {
  const value = req.headers['x-request-id'];
  return typeof value === 'string' && value.length <= 128 ? value : crypto.randomUUID();
}

function allowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  const allowed = allowedOrigins();
  if (!origin) return true;
  if (!allowed.includes(origin)) return false;
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Idempotency-Key,X-Request-Id');
  res.setHeader('Access-Control-Max-Age', '600');
  return true;
}

function ensureJsonBody(req) {
  const length = Number(req.headers['content-length'] || 0);
  if (length > MAX_BODY_BYTES) return { ok: false, status: 413, code: 'PAYLOAD_TOO_LARGE' };
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return { ok: false, status: 400, code: 'INVALID_JSON_BODY' };
  }
  return { ok: true, body: req.body };
}

module.exports = { applyCors, ensureJsonBody, json, requestId, setSecurityHeaders };
