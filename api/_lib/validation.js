'use strict';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

function asciiDigits(value) {
  return String(value ?? '')
    .replace(/[۰-۹]/g, (char) => String(PERSIAN_DIGITS.indexOf(char)))
    .replace(/[٠-٩]/g, (char) => String(ARABIC_DIGITS.indexOf(char)));
}

function cleanText(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

function validateMobile(value) {
  const mobile = asciiDigits(value).trim();
  return /^09[0-9]{9}$/.test(mobile) ? mobile : null;
}

function validateAppointment(input) {
  const errors = {};
  const name = cleanText(input.name, 80);
  const mobile = validateMobile(input.mobile);
  const service = cleanText(input.service, 120);
  const preferredTime = cleanText(input.preferred_time, 120);
  const notes = cleanText(input.notes, 1500);
  if (name.length < 2) errors.name = 'INVALID_NAME';
  if (!mobile) errors.mobile = 'INVALID_IRANIAN_MOBILE';
  if (!service) errors.service = 'SERVICE_REQUIRED';
  if (input.website) errors.website = 'BOT_DETECTED';
  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: { name, mobile, service, preferred_time: preferredTime, notes },
  };
}

function validateContact(input) {
  const errors = {};
  const name = cleanText(input.name, 80);
  const mobile = validateMobile(input.mobile);
  const subject = cleanText(input.subject, 160);
  const message = cleanText(input.message, 2000);
  if (name.length < 2) errors.name = 'INVALID_NAME';
  if (!mobile) errors.mobile = 'INVALID_IRANIAN_MOBILE';
  if (message.length < 3) errors.message = 'MESSAGE_REQUIRED';
  if (input.website) errors.website = 'BOT_DETECTED';
  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: { name, mobile, subject, message },
  };
}

function validateAssistant(input) {
  const question = cleanText(input.question, 800);
  const errors = {};
  if (question.length < 2) errors.question = 'QUESTION_REQUIRED';
  return { ok: Object.keys(errors).length === 0, errors, value: { question } };
}

module.exports = {
  asciiDigits,
  cleanText,
  validateAppointment,
  validateAssistant,
  validateContact,
  validateMobile,
};
