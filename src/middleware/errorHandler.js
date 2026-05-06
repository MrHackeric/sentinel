'use strict';

const path = require('path');
const log  = require('../services/logger.service');
const cfg  = require('../config');

const VIEWS = path.resolve(__dirname, '../views');

// 404 catcher — place after all routes
function notFound(req, res) {
  log.warn(`[404] ${req.method} ${req.url} - Not Found`);
  res.status(404).sendFile(path.join(VIEWS, 'error.html'));
}

// Global error handler — place last in Express chain
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  log.error(`[error] ${req.method} ${req.path} → ${status}: ${err.message}`, {
    stack: cfg.isProd ? undefined : err.stack,
  });

  if (req.accepts('json') && req.path.startsWith('/apply')) {
    return res.status(status).json({
      error: cfg.isProd ? 'Internal server error' : err.message,
    });
  }

  res.status(status).sendFile(path.join(VIEWS, 'error.html'));
}

module.exports = { notFound, errorHandler };
