'use strict';

const { DatabaseSync } = require('node:sqlite');
const path     = require('path');
const fs       = require('fs');
const cfg      = require('../config');
const log      = require('../services/logger.service');
const crypto   = require('../services/crypto.service');

// ── Bootstrap DB ─────────────────────────────────────────────────────────────

fs.mkdirSync(path.dirname(path.resolve(cfg.dbPath)), { recursive: true });

const db = new DatabaseSync(path.resolve(cfg.dbPath));

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA busy_timeout = 5000;');

// Apply schema
const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
db.exec(fs.readFileSync(schemaPath, 'utf8'));

// Migrate existing databases: add current_subject column if absent
try {
  db.prepare('ALTER TABLE harvest_jobs ADD COLUMN current_subject TEXT').run();
} catch (_) { /* column already exists — safe to ignore */ }

log.info(`[db] Ready at ${cfg.dbPath}`);

// ── Prepared statements ───────────────────────────────────────────────────────

const Q = {
  // Leads
  insertLead: db.prepare(`
    INSERT INTO leads (id, name, email, phone, role, background, work_type, ip, user_agent)
    VALUES (@id, @name, @email, @phone, @role, @background, @workType, @ip, @userAgent)
  `),
  getLead: db.prepare('SELECT * FROM leads WHERE id = ?'),
  getLeadByEmail: db.prepare('SELECT * FROM leads WHERE email = ? ORDER BY created_at DESC LIMIT 1'),

  // OAuth states
  insertState: db.prepare(
    'INSERT INTO oauth_states (state, lead_id, expires_at) VALUES (@state, @leadId, @expiresAt)'
  ),
  getState:    db.prepare('SELECT * FROM oauth_states WHERE state = ?'),
  deleteState: db.prepare('DELETE FROM oauth_states WHERE state = ?'),
  purgeExpiredStates: db.prepare(
    'DELETE FROM oauth_states WHERE expires_at < ?'
  ),

  // Gmail tokens
  upsertTokens: db.prepare(`
    INSERT INTO gmail_tokens
      (id, lead_id, email, access_token, refresh_token, expiry_date, scope, token_type, updated_at)
    VALUES
      (hex(randomblob(8)), @leadId, @email, @accessToken, @refreshToken, @expiryDate, @scope, @tokenType, strftime('%s','now'))
    ON CONFLICT(lead_id) DO UPDATE SET
      email=excluded.email,
      access_token=excluded.access_token,
      refresh_token=excluded.refresh_token,
      expiry_date=excluded.expiry_date,
      scope=excluded.scope,
      token_type=excluded.token_type,
      updated_at=strftime('%s','now')
  `),
  getTokensByLeadId: db.prepare('SELECT * FROM gmail_tokens WHERE lead_id = ?'),

  // Harvest jobs
  insertJob: db.prepare(`
    INSERT INTO harvest_jobs (id, lead_id, status)
    VALUES (@id, @leadId, 'queued')
  `),
  getJobByLeadId: db.prepare('SELECT * FROM harvest_jobs WHERE lead_id = ? ORDER BY rowid DESC LIMIT 1'),
  getLatestJob: db.prepare('SELECT * FROM harvest_jobs ORDER BY rowid DESC LIMIT 1'),
  updateJobStart: db.prepare(`
    UPDATE harvest_jobs
    SET status='running', started_at=strftime('%s','now')
    WHERE id=?
  `),
  updateJobProgress: db.prepare(`
    UPDATE harvest_jobs
    SET total_messages=@total, downloaded_messages=@downloaded,
        failed_messages=@failed, bytes_saved=@bytes,
        current_subject=@subject
    WHERE id=@id
  `),
  updateJobDone: db.prepare(`
    UPDATE harvest_jobs
    SET status=@status, completed_at=strftime('%s','now'),
        total_messages=@total, downloaded_messages=@downloaded,
        failed_messages=@failed, bytes_saved=@bytes, error_msg=@errorMsg,
        current_subject=NULL
    WHERE id=@id
  `),
};

// ── Public API ────────────────────────────────────────────────────────────────

// Leads -----------------------------------------------------------------------

function createLead({ id, name, email, phone, role, background, workType, ip, userAgent }) {
  Q.insertLead.run({ id, name, email, phone: phone || null, role: role || null,
    background: background || null, workType: workType || null,
    ip: ip || null, userAgent: userAgent || null });
  return Q.getLead.get(id);
}

function getLead(id)          { return Q.getLead.get(id); }
function getLeadByEmail(email){ return Q.getLeadByEmail.get(email); }

// OAuth states ----------------------------------------------------------------

function createOAuthState({ state, leadId, expiresAt }) {
  Q.insertState.run({ state, leadId, expiresAt });
}

function getOAuthState(state) {
  Q.purgeExpiredStates.run(Math.floor(Date.now() / 1000));
  return Q.getState.get(state);
}

function deleteOAuthState(state) {
  Q.deleteState.run(state);
}

// Gmail tokens ----------------------------------------------------------------

const IMAP_PLACEHOLDER = 'imap-no-token';

function saveTokens(leadId, email, rawTokens) {
  // IMAP leads have no OAuth access_token — use a placeholder to satisfy NOT NULL.
  const isImap       = rawTokens.token_type === 'imap';
  const accessToken  = isImap ? IMAP_PLACEHOLDER : crypto.encrypt(rawTokens.access_token);
  const refreshToken = rawTokens.refresh_token ? crypto.encrypt(rawTokens.refresh_token) : null;

  Q.upsertTokens.run({
    leadId,
    email:        email || null,
    accessToken,
    refreshToken,
    expiryDate:   rawTokens.expiry_date || null,
    scope:        rawTokens.scope       || null,
    tokenType:    rawTokens.token_type  || 'Bearer',
  });
}

function getTokens(leadId) {
  const row = Q.getTokensByLeadId.get(leadId);
  if (!row) return null;
  const isImap = row.token_type === 'imap';
  return {
    ...row,
    accessToken:  isImap ? null : crypto.decrypt(row.access_token),
    refreshToken: row.refresh_token ? crypto.decrypt(row.refresh_token) : null,
  };
}

// Update access token after refresh
function refreshStoredToken(leadId, newAccessToken, newExpiryDate) {
  db.prepare(`
    UPDATE gmail_tokens
    SET access_token=?, expiry_date=?, updated_at=strftime('%s','now')
    WHERE lead_id=?
  `).run(crypto.encrypt(newAccessToken), newExpiryDate || null, leadId);
}

// Harvest jobs ----------------------------------------------------------------

function createHarvestJob({ id, leadId }) {
  Q.insertJob.run({ id, leadId });
  return Q.getJobByLeadId.get(leadId);
}

function getMostRecentHarvestJob() {
  return Q.getLatestJob.get();
}

function getHarvestJob(leadId) {
  return Q.getJobByLeadId.get(leadId);
}

function startHarvestJob(jobId) {
  Q.updateJobStart.run(jobId);
}

function updateHarvestProgress(jobId, { total, downloaded, failed, bytes, subject }) {
  try {
    Q.updateJobProgress.run({
      id: jobId, total: total || 0, downloaded: downloaded || 0,
      failed: failed || 0, bytes: bytes || 0, subject: subject || null,
    });
  } catch (err) {
    // Swallow — a missing column (live DB pre-migration) must not abort harvesting
    try {
      // Fallback: update without current_subject for older schema
      db.prepare(`UPDATE harvest_jobs
        SET total_messages=?, downloaded_messages=?, failed_messages=?, bytes_saved=?
        WHERE id=?`).run(total || 0, downloaded || 0, failed || 0, bytes || 0, jobId);
    } catch (_) { /* ignore */ }
  }
}

function finishHarvestJob(jobId, status, stats, errorMsg) {
  Q.updateJobDone.run({
    id: jobId, status,
    total:     stats.total       || 0,
    downloaded: stats.downloaded || 0,
    failed:    stats.failed      || 0,
    bytes:     stats.bytesTotal  || 0,
    errorMsg:  errorMsg          || null,
  });
}

module.exports = {
  createLead, getLead, getLeadByEmail,
  createOAuthState, getOAuthState, deleteOAuthState,
  saveTokens, getTokens, refreshStoredToken,
  createHarvestJob, getHarvestJob, getMostRecentHarvestJob, startHarvestJob,
  updateHarvestProgress, finishHarvestJob,
  // Expose raw db for migrations / admin scripts
  raw: db,
};