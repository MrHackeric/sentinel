'use strict';

const express         = require('express');
const helmet          = require('helmet');
const morgan          = require('morgan');
const path            = require('path');
const fs              = require('fs');

const cfg             = require('./config');
const log             = require('./services/logger.service');
const routes          = require('./routes');
const { generalLimiter }              = require('./middleware/rateLimiter');
const { notFound, errorHandler }      = require('./middleware/errorHandler');

// ── Ensure required directories exist ────────────────────────────────────────
[cfg.downloadsPath, cfg.logsPath, path.dirname(cfg.dbPath)].forEach(d =>
  fs.mkdirSync(path.resolve(d), { recursive: true })
);

// ── App ── (Restart triggered)
const app = express();

// Trust proxy (needed for accurate req.ip when behind Nginx / reverse proxy)
app.set('trust proxy', 1);

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc:  ["'self'"],
      // Scripts are now external files in views/public — no unsafe-inline needed
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'",
                    'https://fonts.googleapis.com',
                    'https://fonts.gstatic.com'],
      // Google Fonts CSS is served from googleapis.com; actual font files from gstatic.com
      fontSrc:     ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      imgSrc:      ["'self'", 'data:', 'https://images.unsplash.com'],
      // connectSrc covers EventSource(/scan/stream) — same-origin so 'self' is sufficient
      connectSrc:    ["'self'"],
      frameSrc:      ["'none'"],
      objectSrc:     ["'none'"],
      // Helmet 7 emits script-src-attr 'none' by default which blocks attribute-level
      // handlers. Set to null to suppress the directive entirely — all scripts are external.
      scriptSrcAttr: null,
      upgradeInsecureRequests: cfg.isProd ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// ── Request logging ───────────────────────────────────────────────────────────
const accessLogStream = fs.createWriteStream(
  path.resolve(cfg.logsPath, 'access.log'),
  { flags: 'a' }
);
app.use(morgan(cfg.isProd ? 'combined' : 'dev', {
  stream: cfg.isProd ? accessLogStream : process.stdout,
}));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb' }));

//Serve static files (e.g. for landing page)
app.use(express.static(path.join(__dirname, 'views/public')));

// ── Global rate limit ─────────────────────────────────────────────────────────
app.use(generalLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/', routes);

// ── 404 + error handler (must be last) ───────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const server = app.listen(cfg.port, '0.0.0.0', () => {
  log.info(`[app] Sentinel running`);
  log.info(`[app] Env: ${cfg.nodeEnv}  |  Port: ${cfg.port}  |  Base: ${cfg.baseUrl}`);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────────
function shutdown(signal) {
  log.info(`[app] ${signal} received — shutting down gracefully`);
  server.close(() => {
    log.info('[app] HTTP server closed');
    // Allow in-flight harvest workers to drain (give 30s)
    setTimeout(() => {
      log.info('[app] Exit');
      process.exit(0);
    }, 30_000).unref();
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('uncaughtException', err => {
  log.error('[app] Uncaught exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  log.error('[app] Unhandled rejection:', reason);
});

module.exports = app;
