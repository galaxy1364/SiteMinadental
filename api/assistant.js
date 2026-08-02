'use strict';

const { applyCors, ensureJsonBody, json, requestId } = require('./_lib/http');
const { validateAssistant } = require('./_lib/validation');

const SYSTEM_PROMPT = `شما راهنمای عمومی سایت دندانپزشکی هستید. تشخیص، نسخه، تضمین نتیجه یا جایگزینی پزشک ممنوع است. پاسخ‌ها کوتاه، فارسی و ایمن باشند. در علائم هشدار مانند خونریزی کنترل‌نشده، تورم سریع صورت یا گردن، تنگی نفس، تب شدید، ضربه شدید یا درد غیرقابل‌کنترل، مراجعه فوری حضوری یا اورژانس را توصیه کن. اطلاعات شخصی بیمار را درخواست نکن.`;

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

  const validated = validateAssistant(parsed.body);
  if (!validated.ok) {
    return json(res, 422, {
      ok: false,
      code: 'VALIDATION_FAILED',
      errors: validated.errors,
    });
  }

  const apiKey = process.env.AI_GATEWAY_API_KEY;
  const model = process.env.AI_GATEWAY_MODEL;
  const baseUrl = process.env.AI_GATEWAY_BASE_URL || 'https://ai-gateway.vercel.sh/v1';
  const rid = requestId(req);

  if (!apiKey || !model) {
    return json(res, 503, {
      ok: false,
      code: 'AI_NOT_CONFIGURED',
      request_id: rid,
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(
      `${baseUrl.replace(/\/$/, '')}/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 500,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: validated.value.question },
          ],
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return json(res, 502, {
        ok: false,
        code: 'AI_UPSTREAM_REJECTED',
        request_id: rid,
        upstream_status: response.status,
      });
    }

    const data = await response.json();
    const answer = data?.choices?.[0]?.message?.content;
    if (!answer) {
      return json(res, 502, {
        ok: false,
        code: 'AI_EMPTY_RESPONSE',
        request_id: rid,
      });
    }

    return json(res, 200, {
      ok: true,
      answer,
      request_id: rid,
      disclaimer: 'راهنمای عمومی است و جایگزین معاینه یا تشخیص پزشک نیست.',
    });
  } catch (error) {
    return json(res, 502, {
      ok: false,
      code:
        error && error.name === 'AbortError'
          ? 'AI_TIMEOUT'
          : 'AI_UNREACHABLE',
      request_id: rid,
    });
  } finally {
    clearTimeout(timeout);
  }
};
