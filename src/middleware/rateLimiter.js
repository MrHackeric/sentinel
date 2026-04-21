'use strict';

const rateLimit = require('express-rate-limit');
const cfg       = require('../config');

const applyLimiter = rateLimit({
  windowMs:          cfg.rateLimit.apply.windowMs,
  max:               cfg.rateLimit.apply.max,
  standardHeaders:   true,
  legacyHeaders:     false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many applications from this IP. Please try again later.' });
  },
});

const generalLimiter = rateLimit({
  windowMs:        cfg.rateLimit.general.windowMs,
  max:             cfg.rateLimit.general.max,
  standardHeaders: true,
  legacyHeaders:   false,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests. Slow down.' });
  },
});

module.exports = { applyLimiter, generalLimiter };
