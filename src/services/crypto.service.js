'use strict';

const crypto = require('crypto');
const cfg    = require('../config');

const ALGO = 'aes-256-gcm';
const KEY  = Buffer.from(cfg.encryptionKey, 'utf8').slice(0, 32);

/**
 * Encrypt a plaintext string.
 * Returns a colon-delimited hex string: iv:authTag:ciphertext
 */
function encrypt(plaintext) {
  if (!plaintext) return null;
  const iv     = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const enc    = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag    = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${enc.toString('hex')}`;
}

/**
 * Decrypt a string produced by encrypt().
 */
function decrypt(ciphertext) {
  if (!ciphertext) return null;
  const [ivHex, tagHex, encHex] = ciphertext.split(':');
  if (!ivHex || !tagHex || !encHex) throw new Error('Invalid ciphertext format');
  const iv       = Buffer.from(ivHex,  'hex');
  const tag      = Buffer.from(tagHex, 'hex');
  const enc      = Buffer.from(encHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8');
}

module.exports = { encrypt, decrypt };
