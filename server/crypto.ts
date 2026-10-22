import 'server-only';

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  timingSafeEqual,
} from 'node:crypto';

function pepper(): string {
  const value = process.env.TOKEN_PEPPER;
  if (!value || value.length < 32) {
    throw new Error('TOKEN_PEPPER debe tener al menos 32 caracteres.');
  }
  return value;
}

/** Random session token (sent to the browser, never stored as is). */
export function randomToken(): string {
  return randomBytes(32).toString('base64url');
}

/** What we store in the database for a token: HMAC-SHA256 keyed with the pepper. */
export function hashToken(token: string): string {
  return createHmac('sha256', pepper()).update(token).digest('hex');
}

export function generatePin(): string {
  return String(randomInt(0, 10_000)).padStart(4, '0');
}

function pinKey(): Buffer {
  return createHash('sha256').update(`pin-encryption:${pepper()}`).digest();
}

/** AES-256-GCM, stored as `iv.tag.ciphertext` (base64url). */
export function encryptPin(pin: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', pinKey(), iv);
  const encrypted = Buffer.concat([cipher.update(pin, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((b) => b.toString('base64url')).join('.');
}

export function decryptPin(stored: string): string {
  const [iv, tag, data] = stored.split('.').map((part) => Buffer.from(part, 'base64url'));
  const decipher = createDecipheriv('aes-256-gcm', pinKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}

export function pinMatches(stored: string, candidate: string): boolean {
  const a = Buffer.from(decryptPin(stored));
  const b = Buffer.from(candidate);
  return a.length === b.length && timingSafeEqual(a, b);
}
