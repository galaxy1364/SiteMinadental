'use strict';

const assert = require('node:assert/strict');

function mockReq(method, body = null, headers = {}) {
  return { method, body, headers };
}

function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    payload: undefined,
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
    },
    status(value) {
      this.statusCode = value;
      return this;
    },
    json(value) {
      this.payload = value;
      return this;
    },
    end() {
      return this;
    },
  };
}

(async () => {
  delete process.env.MINADENT_WEBHOOK_URL;
  delete process.env.MINADENT_WEBHOOK_SECRET;
  delete process.env.AI_GATEWAY_API_KEY;
  delete process.env.AI_GATEWAY_MODEL;

  const health = require('../api/health');
  const appointment = require('../api/appointment');
  const contact = require('../api/contact');
  const assistant = require('../api/assistant');

  let res = mockRes();
  await health(mockReq('GET'), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.ok, true);
  assert.equal(res.payload.capabilities.minadent_webhook, false);

  res = mockRes();
  await appointment(
    mockReq('POST', {
      name: 'مینا',
      mobile: '۰۹۱۲۱۲۳۴۵۶۷',
      service: 'ایمپلنت',
    }),
    res,
  );
  assert.equal(res.statusCode, 503);
  assert.equal(res.payload.code, 'CONNECTION_NOT_CONFIGURED');

  res = mockRes();
  await appointment(
    mockReq('POST', { name: 'م', mobile: '123', service: '' }),
    res,
  );
  assert.equal(res.statusCode, 422);
  assert.equal(res.payload.code, 'VALIDATION_FAILED');

  res = mockRes();
  await contact(
    mockReq('POST', {
      name: 'مینا',
      mobile: '09121234567',
      message: 'سلام',
    }),
    res,
  );
  assert.equal(res.statusCode, 503);

  res = mockRes();
  await assistant(
    mockReq('POST', { question: 'برای درد دندان چه کنم؟' }),
    res,
  );
  assert.equal(res.statusCode, 503);
  assert.equal(res.payload.code, 'AI_NOT_CONFIGURED');

  console.log('contract-tests: PASS');
})();
