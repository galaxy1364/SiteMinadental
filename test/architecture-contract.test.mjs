import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = file => fs.readFileSync(file, 'utf8');

test('single source of truth is recorded', () => {
  const migration = read('db/migrations/20260804_001_operation_registry.sql');
  assert.match(migration, /ADR-001-SINGLE-SOURCE-OF-TRUTH/);
  assert.match(migration, /No parallel booking database/);
});

test('operation guard rejects idempotency key reuse with a different payload', () => {
  const source = read('server/operation-guard.ts');
  assert.match(source, /IDEMPOTENCY_KEY_REUSED_WITH_DIFFERENT_PAYLOAD/);
  assert.match(source, /OPERATION_ALREADY_IN_PROGRESS/);
  assert.match(source, /canonicalJson/);
});

test('migrations are immutable and serialized', () => {
  const source = read('scripts/migrate.mjs');
  assert.match(source, /MIGRATION_CHANGED_AFTER_APPLY/);
  assert.match(source, /pg_advisory_xact_lock/);
  assert.match(source, /checksum_sha256/);
});

test('booking database keeps overlap exclusion constraint', () => {
  const schema = read('db/schema.sql');
  assert.match(schema, /appointment_no_overlap/);
  assert.match(schema, /EXCLUDE USING gist/);
});

test('no duplicate runtime module loader is allowed', () => {
  const siteCore = read('site-core.js');
  assert.match(siteCore, /data\.minaModule|dataset\.minaModule/);
  assert.match(siteCore, /some\(script/);
});
