BEGIN;
CREATE TABLE IF NOT EXISTS campaign (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  code text UNIQUE,
  discount_type text NOT NULL DEFAULT 'percent' CHECK(discount_type IN ('percent','fixed','benefit')),
  discount_value numeric(14,2),
  starts_at timestamptz,
  ends_at timestamptz,
  enabled boolean NOT NULL DEFAULT false,
  eligibility jsonb NOT NULL DEFAULT '{}'::jsonb,
  terms_fa text,
  created_by uuid REFERENCES app_user(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at)
);
CREATE TABLE IF NOT EXISTS restore_verification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_id uuid NOT NULL REFERENCES system_backup(id) ON DELETE CASCADE,
  status text NOT NULL CHECK(status IN ('queued','running','verified','failed')),
  checksum_match boolean,
  structural_checks jsonb NOT NULL DEFAULT '{}'::jsonb,
  error_message text,
  requested_by uuid REFERENCES app_user(id),
  requested_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
CREATE TABLE IF NOT EXISTS service_incident (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_code text NOT NULL,
  severity text NOT NULL CHECK(severity IN ('info','warning','critical')),
  status text NOT NULL DEFAULT 'open' CHECK(status IN ('open','acknowledged','resolved')),
  title text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  detected_at timestamptz NOT NULL DEFAULT now(),
  acknowledged_by uuid REFERENCES app_user(id),
  acknowledged_at timestamptz,
  resolved_at timestamptz
);
CREATE INDEX IF NOT EXISTS campaign_active_idx ON campaign(enabled,starts_at,ends_at);
CREATE INDEX IF NOT EXISTS incident_open_idx ON service_incident(status,severity,detected_at DESC);
COMMIT;