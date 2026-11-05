import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { FLOWCHART_EXAMPLES, projects, PROJECTS_PDF } from './projects';

describe('projects', () => {
  it('has the 9 projects in order, with unique slugs and pins', () => {
    expect(projects.map((p) => p.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    for (const p of projects) {
      const pins = p.connections.map((c) => c.pin);
      expect(new Set(pins).size, p.slug).toBe(pins.length);
    }
  });

  it('the PDF and the flowchart images exist in public/', () => {
    for (const file of [PROJECTS_PDF, ...FLOWCHART_EXAMPLES.map((e) => e.image)]) {
      expect(existsSync(`public${file}`), file).toBe(true);
    }
  });
});
