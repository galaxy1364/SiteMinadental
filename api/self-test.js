'use strict';

const { json } = require('./_lib/http');
const { forwardEvent, isConfigured } = require('./_lib/forward');
const {
  validateAppointment,
  validateAssistant,
  validateContact,
} = require('./_lib/validation');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
  }

  const appointmentValid = validateAppointment({
    name: 'مینا',
    mobile: '۰۹۱۲۱۲۳۴۵۶۷',
    service: 'ایمپلنت',
  });
  const appointmentInvalid = validateAppointment({
    name: 'م',
    mobile: '123',
    service: '',
  });
  const contactValid = validateContact({
    name: 'مینا',
    mobile: '09121234567',
    message: 'سلام',
  });
  const assistantValid = validateAssistant({
    question: 'برای درد دندان چه کنم؟',
  });
  const disconnected = await forwardEvent(
    'public.appointment.requested',
    appointmentValid.value,
    'self-test-idempotency-key',
    'self-test-request-id',
  );

  const tests = {
    persian_mobile_normalized:
      appointmentValid.ok && appointmentValid.value.mobile === '09121234567',
    invalid_input_rejected:
      !appointmentInvalid.ok &&
      appointmentInvalid.errors.mobile === 'INVALID_IRANIAN_MOBILE',
    contact_validation: contactValid.ok,
    assistant_validation: assistantValid.ok,
    fake_success_blocked:
      isConfigured() ||
      (!disconnected.ok && disconnected.code === 'CONNECTION_NOT_CONFIGURED'),
  };

  return json(res, Object.values(tests).every(Boolean) ? 200 : 500, {
    ok: Object.values(tests).every(Boolean),
    tests,
    connection_configured: isConfigured(),
    note: 'No patient data is stored or forwarded by this self-test.',
    timestamp: new Date().toISOString(),
  });
};
