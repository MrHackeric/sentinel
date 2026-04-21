'use strict';

/**
 * harvest.bus.js — in-process event bus for real-time harvest progress.
 *
 * The worker emits events here; SSE handlers subscribe here.
 * No DB polling needed for the live feed.
 *
 * Events emitted on the bus:
 *   'progress'  { jobId, email, total, downloaded, failed, subject }
 *   'done'      { jobId, email, total, downloaded, failed }
 *   'error'     { jobId, email, message }
 */

const { EventEmitter } = require('events');

const bus = new EventEmitter();
bus.setMaxListeners(100); // many SSE clients can connect simultaneously

module.exports = bus;