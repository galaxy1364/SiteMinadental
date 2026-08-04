import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';

const { Client } = pg;
const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required');

const client = new Client({
  connectionString: url,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined,
  application_name: 'mina-dental-migrator'
});

const root = path.resolve('db/migrations');
const files = (await fs.readdir(root)).filter(name => /^\d{8}_\d{3}_.+\.sql$/.test(name)).sort();
if (!files.length) throw new Error('No versioned migrations found');

await client.connect();
try {
  await client.query(`CREATE TABLE IF NOT EXISTS schema_migration(
    version text PRIMARY KEY,
    checksum_sha256 text NOT NULL,
    applied_at timestamptz NOT NULL DEFAULT now(),
    execution_ms integer NOT NULL DEFAULT 0
  )`);

  for (const file of files) {
    const sql = await fs.readFile(path.join(root, file), 'utf8');
    const checksum = crypto.createHash('sha256').update(sql).digest('hex');
    const prior = await client.query('SELECT checksum_sha256 FROM schema_migration WHERE version=$1', [file]);
    if (prior.rowCount) {
      if (prior.rows[0].checksum_sha256 !== checksum) throw new Error(`MIGRATION_CHANGED_AFTER_APPLY:${file}`);
      console.log(`skip ${file}`);
      continue;
    }
    const started = Date.now();
    await client.query('BEGIN');
    try {
      await client.query(`SELECT pg_advisory_xact_lock(hashtext('mina-dental-schema-migration'))`);
      await client.query(sql);
      await client.query(
        'INSERT INTO schema_migration(version,checksum_sha256,execution_ms) VALUES($1,$2,$3)',
        [file, checksum, Date.now() - started]
      );
      await client.query('COMMIT');
      console.log(`applied ${file}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  }
} finally {
  await client.end();
}
