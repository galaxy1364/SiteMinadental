BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS app_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile varchar(16) UNIQUE,
  email text UNIQUE,
  display_name text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','blocked','deleted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS role (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  title_fa text NOT NULL
);

CREATE TABLE IF NOT EXISTS user_role (
  user_id uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES role(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS patient (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES app_user(id) ON DELETE SET NULL,
  external_minadent_id text UNIQUE,
  mobile varchar(16) NOT NULL,
  full_name text NOT NULL,
  consent_marketing boolean NOT NULL DEFAULT false,
  consent_ai boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clinic_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday smallint CHECK (weekday BETWEEN 0 AND 6),
  jalali_date char(10),
  starts_at time,
  ends_at time,
  slot_minutes integer NOT NULL DEFAULT 30 CHECK (slot_minutes BETWEEN 5 AND 240),
  capacity integer NOT NULL DEFAULT 1 CHECK (capacity BETWEEN 0 AND 100),
  is_closed boolean NOT NULL DEFAULT false,
  source text NOT NULL DEFAULT 'minadent',
  version bigint NOT NULL DEFAULT 1,
  updated_by uuid REFERENCES app_user(id),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (weekday IS NOT NULL OR jalali_date IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS appointment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patient(id),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  service_code text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','arrived','completed','cancelled','no_show')),
  source_channel text NOT NULL DEFAULT 'website',
  campaign_id text,
  idempotency_key text NOT NULL UNIQUE,
  external_minadent_id text UNIQUE,
  created_by uuid REFERENCES app_user(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE appointment DROP CONSTRAINT IF EXISTS appointment_no_overlap;
ALTER TABLE appointment ADD CONSTRAINT appointment_no_overlap
EXCLUDE USING gist (
  tstzrange(starts_at, ends_at, '[)') WITH &&
) WHERE (status IN ('pending','confirmed','arrived'));

CREATE TABLE IF NOT EXISTS otp_challenge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  destination varchar(64) NOT NULL,
  purpose text NOT NULL,
  code_hash text NOT NULL,
  attempts integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS otp_destination_idx ON otp_challenge(destination, purpose, created_at DESC);

CREATE TABLE IF NOT EXISTS session_token (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
  token_hash text UNIQUE NOT NULL,
  user_agent_hash text,
  ip_prefix text,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patient(id),
  channel text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','handoff','closed')),
  assigned_to uuid REFERENCES app_user(id),
  summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversation_message (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversation(id) ON DELETE CASCADE,
  sender_type text NOT NULL CHECK (sender_type IN ('patient','staff','assistant','system')),
  body text NOT NULL,
  model text,
  tool_call jsonb,
  safety_flags jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS push_subscription (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES app_user(id) ON DELETE CASCADE,
  endpoint text UNIQUE NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  locale text NOT NULL DEFAULT 'fa-IR',
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS outbox_message (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL CHECK (channel IN ('sms','push','bale','eitaa','rubika','meta','google_ads')),
  recipient text NOT NULL,
  template_code text,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','sent','failed','cancelled')),
  attempts integer NOT NULL DEFAULT 0,
  available_at timestamptz NOT NULL DEFAULT now(),
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);
CREATE INDEX IF NOT EXISTS outbox_ready_idx ON outbox_message(status, available_at);

CREATE TABLE IF NOT EXISTS campaign_attribution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patient(id),
  appointment_id uuid REFERENCES appointment(id),
  source text,
  medium text,
  campaign text,
  content text,
  term text,
  click_id text,
  cost numeric(14,2),
  revenue numeric(14,2),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id bigserial PRIMARY KEY,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_user_id uuid REFERENCES app_user(id),
  actor_type text NOT NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  request_id text,
  ip_hash text,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  integrity_hash text NOT NULL
);
CREATE INDEX IF NOT EXISTS audit_entity_idx ON audit_log(entity_type, entity_id, occurred_at DESC);

CREATE TABLE IF NOT EXISTS system_backup (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  object_key text NOT NULL UNIQUE,
  checksum_sha256 text NOT NULL,
  encrypted boolean NOT NULL DEFAULT true,
  status text NOT NULL CHECK (status IN ('created','verified','failed','expired')),
  created_at timestamptz NOT NULL DEFAULT now(),
  verified_at timestamptz
);

INSERT INTO role(code,title_fa) VALUES
 ('super_admin','مدیر ارشد'),('clinic_admin','مدیر کلینیک'),('doctor','پزشک'),('secretary','منشی'),('marketing','بازاریابی'),('patient','بیمار')
ON CONFLICT (code) DO NOTHING;

COMMIT;
