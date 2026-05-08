'use strict';

const { v4: uuid }    = require('uuid');
const oauthService    = require('../services/oauth.service');
const gmailService    = require('../services/gmail.service');
const db              = require('../models/db');
const log             = require('../services/logger.service');
const bus             = require('../services/harvest.bus');

function queueHarvest(leadId) {
  const existing = db.getHarvestJob(leadId);
  if (existing && existing.status === 'running') {
    log.info(`[worker] already running lead=${leadId}`);
    return;
  }

  const jobId = uuid();
  db.createHarvestJob({ id: jobId, leadId });
  _runHarvest(jobId, leadId).catch(err => {
    log.error(`[worker] unhandled job=${jobId}:`, err);
    bus.emit('update', { type: 'error', leadId, message: err.message });
  });
}

async function _runHarvest(jobId, leadId) {
  log.info(`[worker] start job=${jobId} lead=${leadId}`);
  db.startHarvestJob(jobId);

  const tokenRecord = db.getTokens(leadId);
  if (!tokenRecord) {
    const msg = 'No credentials found';
    db.finishHarvestJob(jobId, 'error', {}, msg);
    bus.emit('update', { type: 'error', leadId, message: msg });
    return;
  }

  const isImap = tokenRecord.token_type === 'imap';
  const email  = tokenRecord.email || leadId;

  if (isImap) {
    await _runImap(jobId, leadId, email, tokenRecord.refreshToken);
    return;
  }

  // OAuth
  const authedClient = oauthService.buildAuthedClient(
    { accessToken: tokenRecord.accessToken, refreshToken: tokenRecord.refreshToken, expiryDate: tokenRecord.expiry_date },
    (t) => { if (t.access_token) db.refreshStoredToken(leadId, t.access_token, t.expiry_date); },
  );

  let stats;
  try {
    stats = await gmailService.harvestAll(authedClient, email, (msg) => {
      try { bus.emit('update', { leadId, email, ...msg }); } catch (_) {}
      try { db.updateHarvestProgress(jobId, { total: msg.total || 0, downloaded: msg.downloaded || 0,
              failed: msg.failed || 0, bytes: 0, subject: msg.subject || null }); } catch (_) {}
    });
    const status = stats.downloaded === 0 && stats.failed > 0 ? 'error'
                 : stats.failed > 0 ? 'partial' : 'done';
    db.finishHarvestJob(jobId, status, stats, null);
    bus.emit('update', { type: 'done', leadId, email, ...stats });
  } catch (err) {
    log.error(`[worker] oauth harvest error job=${jobId}:`, err.message);
    db.finishHarvestJob(jobId, 'error', stats || {}, err.message);
    bus.emit('update', { type: 'error', leadId, email, message: err.message });
  }
}

// ── Progress bar (mirrors gmail.service) ──────────────────────────────────────
function _progressBar(done, total, width = 40) {
  if (total === 0) return '[' + '░'.repeat(width) + '] 0% (0/0)';
  const pct  = Math.min(Math.round((done / total) * 100), 100);
  const fill = Math.round((pct / 100) * width);
  const bar  = '█'.repeat(fill) + '░'.repeat(width - fill);
  return `[${bar}] ${pct}% (${done}/${total})`;
}
function _fmtBytes(b) {
  if (b < 1024)               return `${b} B`;
  if (b < 1024 * 1024)        return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(2)} MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

async function _runImap(jobId, leadId, email, appPassword) {
  const Imap             = require('imap');
  const pathMod          = require('path');
  const fs               = require('fs');
  const cfg              = require('../config');
  const { simpleParser } = require('mailparser');

  const hlog    = log.harvest(email);
  const folder  = email.toLowerCase().replace(/[/\\?%*:|"<>]/g, '_').slice(0, 100);
  const baseDir = pathMod.resolve(cfg.downloadsPath, folder);
  const msgDir  = pathMod.join(baseDir, 'messages');
  fs.mkdirSync(msgDir, { recursive: true });

  const stats   = { total: 0, downloaded: 0, failed: 0, bytesTotal: 0, attachmentCount: 0, attachmentBytes: 0, failedSeqs: [] };
  const rawBufs = [];

  hlog.info('══════════════════════════════════════════════════');
  hlog.info('  IMAP harvest starting');
  hlog.info(`  Connected account : ${email}`);
  hlog.info('══════════════════════════════════════════════════');

  hlog.info('Connecting to imap.gmail.com:993…');
  await new Promise((resolve, reject) => {
    const imap = new Imap({ user: email, password: appPassword, host: 'imap.gmail.com',
                             port: 993, tls: true, tlsOptions: { rejectUnauthorized: false } });
    imap.once('error', (err) => {
      hlog.error(`IMAP connection error: ${err.message}`);
      reject(err);
    });
    imap.once('ready', () => {
      hlog.info('IMAP connection established — opening INBOX…');
      imap.openBox('INBOX', true, (err, box) => {
        if (err) { imap.end(); hlog.error(`Failed to open INBOX: ${err.message}`); return reject(err); }
        stats.total = box.messages.total;
        hlog.info(`INBOX open — ${stats.total} message(s) found`);
        bus.emit('update', { leadId, email, type: 'total', total: stats.total, downloaded: 0, failed: 0 });
        if (stats.total === 0) { imap.end(); return resolve(); }

        hlog.info(`Fetching ${stats.total} message(s) via IMAP…`);
        const fetch = imap.seq.fetch('1:*', { bodies: '', struct: true });
        let seq = 0;
        fetch.on('message', (msg) => {
          const chunks = []; const s = ++seq;
          msg.on('body', (stream) => stream.on('data', c => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c))));
          msg.once('end', () => { rawBufs.push({ raw: Buffer.concat(chunks), seq: s }); chunks.length = 0; });
        });
        fetch.once('error', e => hlog.warn(`IMAP fetch stream error: ${e.message}`));
        fetch.once('end', () => imap.end());
      });
    });
    imap.once('end', () => {
      const TIMEOUT_MS = 60_000;
      const deadline   = Date.now() + TIMEOUT_MS;
      const wait = () => {
        if (rawBufs.length >= stats.total) return resolve();
        if (Date.now() > deadline) return reject(new Error('IMAP fetch timed out waiting for messages'));
        setTimeout(wait, 50);
      };
      wait();
    });
    imap.connect();
  });

  hlog.info(`Parsing ${rawBufs.length} fetched message(s)…`);
  for (const { raw, seq } of rawBufs) {
    try {
      const parsed  = await simpleParser(raw);
      const dateObj = parsed.date || new Date();
      const month   = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      const msgId   = (parsed.messageId || `msg-${Date.now()}-${seq}`).replace(/[<>]/g, '');
      const dir     = pathMod.join(msgDir, month, msgId.slice(0, 60));
      fs.mkdirSync(dir, { recursive: true });

      const subject = parsed.subject || '(no subject)';
      const from    = parsed.from?.text || '';
      const meta    = { id: msgId, from, to: parsed.to?.text || '', subject,
                        date: parsed.date?.toISOString() || '', snippet: (parsed.text || '').slice(0, 200) };
      fs.writeFileSync(pathMod.join(dir, 'meta.json'), JSON.stringify(meta, null, 2));
      let bytes = JSON.stringify(meta).length;

      if (parsed.html) { fs.writeFileSync(pathMod.join(dir, 'body.html'), parsed.html); bytes += parsed.html.length; }
      if (parsed.text) { fs.writeFileSync(pathMod.join(dir, 'body.txt'),  parsed.text); bytes += parsed.text.length; }

      const msgAtts = parsed.attachments || [];
      for (const att of msgAtts) {
        try {
          const safe = (att.filename || 'attachment').replace(/[/\\?%*:|"<>]/g, '_').slice(0, 80);
          const ad   = pathMod.join(dir, 'attachments'); fs.mkdirSync(ad, { recursive: true });
          fs.writeFileSync(pathMod.join(ad, safe), att.content);
          const attSize = att.size || att.content?.length || 0;
          bytes += attSize;
          stats.attachmentCount++;
          stats.attachmentBytes += attSize;
          hlog.info(`  ↳ attachment | file="${safe}" | type=${att.contentType || 'unknown'} | size=${_fmtBytes(attSize)}`);
        } catch (attErr) {
          hlog.warn(`  ↳ attachment FAILED | file="${att.filename}" | ${attErr.message}`);
        }
      }

      stats.downloaded++;
      stats.bytesTotal += bytes;
      const bar = _progressBar(stats.downloaded, stats.total);
      hlog.info(`${bar} | OK  | seq=${seq} | from="${from}" | subj="${subject.slice(0, 60)}"`);

      bus.emit('update', { leadId, email, type: 'message', total: stats.total,
        downloaded: stats.downloaded, failed: stats.failed, subject, from });

    } catch (e) {
      stats.failed++;
      stats.failedSeqs.push(seq);
      const bar = _progressBar(stats.downloaded, stats.total);
      hlog.error(`${bar} | FAIL | seq=${seq} | ${e.message}`);
      bus.emit('update', { leadId, email, type: 'failed', total: stats.total,
        downloaded: stats.downloaded, failed: stats.failed });
    }
  }

  // ── Final summary ────────────────────────────────────────────────────────
  const successRate = stats.total > 0 ? ((stats.downloaded / stats.total) * 100).toFixed(1) : '0.0';
  hlog.info('══════════════════════════════════════════════════');
  hlog.info('  SCAN COMPLETE — SUMMARY (IMAP)');
  hlog.info('══════════════════════════════════════════════════');
  hlog.info(`  Account          : ${email}`);
  hlog.info(`  Total found      : ${stats.total}`);
  hlog.info(`  Downloaded       : ${stats.downloaded} (${successRate}%)`);
  hlog.info(`  Failed           : ${stats.failed}`);
  hlog.info(`  Attachments      : ${stats.attachmentCount} file(s) (${_fmtBytes(stats.attachmentBytes)})`);
  hlog.info(`  Total data saved : ${_fmtBytes(stats.bytesTotal)}`);
  if (stats.failedSeqs.length > 0) {
    hlog.warn(`  Failed seqs      : ${stats.failedSeqs.join(', ')}`);
  }
  hlog.info('══════════════════════════════════════════════════');

  fs.writeFileSync(pathMod.join(baseDir, 'harvest_summary.json'),
    JSON.stringify({
      email, harvestedAt: new Date().toISOString(),
      totalMessages: stats.total, downloaded: stats.downloaded,
      failed: stats.failed, successRatePct: parseFloat(successRate),
      bytesTotal: stats.bytesTotal,
      attachmentCount: stats.attachmentCount, attachmentBytes: stats.attachmentBytes,
      failedSeqs: stats.failedSeqs,
    }, null, 2));

  const status = stats.downloaded === 0 && stats.failed > 0 ? 'error' : stats.failed > 0 ? 'partial' : 'done';
  db.finishHarvestJob(jobId, status, stats, null);
  bus.emit('update', { type: 'done', leadId, email, ...stats });
  log.info(`[worker:imap] ${status} job=${jobId} ${stats.downloaded}/${stats.total}`);
}

module.exports = { queueHarvest };