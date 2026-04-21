'use strict';

const { google } = require('googleapis');
const path       = require('path');
const fs         = require('fs');
const log        = require('./logger.service');
const cfg        = require('../config');

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Progress bar ──────────────────────────────────────────────────────────────

function progressBar(done, total, width = 40) {
  if (total === 0) return '[' + '░'.repeat(width) + '] 0% (0/0)';
  const pct  = Math.min(Math.round((done / total) * 100), 100);
  const fill = Math.round((pct / 100) * width);
  const bar  = '█'.repeat(fill) + '░'.repeat(width - fill);
  return `[${bar}] ${pct}% (${done}/${total})`;
}

function fmtBytes(b) {
  if (b < 1024)             return `${b} B`;
  if (b < 1024 * 1024)      return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(2)} MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

// ── MIME helpers ──────────────────────────────────────────────────────────────

function extractContent(payload) {
  const result = { html: null, plain: null, attachments: [] };
  function walk(part) {
    if (!part) return;
    const mime = (part.mimeType || '').toLowerCase();
    const data = part.body && part.body.data;
    if (mime === 'text/html' && !result.html && data) {
      result.html = Buffer.from(data, 'base64url').toString('utf-8');
    } else if (mime === 'text/plain' && !result.plain && data) {
      result.plain = Buffer.from(data, 'base64url').toString('utf-8');
    } else if (part.filename && part.body && part.body.attachmentId) {
      result.attachments.push({
        filename:     part.filename || `attachment_${result.attachments.length + 1}`,
        mimeType:     part.mimeType || 'application/octet-stream',
        attachmentId: part.body.attachmentId,
        size:         part.body.size || 0,
      });
    }
    if (Array.isArray(part.parts)) for (const child of part.parts) walk(child);
  }
  walk(payload);
  return result;
}

function getHeader(headers, name) {
  if (!Array.isArray(headers)) return '';
  const h = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return h ? h.value : '';
}

function sanitizeName(s) {
  return String(s || 'untitled').replace(/[/\\?%*:|"<>]/g, '_').replace(/\s+/g, '_').slice(0, 80);
}

function emailToFolder(email) {
  return String(email || 'unknown').toLowerCase().replace(/[/\\?%*:|"<>]/g, '_').slice(0, 100);
}

// ── harvestAll ────────────────────────────────────────────────────────────────
/**
 * List all message IDs first, then download sequentially.
 * Sequential is required: concurrent messages.get requests to the Gmail API
 * trigger per-user rate limits (250 quota units/sec; each get = 5 units).
 * A 150 ms gap between requests keeps throughput at ~6/sec, well inside limits.
 */
async function harvestAll(authedClient, email, onMessage) {
  const hlog    = log.harvest(email);
  const gmail   = google.gmail({ version: 'v1', auth: authedClient });
  const baseDir = path.resolve(cfg.downloadsPath, emailToFolder(email));
  const msgDir  = path.join(baseDir, 'messages');
  const stats   = {
    total: 0, downloaded: 0, failed: 0, bytesTotal: 0,
    attachmentCount: 0, attachmentBytes: 0,
    failedIds: [],
  };

  fs.mkdirSync(msgDir, { recursive: true });

  // ── Connected account ──────────────────────────────────────────────────────
  hlog.info(`══════════════════════════════════════════════════`);
  hlog.info(`  Gmail harvest starting`);
  hlog.info(`  Connected account : ${email}`);
  hlog.info(`══════════════════════════════════════════════════`);

  // 1. Collect all IDs
  hlog.info('Listing all message IDs…');
  let allIds;
  try {
    allIds = await listAllIds(gmail);
  } catch (err) {
    hlog.error(`Failed to list messages: ${err.message}`);
    throw err;
  }

  stats.total = allIds.length;
  hlog.info(`Found ${stats.total} message(s) to download`);
  try { onMessage({ type: 'total', total: stats.total, downloaded: 0, failed: 0 }); } catch (_) {}

  if (stats.total === 0) {
    hlog.info('No messages found — nothing to download.');
    writeSummary(baseDir, email, stats, hlog);
    return stats;
  }

  // 2. Download one at a time
  hlog.info(`Downloading ${stats.total} message(s)…`);

  for (let i = 0; i < allIds.length; i++) {
    const msgId = allIds[i].id;
    try {
      const { bytes, subject, from, attachments } = await fetchOne(gmail, msgId, msgDir, hlog);
      stats.downloaded++;
      stats.bytesTotal += bytes;
      stats.attachmentCount += attachments.length;
      stats.attachmentBytes += attachments.reduce((s, a) => s + (a.savedBytes || 0), 0);

      const bar = progressBar(stats.downloaded, stats.total);
      hlog.info(`${bar} | OK  | from="${from}" | subj="${subject.slice(0, 60)}"`);

      // Log each attachment
      for (const att of attachments) {
        hlog.info(
          `  ↳ attachment | file="${att.filename}" | type=${att.mimeType} | size=${fmtBytes(att.savedBytes || att.size || 0)}`
        );
      }

      try {
        onMessage({
          type: 'message', total: stats.total, downloaded: stats.downloaded,
          failed: stats.failed, subject, from,
        });
      } catch (_) {}

    } catch (err) {
      stats.failed++;
      stats.failedIds.push(msgId);
      const bar = progressBar(stats.downloaded, stats.total);
      hlog.error(`${bar} | FAIL | id=${msgId} | ${err.message}`);

      try {
        onMessage({
          type: 'failed', total: stats.total, downloaded: stats.downloaded,
          failed: stats.failed,
        });
      } catch (_) {}
    }

    if (i < allIds.length - 1) await sleep(150);
  }

  writeSummary(baseDir, email, stats, hlog);
  return stats;
}

async function listAllIds(gmail) {
  const ids = [];
  let pageToken;
  do {
    const res = await gmail.users.messages.list({
      userId: 'me', maxResults: 500, pageToken, includeSpamTrash: true,
    });
    if (res.data.messages) ids.push(...res.data.messages);
    pageToken = res.data.nextPageToken;
    if (pageToken) await sleep(200);
  } while (pageToken);
  return ids;
}

// ── Final scan summary ────────────────────────────────────────────────────────

function writeSummary(baseDir, email, stats, hlog) {
  const successRate = stats.total > 0
    ? ((stats.downloaded / stats.total) * 100).toFixed(1)
    : '0.0';

  hlog.info('══════════════════════════════════════════════════');
  hlog.info('  SCAN COMPLETE — SUMMARY');
  hlog.info('══════════════════════════════════════════════════');
  hlog.info(`  Account          : ${email}`);
  hlog.info(`  Total found      : ${stats.total}`);
  hlog.info(`  Downloaded       : ${stats.downloaded} (${successRate}%)`);
  hlog.info(`  Failed           : ${stats.failed}`);
  hlog.info(`  Attachments      : ${stats.attachmentCount} file(s) (${fmtBytes(stats.attachmentBytes)})`);
  hlog.info(`  Total data saved : ${fmtBytes(stats.bytesTotal)}`);
  if (stats.failedIds.length > 0) {
    hlog.warn(`  Failed IDs       : ${stats.failedIds.join(', ')}`);
  }
  hlog.info('══════════════════════════════════════════════════');

  const summaryData = {
    email,
    harvestedAt:       new Date().toISOString(),
    totalMessages:     stats.total,
    downloaded:        stats.downloaded,
    failed:            stats.failed,
    successRatePct:    parseFloat(successRate),
    bytesTotal:        stats.bytesTotal,
    attachmentCount:   stats.attachmentCount,
    attachmentBytes:   stats.attachmentBytes,
    failedMessageIds:  stats.failedIds,
  };

  fs.writeFileSync(
    path.join(baseDir, 'harvest_summary.json'),
    JSON.stringify(summaryData, null, 2)
  );
}

// ── Fetch & save one message (429-aware retry) ────────────────────────────────

async function fetchOne(gmail, messageId, msgDir, hlog) {
  const MAX = 5;
  let lastErr;
  for (let attempt = 1; attempt <= MAX; attempt++) {
    try {
      return await _download(gmail, messageId, msgDir);
    } catch (err) {
      lastErr = err;
      const is429 = err.code === 429
        || (err.response?.status === 429)
        || String(err.message).includes('rateLimitExceeded')
        || String(err.message).includes('userRateLimitExceeded');
      const wait = is429 ? 1000 * 2 ** (attempt - 1) : 400 * attempt;
      if (attempt < MAX) {
        hlog.warn(`Retry ${attempt}/${MAX - 1} for id=${messageId} — ${err.message} (wait ${wait}ms)`);
        await sleep(wait);
      }
    }
  }
  hlog.error(`Failed to download id=${messageId} after ${MAX} attempts — ${lastErr.message}`);
  throw lastErr;
}

async function _download(gmail, messageId, msgDir) {
  const res      = await gmail.users.messages.get({ userId: 'me', id: messageId, format: 'full' });
  const msg      = res.data;
  const headers  = msg.payload?.headers || [];
  const dateStr  = getHeader(headers, 'date');
  const dateObj  = dateStr ? new Date(dateStr) : new Date();
  const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
  const dir      = path.join(msgDir, monthKey, messageId);
  fs.mkdirSync(dir, { recursive: true });

  const { html, plain, attachments } = extractContent(msg.payload);
  const subject = getHeader(headers, 'subject') || '(no subject)';
  const from    = getHeader(headers, 'from')    || '';

  const meta = {
    id: messageId, threadId: msg.threadId, labels: msg.labelIds || [],
    from, to: getHeader(headers, 'to'), cc: getHeader(headers, 'cc'),
    subject, date: dateStr, snippet: msg.snippet || '',
    sizeEstimate: msg.sizeEstimate || 0, hasAttachments: attachments.length > 0,
  };
  const metaJson = JSON.stringify(meta, null, 2);
  fs.writeFileSync(path.join(dir, 'meta.json'), metaJson);
  let bytes = metaJson.length;

  if (html)  { fs.writeFileSync(path.join(dir, 'body.html'), html);  bytes += html.length; }
  if (plain) { fs.writeFileSync(path.join(dir, 'body.txt'),  plain); bytes += plain.length; }
  if (!html && !plain && msg.payload?.body?.data) {
    const raw = Buffer.from(msg.payload.body.data, 'base64url').toString('utf-8');
    fs.writeFileSync(path.join(dir, 'body.txt'), raw);
    bytes += raw.length;
  }

  const savedAttachments = [];

  if (attachments.length > 0) {
    const attDir = path.join(dir, 'attachments');
    fs.mkdirSync(attDir, { recursive: true });
    for (const att of attachments) {
      try {
        const r      = await gmail.users.messages.attachments.get({ userId: 'me', messageId, id: att.attachmentId });
        const buf    = Buffer.from(r.data.data, 'base64url');
        const fname  = sanitizeName(att.filename);
        fs.writeFileSync(path.join(attDir, fname), buf);
        bytes += buf.length;
        savedAttachments.push({ ...att, savedBytes: buf.length });
      } catch (e) {
        // Attachment-level failure — log at warn and continue
        savedAttachments.push({ ...att, savedBytes: 0, error: e.message });
        // Caller (harvestAll) will log this via the attachment list
      }
    }
  }

  return { bytes, subject, from, attachments: savedAttachments };
}

module.exports = { harvestAll };
