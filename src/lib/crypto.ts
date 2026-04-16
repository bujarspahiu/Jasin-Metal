/**
 * Client-side password hashing using SHA-256 (Web Crypto API).
 * This is client-side hardening: it prevents plain-text passwords from sitting
 * in localStorage, but it is not a substitute for server-side credential
 * verification with a salted algorithm like bcrypt or Argon2.
 */

const HASH_PREFIX = 'sha256:';

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return HASH_PREFIX + hex;
}

export function isHashed(value: string): boolean {
  return value.startsWith(HASH_PREFIX);
}
