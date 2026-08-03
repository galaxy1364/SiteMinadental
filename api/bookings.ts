import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { withTransaction } from '../server/db.js';

const BookingInput = z.object({
  idempotencyKey: z.string().min(16).max(128),
  patient: z.object({
    fullName: z.string().trim().min(2).max(120),
    mobile: z.string().regex(/^09\d{9}$/)
  }),
  serviceCode: z.string().trim().min(2).max(80),
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
  sourceChannel: z.string().trim().min(2).max(40).default('website'),
  campaignId: z.string().trim().max(120).optional()
}).superRefine((value, ctx) => {
  const start = Date.parse(value.startsAt);
  const end = Date.parse(value.endsAt);
  if (!(end > start)) ctx.addIssue({ code: 'custom', path: ['endsAt'], message: 'INVALID_TIME_RANGE' });
  if (start < Date.now() + 30 * 60 * 1000) ctx.addIssue({ code: 'custom', path: ['startsAt'], message: 'MINIMUM_LEAD_TIME' });
});

function clientIp(req: VercelRequest): string {
  return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestId = String(req.headers['x-request-id'] || crypto.randomUUID());
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Request-Id', requestId);

  if (req.method !== 'POST') return res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED', requestId });
  if (!process.env.DATABASE_URL) return res.status(503).json({ ok: false, code: 'BACKEND_NOT_CONFIGURED', requestId });

  const parsed = BookingInput.safeParse(req.body);
  if (!parsed.success) return res.status(422).json({ ok: false, code: 'VALIDATION_ERROR', issues: parsed.error.issues, requestId });

  const input = parsed.data;
  try {
    const result = await withTransaction(async client => {
      const existing = await client.query(
        'SELECT id,status,starts_at,ends_at FROM appointment WHERE idempotency_key=$1',
        [input.idempotencyKey]
      );
      if (existing.rowCount) return { replay: true, appointment: existing.rows[0] };

      const patientResult = await client.query(
        `INSERT INTO patient(mobile,full_name)
         VALUES($1,$2)
         ON CONFLICT (mobile) DO UPDATE SET full_name=EXCLUDED.full_name, updated_at=now()
         RETURNING id`,
        [input.patient.mobile, input.patient.fullName]
      );

      const appointmentResult = await client.query(
        `INSERT INTO appointment(
          patient_id,starts_at,ends_at,service_code,status,source_channel,campaign_id,idempotency_key
        ) VALUES($1,$2,$3,$4,'pending',$5,$6,$7)
        RETURNING id,status,starts_at,ends_at,service_code`,
        [
          patientResult.rows[0].id,
          input.startsAt,
          input.endsAt,
          input.serviceCode,
          input.sourceChannel,
          input.campaignId || null,
          input.idempotencyKey
        ]
      );

      await client.query(
        `INSERT INTO audit_log(actor_type,action,entity_type,entity_id,request_id,ip_hash,after_data,integrity_hash)
         VALUES('public','booking.request','appointment',$1,$2,encode(digest($3,'sha256'),'hex'),$4::jsonb,
         encode(digest($1||$2||$3||$4,'sha256'),'hex'))`,
        [appointmentResult.rows[0].id, requestId, clientIp(req), JSON.stringify(appointmentResult.rows[0])]
      );

      await client.query(
        `INSERT INTO outbox_message(channel,recipient,template_code,payload)
         VALUES('sms',$1,'booking_received',$2::jsonb)`,
        [input.patient.mobile, JSON.stringify({ appointmentId: appointmentResult.rows[0].id, startsAt: input.startsAt })]
      );

      return { replay: false, appointment: appointmentResult.rows[0] };
    });

    return res.status(result.replay ? 200 : 201).json({ ok: true, ...result, requestId });
  } catch (error: any) {
    if (error?.constraint === 'appointment_no_overlap' || error?.code === '23P01') {
      return res.status(409).json({ ok: false, code: 'SLOT_CONFLICT', message: 'این بازه زمانی هم‌اکنون رزرو شده است.', requestId });
    }
    console.error('booking_failed', { requestId, error });
    return res.status(500).json({ ok: false, code: 'BOOKING_FAILED', requestId });
  }
}
