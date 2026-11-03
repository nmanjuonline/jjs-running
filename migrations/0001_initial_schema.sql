-- JJs Running Edge Database Schema (Cloudflare D1)

CREATE TABLE IF NOT EXISTS state_store (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  expires_at INTEGER
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  center TEXT,
  program TEXT,
  experience_level TEXT,
  notes TEXT,
  source TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  program_id TEXT NOT NULL,
  program_title TEXT NOT NULL,
  runner_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  center_name TEXT NOT NULL,
  level TEXT NOT NULL,
  total_amount REAL,
  payment_status TEXT DEFAULT 'pending',
  raw_payload TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_program ON registrations(program_id);
CREATE INDEX IF NOT EXISTS idx_registrations_created ON registrations(created_at);

CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  push_endpoint TEXT UNIQUE,
  push_p256dh TEXT,
  push_auth TEXT,
  topics TEXT,
  status TEXT DEFAULT 'active',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS retry_queue (
  id TEXT PRIMARY KEY,
  target_type TEXT NOT NULL,
  payload TEXT NOT NULL,
  attempts INTEGER DEFAULT 0,
  last_attempt_at TEXT,
  next_retry_at TEXT NOT NULL,
  last_error TEXT
);

CREATE INDEX IF NOT EXISTS idx_retry_queue_next ON retry_queue(next_retry_at);

