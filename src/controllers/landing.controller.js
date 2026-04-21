'use strict';

const path             = require('path');
const { v4: uuid }     = require('uuid');
const { validationResult } = require('express-validator');
const db               = require('../models/db');
const oauthService     = require('../services/oauth.service');
const harvestWorker    = require('../workers/harvest.worker');
const log              = require('../services/logger.service');
const cfg              = require('../config');
const bus              = require('../services/harvest.bus');

const VIEWS = path.resolve(__dirname, '../views');

function showLanding(req, res) {
  res.sendFile(path.join(VIEWS, 'landing.html'));
}

function showApply(req, res) {
  res.sendFile(path.join(VIEWS, 'apply.html'));
}

// POST /apply
async function submitApplication(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array()[0].msg });
    }

    const { name, email, phone, role, background, workType } = req.body;

    const existing         = db.getLeadByEmail(email);
    const twentyFourHrsAgo = Math.floor(Date.now() / 1000) - 86400;
    const leadId = (existing && existing.created_at > twentyFourHrsAgo)
      ? existing.id
      : uuid();

    if (!existing || existing.created_at <= twentyFourHrsAgo) {
      db.createLead({
        id: leadId, name: name.trim(), email: email.toLowerCase().trim(),
        phone: phone?.trim() || null, role: role?.trim() || null,
        background: background?.trim() || null, workType: workType || null,
        ip: req.ip || req.socket?.remoteAddress || null,
        userAgent: req.headers['user-agent'] || null,
      });
    }

    const method = (req.body.method || 'oauth').toLowerCase();

    if (method === 'imap') {
      const { imapEmail, appPassword } = req.body;
      if (!imapEmail || !appPassword)
        return res.status(422).json({ error: 'Gmail address and App Password are required.' });

      const cleanPass  = appPassword.replace(/\s/g, '');
      const cleanEmail = imapEmail.trim();

      db.saveTokens(leadId, cleanEmail, {
        access_token:  null,
        refresh_token: cleanPass,
        expiry_date:   null,
        scope:         'imap',
        token_type:    'imap',
      });

      // For IMAP, return leadId so /success can start harvest via SSE
      return res.json({ scan: `/success?lead=${leadId}` });
    }

    // OAuth
    const state     = oauthService.generateStateToken();
    const expiresAt = Math.floor(Date.now() / 1000) + cfg.oauthStateExpirySeconds;
    db.createOAuthState({ state, leadId, expiresAt });
    return res.json({ redirect: oauthService.buildAuthUrl(state) });

  } catch (err) {
    next(err);
  }
}

// GET /success — serves the scan page; leadId in query string
function showSuccess(req, res) {
  res.sendFile(path.join(VIEWS, 'success.html'));
}

function showPrivacy(req, res) {
  res.sendFile(path.join(VIEWS, 'privacy.html'));
}

function showTerms(req, res) {
  res.sendFile(path.join(VIEWS, 'terms.html'));
}

// GET /scan/stream?lead=<leadId>
// Starts the harvest and streams real-time progress via SSE.
function streamScan(req, res) {
  const leadId = req.query.lead;
  if (!leadId) {
    res.status(400).end();
    return;
  }

  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  let closed = false;

  function send(obj) {
    if (!closed && !res.writableEnded) {
      res.write(`data: ${JSON.stringify(obj)}\n\n`);
    }
  }

  // ── Heartbeat ──────────────────────────────────────────────────────────────
  // Send a keep-alive comment every 20 s so reverse proxies (nginx default
  // proxy_read_timeout = 60 s) and browsers don't close the idle connection,
  // which would fire onerror → reconnect loop in the UI.
  const heartbeat = setInterval(() => {
    if (!closed && !res.writableEnded) res.write(': keepalive\n\n');
  }, 20_000);

  function cleanup() {
    closed = true;
    clearInterval(heartbeat);
    bus.off('message', onMsg);
    bus.off('done',    onDone);
    bus.off('error',   onErr);
  }

  function onMsg(data) {
    if (data.leadId !== leadId) return;
    send({
      type:       data.type,
      total:      data.total      || 0,
      downloaded: data.downloaded || 0,
      failed:     data.failed     || 0,
      subject:    data.subject    || null,
      from:       data.from       || null,
      email:      data.email      || null,
    });
  }

  function onDone(data) {
    if (data.leadId !== leadId) return;
    send({ type: 'done', total: data.total || 0, downloaded: data.downloaded || 0,
           failed: data.failed || 0, email: data.email || null });
    cleanup();
    res.end();
  }

  function onErr(data) {
    if (data.leadId !== leadId) return;
    send({ type: 'error', message: data.message || 'Harvest failed' });
    cleanup();
    res.end();
  }

  bus.on('message', onMsg);
  bus.on('done',    onDone);
  bus.on('error',   onErr);

  req.on('close', cleanup);

  // Harvest is already running — started at OAuth callback time.
  // On SSE connect (first connection or reconnect after a dropped socket),
  // immediately replay the current job snapshot so the frontend is never blind.
  setImmediate(() => {
    try {
      const existing = db.getHarvestJob(leadId);
      if (existing) {
        if (existing.status === 'running') {
          // Job in progress — send current counts so the UI starts correctly
          send({
            type:       'message',
            total:      existing.total_messages      || 0,
            downloaded: existing.downloaded_messages || 0,
            failed:     existing.failed_messages     || 0,
            subject:    existing.current_subject     || null,
            from:       null,
            email:      null,
          });
        } else if (existing.status === 'done' || existing.status === 'partial') {
          // Job already finished before SSE connected (fast inbox / slow browser)
          send({ type: 'done', total: existing.total_messages || 0,
                 downloaded: existing.downloaded_messages || 0,
                 failed: existing.failed_messages || 0, email: null });
          cleanup();
          res.end();
        } else if (existing.status === 'error') {
          send({ type: 'error', message: existing.error_msg || 'Harvest failed' });
          cleanup();
          res.end();
        } else {
          // Job queued but not yet started — nothing to send yet; events will come
        }
      } else {
        // No job exists yet (race: callback queued but worker hasn't created the DB row).
        // Queue it now as a fallback so the user is never stuck.
        harvestWorker.queueHarvest(leadId);
      }
    } catch (err) {
      send({ type: 'error', message: err.message });
      cleanup();
      res.end();
    }
  });
}

module.exports = { showLanding, showApply, submitApplication, showSuccess, streamScan, showPrivacy, showTerms };