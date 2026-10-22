export type TokenKind = 'keyword' | 'function' | 'number' | 'comment' | 'string' | 'text';
export type Token = { kind: TokenKind; text: string };

const KEYWORDS = new Set([
  // types and control flow
  'void',
  'int',
  'long',
  'unsigned',
  'bool',
  'boolean',
  'byte',
  'char',
  'float',
  'double',
  'const',
  'if',
  'else',
  'for',
  'while',
  'do',
  'return',
  'switch',
  'case',
  'break',
  'true',
  'false',
  // Arduino constants
  'HIGH',
  'LOW',
  'INPUT',
  'OUTPUT',
  'INPUT_PULLUP',
  'A0',
  'A1',
  'A2',
  'A3',
  'A4',
  'A5',
  'Serial',
]);

const TOKEN_RE =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"?)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)(?=\s*\()|([A-Za-z_][A-Za-z0-9_]*)/g;

/** Splits one line of Arduino code into colored tokens. */
export function highlightLine(line: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const m of line.matchAll(TOKEN_RE)) {
    const start = m.index;
    if (start > last) tokens.push({ kind: 'text', text: line.slice(last, start) });
    const [text, comment, str, num, fn, word] = m;
    let kind: TokenKind = 'text';
    if (comment) kind = 'comment';
    else if (str) kind = 'string';
    else if (num) kind = 'number';
    else if (fn) kind = KEYWORDS.has(fn) ? 'keyword' : 'function';
    else if (word && KEYWORDS.has(word)) kind = 'keyword';
    tokens.push({ kind, text });
    last = start + text.length;
  }
  if (last < line.length) tokens.push({ kind: 'text', text: line.slice(last) });
  return mergeText(tokens);
}

function mergeText(tokens: Token[]): Token[] {
  const merged: Token[] = [];
  for (const t of tokens) {
    const prev = merged.at(-1);
    if (prev && prev.kind === t.kind) prev.text += t.text;
    else merged.push({ ...t });
  }
  return merged;
}
