import { describe, expect, it } from 'vitest';
import { cases } from '@/content/cases';
import { answers } from './answers';
import { getScene } from './circuits';

const idsIn = (sceneId: string) => {
  const scene = getScene(sceneId);
  if (!scene) throw new Error(`missing scene ${sceneId}`);
  return new Set(
    scene.parts.flatMap((p) => [p.id, p.kind === 'led' ? p.cathodeId : undefined]).filter(Boolean),
  );
};

describe('circuit scenes', () => {
  for (const c of cases) {
    if (c.kind !== 'circuit') continue;

    it(`${c.id}: every clickable target is drawn in the scene`, () => {
      const ids = idsIn(c.circuit);
      for (const t of c.targets) expect(ids).toContain(t.id);
    });

    it(`${c.id}: has a corrected scene`, () => {
      expect(answers[c.id].fixedCircuit).toBeDefined();
      expect(getScene(answers[c.id].fixedCircuit!)).toBeDefined();
    });
  }

  it('A1 has the LED reversed and the fixed version has it lit', () => {
    const led = (id: string) => getScene(id)!.parts.find((p) => p.kind === 'led');
    const broken = led('A1');
    const fixed = led('A1-fixed');
    expect(broken?.kind === 'led' && broken.anode.x > broken.cathode.x).toBe(true);
    expect(fixed?.kind === 'led' && fixed.anode.x < fixed.cathode.x && fixed.lit).toBeTruthy();
  });

  it('A2 has no resistor and A3 has no GND jumper', () => {
    expect(idsIn('A2').has('resistor')).toBe(false);
    expect(idsIn('A3').has('jumperGnd')).toBe(false);
  });

  it('A4 highlights pin 9', () => {
    expect(getScene('A4')!.usedPins).toContain('9');
  });
});
