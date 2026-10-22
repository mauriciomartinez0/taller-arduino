/** "ard 7b" → "ARD7B"; codes are stored upper case without spaces. */
export function normalizeJoinCode(code: string): string {
  return code.toUpperCase().replace(/\s+/g, '');
}

/** "  sara   m. " → "Sara M." (trimmed, single spaces, first letter of each word upper case). */
export function normalizeDisplayName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toLocaleUpperCase('es-CO') + w.slice(1))
    .join(' ');
}

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Random code like "ARD-K7Q2" (no 0/O or 1/I to avoid confusion). */
export function randomJoinCode(random: () => number = Math.random): string {
  let suffix = '';
  for (let i = 0; i < 4; i++) suffix += CODE_ALPHABET[Math.floor(random() * CODE_ALPHABET.length)];
  return `ARD-${suffix}`;
}
