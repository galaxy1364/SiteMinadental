BEGIN;

CREATE TABLE IF NOT EXISTS rate_limit_bucket (
  bucket_key text PRIMARY KEY,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  hits integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_updated_at ON rate_limit_bucket(updated_at);

CREATE TABLE IF NOT EXISTS clinic_setting (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  version bigint NOT NULL DEFAULT 1,
  updated_by uuid REFERENCES app_user(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS integration_credential_state (
  provider text PRIMARY KEY,
  configured boolean NOT NULL DEFAULT false,
  last_verified_at timestamptz,
  status text NOT NULL DEFAULT 'not_configured',
  last_error_code text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS backup_job (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','succeeded','failed')),
  storage_provider text,
  object_key text,
  checksum text,
  encrypted boolean NOT NULL DEFAULT true,
  started_at timestamptz,
  completed_at timestamptz,
  error_code text,
  created_by uuid REFERENCES app_user(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_created_at ON audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointment_start_status ON appointment(starts_at, status);
CREATE INDEX IF NOT EXISTS idx_message_queue_status_created ON message_queue(status, created_at);
CREATE INDEX IF NOT EXISTS idx_conversation_patient_created ON ai_conversation(patient_id, created_at DESC);

INSERT INTO role (code,title_fa) VALUES
 ('owner','مالک'),('admin','مدیر'),('secretary','منشی'),('doctor','پزشک'),
 ('marketing','بازاریابی'),('content','محتوا'),('viewer','مشاهده‌گر')
ON CONFLICT (code) DO UPDATE SET title_fa=EXCLUDED.title_fa;

COMMIT;
