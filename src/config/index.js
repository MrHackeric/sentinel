'use strict';
require('dotenv').config();

const REQUIRED = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'ENCRYPTION_KEY'];
const missing  = REQUIRED.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`[config] Missing required env vars:\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
if (Buffer.from(process.env.ENCRYPTION_KEY).length < 32) {
  console.error('[config] ENCRYPTION_KEY must be at least 32 bytes');
  process.exit(1);
}

const PORT     = parseInt(process.env.PORT) || 3000;
const BASE_URL = (process.env.BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');

module.exports = Object.freeze({
  port:          PORT,
  nodeEnv:       process.env.NODE_ENV || 'development',
  isProd:        process.env.NODE_ENV === 'production',

  baseUrl:       BASE_URL,
  dbPath:        process.env.DB_PATH        || './data/collector.sqlite',
  downloadsPath: process.env.DOWNLOADS_PATH || './downloads',
  logsPath:      process.env.LOGS_PATH      || './logs',

  encryptionKey: process.env.ENCRYPTION_KEY.slice(0, 32).padEnd(32, '0'),

  google: {
    clientId:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri:  process.env.GOOGLE_REDIRECT_URI || `${BASE_URL}/auth/callback`,
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  },

  harvest: {
    concurrency: parseInt(process.env.HARVEST_CONCURRENCY) || 5,
    batchSize:   parseInt(process.env.HARVEST_BATCH_SIZE)  || 500,
    delayMs:     parseInt(process.env.HARVEST_DELAY_MS)    || 50,
    maxRetries:  3,
  },

  rateLimit: {
    apply:   { windowMs: 15 * 60 * 1000, max: 100 },
    general: { windowMs:      60 * 1000, max: 120 },
  },

  oauthStateExpirySeconds: 10 * 60,
});