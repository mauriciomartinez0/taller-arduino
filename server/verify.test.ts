import { describe, expect, it } from 'vitest';
import { CASE_IDS, cases, getCase, type CaseId } from '@/content/cases';
import { answers } from './answers';
import { checkFix, checkLocate, MESSAGES } from './verify';

const located = (id: CaseId, target: string) => checkLocate(id, target).correct;
const fixed = (id: CaseId, answer: string) => checkFix(id, answer).correct;
const fixFeedback = (id: CaseId, answer: string) => checkFix(id, answer).feedback;

describe('public content and private answers stay consistent', () => {
  it('has answers for exactly the 15 cases', () => {
    expect(Object.keys(answers).sort()).toEqual([...CASE_IDS].sort());
    expect(cases.map((c) => c.id)).toEqual([...CASE_IDS]);
  });

  for (const c of cases) {
    const answer = answers[c.id];
    const lineCount = c.code?.split('\n').length ?? 0;
    const validTargets = new Set<string>([
      ...(c.kind === 'circuit' ? c.targets.map((t) => t.id) : []),
      ...(c.kind === 'code' || c.codeClickable
        ? Array.from({ length: lineCount }, (_, i) => `line:${i + 1}`)
        : []),
    ]);

    it(`${c.id}: every correct and feedback target exists in the public case`, () => {
      for (const target of answer.locate.correct) expect(validTargets).toContain(target);
      for (const target of Object.keys(answer.locate.feedback ?? {})) {
        expect(validTargets).toContain(target);
      }
    });

    it(`${c.id}: fix types match and choices have 4 options with the correct one present`, () => {
      expect(answer.fix.type).toBe(c.fix.type);
      if (c.fix.type === 'choice' && answer.fix.type === 'choice') {
        expect(c.fix.options).toHaveLength(4);
        expect(c.fix.options.map((o) => o.id)).toContain(answer.fix.correct);
      }
      if (c.fix.type === 'editLine') {
        expect(c.fix.line).toBeGreaterThanOrEqual(1);
        expect(c.fix.line).toBeLessThanOrEqual(lineCount);
      }
    });

    it(`${c.id}: has an explanation and a fixed version`, () => {
      expect(answer.explanation.length).toBeGreaterThan(20);
      expect(answer.fixedCode ?? answer.fixedCircuit).toBeTruthy();
    });
  }

  it('the public content does not contain the correct choice flags', () => {
    expect(JSON.stringify(cases)).not.toMatch(/"correct"/);
  });
});

describe('checkLocate messages', () => {
  it('confirms the right target', () => {
    expect(checkLocate('A1', 'led')).toEqual({ correct: true, feedback: MESSAGES.located });
  });

  it('uses the specific message for a known wrong target', () => {
    expect(checkLocate('A1', 'resistor').feedback).toBe(
      'La resistencia está bien: 220 Ω y en su lugar.',
    );
  });

  it('falls back to a generic message for lines and circuit parts', () => {
    expect(checkLocate('B2', 'line:1').feedback).toBe(MESSAGES.wrongLine);
    expect(checkLocate('A1', 'unknown').feedback).toBe(MESSAGES.wrongPart);
  });

  it('uses the case fallback when there is one', () => {
    expect(checkLocate('C3', 'line:10').feedback).toBe(
      'Esa línea está bien. El problema está en las preguntas del if.',
    );
  });
});

describe('typical mistakes in editLine', () => {
  it('detects a missing semicolon', () => {
    expect(fixFeedback('B1', 'pinMode(8, OUTPUT)')).toBe(MESSAGES.missingSemicolon);
  });

  it('detects wrong upper/lower case', () => {
    expect(fixFeedback('B2', 'digitalwrite(8, HIGH);')).toBe(MESSAGES.caseMismatch);
    expect(fixFeedback('B2', 'digitalwrite(8, HIGH)')).toBe(MESSAGES.caseMismatch);
  });

  it('detects a single = inside an if', () => {
    expect(fixFeedback('C2', 'if (estado = LOW) {')).toBe(MESSAGES.assignInIf);
  });

  it('asks for an answer when the line is empty or only a comment', () => {
    expect(fixFeedback('C4', '   ')).toBe(MESSAGES.emptyLine);
    expect(fixFeedback('C4', '// configuración')).toBe(MESSAGES.emptyLine);
  });

  it('uses the generic message otherwise', () => {
    expect(fixFeedback('B1', 'pinMode(9, OUTPUT);')).toBe(MESSAGES.generic);
  });
});

describe('A1 · El LED no enciende', () => {
  it('locates the LED', () => {
    expect(located('A1', 'led')).toBe(true);
    for (const t of ['resistor', 'wireSignal', 'wireGnd', 'jumperGnd']) {
      expect(located('A1', t)).toBe(false);
    }
  });
  it('fixes by turning the LED around', () => {
    expect(fixed('A1', 'girar-led')).toBe(true);
    for (const o of ['resistencia-10k', 'cable-pin-13', 'segundo-gnd'])
      expect(fixed('A1', o)).toBe(false);
  });
});

describe('A2 · Sin resistencia', () => {
  it('locates the signal wire', () => {
    expect(located('A2', 'wireSignal')).toBe(true);
    expect(checkLocate('A2', 'led').feedback).toBe(
      'El LED está bien puesto. El problema está antes de llegar a él.',
    );
  });
  it('fixes with a 220 Ω resistor', () => {
    expect(fixed('A2', 'resistencia-220')).toBe(true);
    for (const o of ['girar-led', 'pin-5v', 'otro-color']) expect(fixed('A2', o)).toBe(false);
  });
});

describe('A3 · Falta el regreso a GND', () => {
  it('locates the short leg or column 16', () => {
    expect(located('A3', 'ledCathode')).toBe(true);
    expect(located('A3', 'column16')).toBe(true);
    expect(located('A3', 'wireGnd')).toBe(false);
    expect(checkLocate('A3', 'wireGnd').feedback).toBe(
      'Este cable sí lleva GND al riel −. ¿Llega GND hasta el LED?',
    );
  });
  it('fixes with a wire from column 16 to the − rail', () => {
    expect(fixed('A3', 'cable-col-16')).toBe(true);
    for (const o of ['gnd-a-mas', 'girar-led', 'quitar-resistencia'])
      expect(fixed('A3', o)).toBe(false);
  });
});

describe('A4 · Pin distinto al del código', () => {
  it('locates the wire, pin 9 or code line 1', () => {
    for (const t of ['wireSignal', 'arduinoPin9', 'line:1']) expect(located('A4', t)).toBe(true);
    for (const t of ['led', 'resistor', 'jumperGnd', 'line:8'])
      expect(located('A4', t)).toBe(false);
  });
  it('fixes by moving the wire to pin 8', () => {
    expect(fixed('A4', 'pin-8')).toBe(true);
    for (const o of ['resistencia-1k', 'girar-led', 'led-5v']) expect(fixed('A4', o)).toBe(false);
  });
});

describe('A5 · Botón siempre presionado', () => {
  it('locates the black wire in column 4', () => {
    expect(located('A5', 'jumperButtonGnd')).toBe(true);
    for (const t of ['wireButtonSignal', 'button', 'led']) expect(located('A5', t)).toBe(false);
  });
  it('fixes by moving the black wire to column 6', () => {
    expect(fixed('A5', 'negro-col-6')).toBe(true);
    for (const o of ['quitar-pullup', 'negro-5v', 'girar-led']) expect(fixed('A5', o)).toBe(false);
  });
});

describe('A6 · Potenciómetro mal conectado', () => {
  it('locates the middle-leg wire or the A0 wire', () => {
    expect(located('A6', 'jumperPotMiddle')).toBe(true);
    expect(located('A6', 'wireA0')).toBe(true);
    expect(located('A6', 'jumperPotRight')).toBe(false);
  });
  it('fixes with the middle leg to A0', () => {
    expect(fixed('A6', 'medio-a0')).toBe(true);
    for (const o of ['pin-digital-8', 'resistencia-amarillo', 'perilla-mitad']) {
      expect(fixed('A6', o)).toBe(false);
    }
  });
});

describe('B1 · Falta el punto y coma', () => {
  it('locates line 2, not line 3', () => {
    expect(located('B1', 'line:2')).toBe(true);
    expect(checkLocate('B1', 'line:3').feedback).toBe(
      'El IDE marca esta línea, pero el error está justo antes.',
    );
  });
  it('accepts the corrected line with any spacing or comment', () => {
    expect(fixed('B1', '  pinMode(8, OUTPUT);')).toBe(true);
    expect(fixed('B1', 'pinMode(8,OUTPUT); // listo')).toBe(true);
    expect(fixed('B1', 'pinMode(8, OUTPUT)')).toBe(false);
    expect(fixed('B1', 'pinmode(8, OUTPUT);')).toBe(false);
  });
});

describe('B2 · digitalwrite', () => {
  it('locates line 6', () => {
    expect(located('B2', 'line:6')).toBe(true);
    expect(located('B2', 'line:8')).toBe(false);
  });
  it('accepts digitalWrite with the right case', () => {
    expect(fixed('B2', '  digitalWrite(8, HIGH);')).toBe(true);
    expect(fixed('B2', 'digitalwrite(8, HIGH);')).toBe(false);
    expect(fixed('B2', 'digitalWrite(8, high);')).toBe(false);
    expect(fixed('B2', 'digitalWrite(8, LOW);')).toBe(false);
  });
});

describe('B3 · Variable dentro de setup', () => {
  it('locates line 3', () => {
    expect(located('B3', 'line:3')).toBe(true);
    expect(checkLocate('B3', 'line:8').feedback).toBe(
      'Ahí se usa la variable, pero el problema es dónde se creó.',
    );
    expect(located('B3', 'line:10')).toBe(false);
  });
  it('fixes by moving the declaration to the top', () => {
    expect(fixed('B3', 'mover-arriba')).toBe(true);
    for (const o of ['borrar-int', 'comillas', 'cambiar-1000']) expect(fixed('B3', o)).toBe(false);
  });
});

describe('C1 · Falta el segundo delay', () => {
  it('locates line 10 and asks a different question', () => {
    expect(located('C1', 'line:10')).toBe(true);
    expect(located('C1', 'line:11')).toBe(false);
    expect(getCase('C1')?.kind === 'code' && getCase('C1')).toMatchObject({
      locatePrompt: '¿Después de qué línea falta algo?',
      fix: { type: 'editLine', line: 10, mode: 'insertAfter' },
    });
  });
  it('accepts delay(1000) without a note', () => {
    expect(checkFix('C1', '  delay(1000);')).toEqual({ correct: true, feedback: MESSAGES.fixed });
  });
  it('accepts another number with a note', () => {
    const result = checkFix('C1', 'delay(500);');
    expect(result.correct).toBe(true);
    expect(result.note).toBe(
      '¡Funciona! Para que quede igual de tiempo encendido y apagado, usa 1000.',
    );
  });
  it('rejects typical mistakes', () => {
    expect(fixFeedback('C1', 'delay(1000)')).toBe(MESSAGES.missingSemicolon);
    expect(fixFeedback('C1', 'Delay(1000);')).toBe(MESSAGES.caseMismatch);
    expect(fixed('C1', 'delay();')).toBe(false);
    expect(fixed('C1', 'digitalWrite(LED, LOW);')).toBe(false);
  });
});

describe('C2 · = en vez de ==', () => {
  it('locates line 11', () => {
    expect(located('C2', 'line:11')).toBe(true);
    expect(located('C2', 'line:10')).toBe(false);
  });
  it('accepts == LOW', () => {
    expect(fixed('C2', '  if (estado == LOW) {')).toBe(true);
    expect(fixed('C2', 'if (estado == LOW) { // presionado')).toBe(true);
  });
  it('rejects typical mistakes', () => {
    expect(fixFeedback('C2', 'if (estado = LOW) {')).toBe(MESSAGES.assignInIf);
    expect(fixFeedback('C2', 'if (estado == low) {')).toBe(MESSAGES.caseMismatch);
    expect(fixed('C2', 'if (estado == HIGH) {')).toBe(false);
  });
});

describe('C3 · Orden de las condiciones', () => {
  it('locates line 15 or 17', () => {
    expect(located('C3', 'line:15')).toBe(true);
    expect(located('C3', 'line:17')).toBe(true);
    expect(located('C3', 'line:18')).toBe(false);
  });
  it('fixes by inverting the order', () => {
    expect(fixed('C3', 'invertir-orden')).toBe(true);
    for (const o of ['cambiar-1023', 'borrar-else', 'delay-1000'])
      expect(fixed('C3', o)).toBe(false);
  });
});

describe('C4 · Falta Serial.begin', () => {
  it('locates line 2 or line 1', () => {
    expect(located('C4', 'line:2')).toBe(true);
    expect(located('C4', 'line:1')).toBe(true);
    expect(checkLocate('C4', 'line:7').feedback).toBe(
      'Estas líneas están bien escritas. ¿Qué falta antes de poder usarlas?',
    );
  });
  it('accepts Serial.begin(9600) without a note', () => {
    expect(checkFix('C4', '  Serial.begin(9600);')).toEqual({
      correct: true,
      feedback: MESSAGES.fixed,
    });
  });
  it('accepts another speed with a note', () => {
    const result = checkFix('C4', 'Serial.begin(115200);');
    expect(result.correct).toBe(true);
    expect(result.note).toBe(
      'Funciona, pero recuerda poner la misma velocidad en el monitor. En clase usamos 9600.',
    );
  });
  it('rejects typical mistakes', () => {
    expect(fixFeedback('C4', 'Serial.begin(9600)')).toBe(MESSAGES.missingSemicolon);
    expect(fixFeedback('C4', 'serial.begin(9600);')).toBe(MESSAGES.caseMismatch);
    expect(fixed('C4', 'Serial.begin();')).toBe(false);
  });
});

describe('C5 · Pin sin PWM', () => {
  it('locates line 1', () => {
    expect(located('C5', 'line:1')).toBe(true);
    expect(checkLocate('C5', 'line:9').feedback).toBe(
      'analogWrite está bien usado. Revisa en QUÉ pin.',
    );
  });
  it('accepts every PWM pin', () => {
    for (const pin of [3, 5, 6, 9, 10, 11])
      expect(fixed('C5', `const int LED = ${pin};`)).toBe(true);
  });
  it('rejects pins without ~ and typical mistakes', () => {
    for (const pin of [8, 2, 13, 1]) expect(fixed('C5', `const int LED = ${pin};`)).toBe(false);
    expect(fixed('C5', 'const int LED = 99;')).toBe(false);
    expect(fixFeedback('C5', 'const int LED = 9')).toBe(MESSAGES.missingSemicolon);
    expect(fixFeedback('C5', 'const int led = 9;')).toBe(MESSAGES.caseMismatch);
  });
  it('reminds to move the wire once solved', () => {
    expect(answers.C5.solvedNote).toBe('¡Y no olvides mover también el cable al nuevo pin!');
  });
});

describe('C6 · Lógica del botón al revés', () => {
  it('locates line 11', () => {
    expect(located('C6', 'line:11')).toBe(true);
  });
  it('accepts the three equivalent conditions', () => {
    expect(fixed('C6', 'if (estado == LOW) {')).toBe(true);
    expect(fixed('C6', 'if (estado != HIGH) {')).toBe(true);
    expect(fixed('C6', 'if (!estado) {')).toBe(true);
  });
  it('rejects typical mistakes', () => {
    expect(fixed('C6', 'if (estado == HIGH) {')).toBe(false);
    expect(fixFeedback('C6', 'if (estado = LOW) {')).toBe(MESSAGES.assignInIf);
    expect(fixFeedback('C6', 'if (estado == Low) {')).toBe(MESSAGES.caseMismatch);
  });
});
