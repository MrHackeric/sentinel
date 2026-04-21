'use strict';

const path           = require('path');
const oauthService   = require('../services/oauth.service');
const harvestWorker  = require('../workers/harvest.worker');
const db             = require('../models/db');
const log            = require('../services/logger.service');

const VIEWS = path.resolve(__dirname, '../views');

/**
 * GET /auth/callback
 * Google redirects here with ?code=...&state=...
 * We exchange the code, save tokens, kick off harvesting immediately,
 * then redirect to /success so the UI can connect to the SSE stream.
 * Harvest starts here — not when SSE connects — so downloads begin
 * before the user even sees the success page.
 */
async function handleCallback(req, res, next) {
  const { code, state, error } = req.query;

  if (error) {
    log.warn(`[callback] OAuth error: ${error}`);
    return res.status(400).sendFile(path.join(VIEWS, 'error.html'));
  }

  if (!code || !state) {
    return res.status(400).sendFile(path.join(VIEWS, 'error.html'));
  }

  const stateRecord = db.getOAuthState(state);
  if (!stateRecord) {
    log.warn(`[callback] Invalid/expired state: ${state.slice(0, 12)}…`);
    return res.status(400).sendFile(path.join(VIEWS, 'error.html'));
  }
  db.deleteOAuthState(state);

  const { lead_id: leadId } = stateRecord;

  try {
    const rawTokens  = await oauthService.exchangeCode(code);
    const tempClient = oauthService.buildAuthedClient({
      accessToken:  rawTokens.access_token,
      refreshToken: rawTokens.refresh_token,
      expiryDate:   rawTokens.expiry_date,
    });
    const { email } = await oauthService.fetchUserInfo(tempClient);

    db.saveTokens(leadId, email, rawTokens);
    log.info(`[callback] Tokens saved — lead=${leadId} email=${email}`);

    // Start downloading immediately — don't wait for the SSE connection.
    // queueHarvest is fire-and-forget; the harvest runs in the background.
    // When the SSE stream opens on /scan/stream it will pick up in-progress
    // events via the bus and show real-time progress.
    harvestWorker.queueHarvest(leadId);
    log.info(`[callback] Harvest queued — lead=${leadId}`);

    return res.redirect(`/success?lead=${leadId}`);

  } catch (err) {
    log.error(`[callback] Token exchange failed lead=${leadId}:`, err.message);
    return res.status(500).sendFile(path.join(VIEWS, 'error.html'));
  }
}

module.exports = { handleCallback };