/**
 * Normalizes a line of Arduino code for comparison:
 * strips `//` comments and all whitespace. Case is preserved on purpose
 * (`digitalwrite` ≠ `digitalWrite` is exactly what students are learning).
 */
export function normalizeLine(s: string): string {
  return s.replace(/\/\/.*$/, '').replace(/\s+/g, '');
}
