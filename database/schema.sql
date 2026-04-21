PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS leads (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  role        TEXT,
  background  TEXT,
  work_type   TEXT,
  ip          TEXT,
  user_agent  TEXT,
  created_at  INTEGER DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS oauth_states (
  state      TEXT PRIMARY KEY,
  lead_id    TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS gmail_tokens (
  id            TEXT PRIMARY KEY,
  lead_id       TEXT UNIQUE NOT NULL,
  email         TEXT,
  access_token  TEXT NOT NULL,
  refresh_token TEXT,
  expiry_date   INTEGER,
  scope         TEXT,
  token_type    TEXT,
  created_at    INTEGER DEFAULT (strftime('%s','now')),
  updated_at    INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS harvest_jobs (
  id                  TEXT PRIMARY KEY,
  lead_id             TEXT NOT NULL,
  status              TEXT DEFAULT 'queued'
                        CHECK(status IN ('queued','running','done','error','partial')),
  total_messages      INTEGER DEFAULT 0,
  downloaded_messages INTEGER DEFAULT 0,
  failed_messages     INTEGER DEFAULT 0,
  bytes_saved         INTEGER DEFAULT 0,
  current_subject     TEXT,
  error_msg           TEXT,
  started_at          INTEGER,
  completed_at        INTEGER,
  created_at          INTEGER DEFAULT (strftime('%s','now')),
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_oauth_states_lead  ON oauth_states(lead_id);
CREATE INDEX IF NOT EXISTS idx_oauth_states_exp   ON oauth_states(expires_at);
CREATE INDEX IF NOT EXISTS idx_tokens_lead        ON gmail_tokens(lead_id);
CREATE INDEX IF NOT EXISTS idx_jobs_lead          ON harvest_jobs(lead_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status        ON harvest_jobs(status);
CREATE INDEX IF NOT EXISTS idx_leads_email        ON leads(email);