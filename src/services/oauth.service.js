'use strict';

const { google } = require('googleapis');
const crypto     = require('crypto');
const cfg        = require('../config');

/**
 * Create a bare OAuth2 client (no credentials).
 */
function createClient() {
  return new google.auth.OAuth2(
    cfg.google.clientId,
    cfg.google.clientSecret,
    cfg.google.redirectUri,
  );
}

/**
 * Build the Google consent URL with a CSRF state token.
 * @param {string} state  — opaque token stored in DB to verify on callback
 */
function buildAuthUrl(state) {
  return createClient().generateAuthUrl({
    access_type: 'offline',
    prompt:      'consent',
    scope:       cfg.google.scopes,
    state,
  });
}

/**
 * Exchange an authorisation code for tokens.
 * Returns the raw tokens object from Google.
 */
async function exchangeCode(code) {
  const client = createClient();
  const { tokens } = await client.getToken(code);
  return tokens;
}

/**
 * Build an authenticated OAuth2 client from stored tokens.
 * @param {{ accessToken, refreshToken, expiryDate }} tokenRecord
 * @param {Function} onRefresh  — called with new tokens when they are refreshed
 */
function buildAuthedClient(tokenRecord, onRefresh) {
  const client = createClient();
  client.setCredentials({
    access_token:  tokenRecord.accessToken,
    refresh_token: tokenRecord.refreshToken,
    expiry_date:   tokenRecord.expiryDate,
  });
  if (typeof onRefresh === 'function') {
    client.on('tokens', newTokens => {
      onRefresh(newTokens);
    });
  }
  return client;
}

/**
 * Fetch the authenticated user's email address and display name.
 */
async function fetchUserInfo(authedClient) {
  const oauth2  = google.oauth2({ version: 'v2', auth: authedClient });
  const { data } = await oauth2.userinfo.get();
  return { email: data.email || '', name: data.name || '' };
}

/**
 * Generate a cryptographically random state token for CSRF protection.
 */
function generateStateToken() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = { createClient, buildAuthUrl, exchangeCode, buildAuthedClient, fetchUserInfo, generateStateToken };
