import { existsSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { classDecks } from './classes';

describe('class decks', () => {
  it('every deck has its PDF and one image per slide', () => {
    for (const deck of classDecks) {
      expect(existsSync(`public${deck.pdf}`), deck.pdf).toBe(true);
      const images = readdirSync(`public/clases/${deck.slug}`).filter((f) => f.endsWith('.webp'));
      expect(images.length, deck.slug).toBe(deck.slides.length);
      for (const slide of deck.slides) expect(slide.title, deck.slug).not.toBe('');
    }
  });

  it('leaves out the teacher-only solution slides', () => {
    for (const deck of classDecks) {
      for (const slide of deck.slides) {
        expect(`${slide.kicker} ${slide.title}`).not.toMatch(/soluci[oó]n(es)? \(profe\)/i);
      }
    }
  });
});
