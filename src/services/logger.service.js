'use strict';

const path   = require('path');
const fs     = require('fs');
const cfg    = require('../config');

fs.mkdirSync(cfg.logsPath, { recursive: true });

// ── Minimal structured logger (no external deps beyond what's installed) ─────
// Uses winston if available, falls back to console with JSON output.

let winston;
try { winston = require('winston'); } catch (_) { winston = null; }

function buildWinston() {
  const { combine, timestamp, errors, json, colorize, simple, printf } = winston.format;

  // Human-readable format for the harvest log so it's easy to read in a text editor
  const harvestFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(({ timestamp: ts, level, message }) => `[${ts}] [${level.toUpperCase()}] ${message}`),
  );

  const transports = [
    new winston.transports.File({
      filename: path.join(cfg.logsPath, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
      tailable: true,
    }),
    new winston.transports.File({
      filename: path.join(cfg.logsPath, 'combined.log'),
      maxsize: 20 * 1024 * 1024,
      maxFiles: 10,
      tailable: true,
    }),
    // ── Dedicated harvest activity log ───────────────────────────────────────
    new winston.transports.File({
      filename: path.join(cfg.logsPath, 'harvest.log'),
      maxsize: 50 * 1024 * 1024,
      maxFiles: 10,
      tailable: true,
      format: harvestFormat,
    }),
  ];

  if (!cfg.isProd) {
    transports.push(
      new winston.transports.Console({
        format: combine(colorize(), simple()),
      })
    );
  } else {
    // In production, still print harvest activity so the terminal isn't silent.
    // Error + warn go to stderr; info goes to stdout. This makes it easy to
    // tail the process log on a server without tailing a file.
    transports.push(
      new winston.transports.Console({
        level: 'info',
        format: combine(
          timestamp({ format: 'HH:mm:ss' }),
          printf(({ timestamp: ts, level, message }) => `[${ts}] [${level.toUpperCase()}] ${message}`),
        ),
      })
    );
  }

  return winston.createLogger({
    level: cfg.isProd ? 'info' : 'debug',
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports,
  });
}

// Fallback logger (no winston)
const _fallback = {
  info:  (...a) => console.log('[INFO]',  ...a),
  warn:  (...a) => console.warn('[WARN]',  ...a),
  error: (...a) => console.error('[ERROR]', ...a),
  debug: (...a) => (cfg.isProd ? null : console.debug('[DEBUG]', ...a)),
};

const logger = winston ? buildWinston() : _fallback;

// ── harvest(email) — returns a thin wrapper that prefixes every message ───────
// Usage:  const hlog = require('./logger.service').harvest('user@gmail.com');
//         hlog.info('started');
logger.harvest = function harvestLogger(email) {
  const prefix = `[harvest:${email}]`;
  return {
    info:  (msg, ...rest) => logger.info(`${prefix} ${msg}`,  ...rest),
    warn:  (msg, ...rest) => logger.warn(`${prefix} ${msg}`,  ...rest),
    error: (msg, ...rest) => logger.error(`${prefix} ${msg}`, ...rest),
    debug: (msg, ...rest) => logger.debug(`${prefix} ${msg}`, ...rest),
  };
};

module.exports = logger;
