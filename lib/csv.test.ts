import { describe, expect, it } from 'vitest';
import { initialProgress } from './case-progress';
import { progressCsv } from './csv';

describe('progressCsv', () => {
  const csv = progressCsv([
    {
      displayName: 'Sara M.',
      partnerName: 'Juan "Pipe" R.',
      items: {
        A1: {
          ...initialProgress,
          status: 'solved',
          hintsUsed: 1,
          wrongAttempts: 2,
          points: 6,
          startedAt: '2026-10-21T13:00:00Z',
          solvedAt: '2026-10-21T13:04:05Z',
        },
      },
    },
  ]);
  const lines = csv.replace('﻿', '').trim().split('\r\n');

  it('starts with a BOM and the header', () => {
    expect(csv.startsWith('﻿')).toBe(true);
    expect(lines[0]).toBe('estudiante;pareja;caso;estado;pistas;intentos;puntos;tiempo');
  });

  it('writes one row per case and escapes quotes', () => {
    expect(lines).toHaveLength(1 + 15);
    expect(lines[1]).toBe('Sara M.;"Juan ""Pipe"" R.";A1;resuelto;1;2;6;4 min 05 s');
    expect(lines[2]).toBe('Sara M.;"Juan ""Pipe"" R.";A2;sin empezar;0;0;0;');
  });
});
