BEGIN;

CREATE TABLE IF NOT EXISTS schema_migration (
  version text PRIMARY KEY,
  checksum_sha256 text NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT now(),
  execution_ms integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS operation_registry (
  scope text NOT NULL,
  idempotency_key text NOT NULL,
  actor_id text NOT NULL,
  request_fingerprint char(64) NOT NULL,
  status text NOT NULL CHECK (status IN ('processing','completed','failed')),
  response_status integer,
  response_body jsonb,
  error_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  expires_at timestamptz NOT NULL,
  PRIMARY KEY(scope,idempotency_key)
);

CREATE INDEX IF NOT EXISTS operation_registry_expiry_idx ON operation_registry(expires_at);
CREATE INDEX IF NOT EXISTS operation_registry_actor_idx ON operation_registry(actor_id,created_at DESC);

CREATE TABLE IF NOT EXISTS architecture_decision (
  id bigserial PRIMARY KEY,
  decision_key text UNIQUE NOT NULL,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN ('proposed','accepted','superseded','rejected')),
  context text NOT NULL,
  decision text NOT NULL,
  consequences text NOT NULL,
  supersedes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO architecture_decision(decision_key,title,status,context,decision,consequences)
VALUES(
  'ADR-001-SINGLE-SOURCE-OF-TRUTH',
  'MinaDent is the operational source of truth',
  'accepted',
  'Multiple booking, campaign and patient systems create duplicate records and conflicting capacity.',
  'All public channels write through the MinaDent API. External platforms remain acquisition channels and must synchronize into the same appointment and patient contracts.',
  'No parallel booking database, no duplicate admin workflow and no success response before the authoritative transaction commits.'
)
ON CONFLICT(decision_key) DO NOTHING;

COMMIT;
