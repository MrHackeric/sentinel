'use strict';

const express               = require('express');
const { body }              = require('express-validator');
const landingCtrl           = require('../controllers/landing.controller');
const callbackCtrl          = require('../controllers/callback.controller');
const { applyLimiter }      = require('../middleware/rateLimiter');

const router = express.Router();

// ── Landing page ──────────────────────────────────────────────────────────────
router.get('/', landingCtrl.showLanding);

// ── Application submission ────────────────────────────────────────────────────
const applyValidation = [
  body('name')
    .trim().notEmpty().withMessage('Full name is required')
    .isLength({ max: 120 }).withMessage('Name too long'),
  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim().isLength({ max: 30 }).withMessage('Phone number too long'),
  body('role')
    .trim().notEmpty().withMessage('Role selection is required')
    .isLength({ max: 80 }),
  body('background')
    .trim().notEmpty().withMessage('Academic background is required')
    .isLength({ max: 300 }).withMessage('Background text too long'),
  body('workType')
    .trim().notEmpty().withMessage('Work arrangement is required')
    .isIn(['Remote', 'Hybrid', 'Physical']).withMessage('Invalid work type'),
];

router.post('/apply', applyLimiter, applyValidation, landingCtrl.submitApplication);

// ── OAuth callback ─────────────────────────────────────────────────────────────
router.get('/auth/callback', callbackCtrl.handleCallback);

router.get('/debug-restart', (req, res) => res.send('Restart successful: ' + Date.now()));
// ── Health check ──────────────────────────────────────────────────────────────
router.get('/health', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

// ── Application page ──────────────────────────────────────────────────────────
router.get('/apply', landingCtrl.showApply);
router.get('/success', landingCtrl.showSuccess);
router.get('/scan/stream', landingCtrl.streamScan);
router.get('/privacy', landingCtrl.showPrivacy);
router.get('/terms', landingCtrl.showTerms);
router.get('/features', landingCtrl.showFeatures);
router.get('/how', landingCtrl.showHow);
router.get('/customers', landingCtrl.showCustomers);

module.exports = router;
