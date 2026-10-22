/**
 * Public case content: everything here ships to the browser.
 * Correct answers, explanations and fixed versions live in `server/answers.ts`.
 *
 * The Arduino programs are copied verbatim from the course material (Spanish identifiers on purpose).
 */

export const CASE_IDS = [
  'A1',
  'A2',
  'A3',
  'A4',
  'A5',
  'A6',
  'B1',
  'B2',
  'B3',
  'C1',
  'C2',
  'C3',
  'C4',
  'C5',
  'C6',
] as const;

export type CaseId = (typeof CASE_IDS)[number];
export type CaseGroup = 'A' | 'B' | 'C';

export const CASE_GROUPS: Record<CaseGroup, { title: string; description: string }> = {
  A: { title: 'Circuito', description: 'El código está bien: el problema está en las conexiones.' },
  B: { title: 'No compila', description: 'El IDE marca un error y no deja subir el programa.' },
  C: { title: 'Lógica', description: 'Compila bien, pero el Arduino no hace lo que queremos.' },
};

export type ChoiceOption = { id: string; text: string };

export type FixStep =
  | { type: 'choice'; options: ChoiceOption[] }
  /** `replace`: the chosen line becomes editable. `insertAfter`: a new empty line appears after it. */
  | { type: 'editLine'; line: number; mode: 'replace' | 'insertAfter' };

/** Clickable element of a circuit diagram (ids match the SVG scene in phase 4). */
export type CircuitTarget = { id: string; label: string };

type CaseBase = {
  id: CaseId;
  group: CaseGroup;
  title: string;
  typeLabel: string;
  expected: string;
  actual: string;
  hints: [string, string];
  /** False when the error can't be reproduced in the simulator (A2, A6). */
  hasWokwi: boolean;
  fix: FixStep;
};

export type CodeCase = CaseBase & {
  kind: 'code';
  /** Program with the error, shown with line numbers. */
  code: string;
  compilerOutput?: string;
  /** Overrides the default step-1 question. */
  locatePrompt?: string;
};

export type CircuitCase = CaseBase & {
  kind: 'circuit';
  circuit: string;
  targets: CircuitTarget[];
  /** Code shown next to the diagram. */
  code?: string;
  /** When true, the lines of `code` are clickable in step 1 too (A4). */
  codeClickable?: boolean;
};

export type Case = CodeCase | CircuitCase;

export const NO_SIMULATOR_NOTICE =
  'Este error no se puede ver en el simulador: se razona con lo que sabemos de electricidad.';

const BLINK_LED_8 = `const int LED = 8;

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  digitalWrite(LED, HIGH);
  delay(1000);
  digitalWrite(LED, LOW);
  delay(1000);
}`;

const LED_TARGETS: CircuitTarget[] = [
  { id: 'wireGnd', label: 'Cable de GND del Arduino al riel −' },
  { id: 'wireSignal', label: 'Cable azul del pin 8' },
  { id: 'resistor', label: 'Resistencia' },
  { id: 'led', label: 'LED' },
  { id: 'jumperGnd', label: 'Cable negro del LED al riel −' },
];

export const cases: Case[] = [
  {
    id: 'A1',
    group: 'A',
    kind: 'circuit',
    title: 'El LED no enciende',
    typeLabel: 'Circuito',
    expected: 'El LED del pin 8 parpadea cada segundo.',
    actual: 'El LED nunca enciende. El código está bien y el resto del circuito también.',
    hints: [
      'Fíjate en las marcas + y − del LED. ¿Hacia dónde va cada pata?',
      'La pata larga (+) debe ir hacia el pin (pasando por la resistencia), y la corta (−) hacia GND.',
    ],
    hasWokwi: true,
    circuit: 'A1',
    targets: LED_TARGETS,
    code: BLINK_LED_8,
    fix: {
      type: 'choice',
      options: [
        { id: 'resistencia-10k', text: 'Cambiar la resistencia por una de 10 kΩ' },
        { id: 'cable-pin-13', text: 'Mover el cable azul al pin 13' },
        {
          id: 'girar-led',
          text: 'Girar el LED: la pata larga (+) hacia la resistencia y la corta (−) hacia GND',
        },
        { id: 'segundo-gnd', text: 'Agregar un segundo cable a GND' },
      ],
    },
  },
  {
    id: 'A2',
    group: 'A',
    kind: 'circuit',
    title: 'El LED brilla muchísimo… y después nunca más',
    typeLabel: 'Circuito',
    expected: 'El LED enciende con un brillo normal.',
    actual: 'Al principio brilla muy fuerte. Al rato se apaga para siempre y huele raro.',
    hints: [
      'Sigue el camino del cable azul. ¿Qué componente falta entre el pin y el LED?',
      'Todo LED necesita algo que limite la corriente. Recuerda la ley de Ohm de la clase 1.',
    ],
    hasWokwi: false,
    circuit: 'A2',
    targets: LED_TARGETS.filter((t) => t.id !== 'resistor'),
    fix: {
      type: 'choice',
      options: [
        { id: 'girar-led', text: 'Girar el LED' },
        { id: 'otro-color', text: 'Usar un LED de otro color' },
        { id: 'pin-5v', text: 'Conectar el cable al pin 5V' },
        {
          id: 'resistencia-220',
          text: 'Poner una resistencia de 220 Ω entre el pin 8 y la pata larga del LED',
        },
      ],
    },
  },
  {
    id: 'A3',
    group: 'A',
    kind: 'circuit',
    title: 'Todo parece bien conectado, pero nada enciende',
    typeLabel: 'Circuito',
    expected: 'El LED del pin 8 parpadea.',
    actual: 'El LED no enciende nunca. El GND del Arduino sí está conectado al riel −.',
    hints: [
      'La corriente necesita un camino de ida y de vuelta. ¿Por dónde vuelve desde la pata corta?',
      'Mira la columna 16, la de la pata corta del LED. ¿Está conectada a algo?',
    ],
    hasWokwi: true,
    circuit: 'A3',
    targets: [
      { id: 'wireGnd', label: 'Cable de GND del Arduino al riel −' },
      { id: 'wireSignal', label: 'Cable azul del pin 8' },
      { id: 'resistor', label: 'Resistencia' },
      { id: 'led', label: 'LED' },
      { id: 'ledCathode', label: 'Pata corta del LED' },
      { id: 'column16', label: 'Columna 16' },
    ],
    fix: {
      type: 'choice',
      options: [
        { id: 'gnd-a-mas', text: 'Mover el cable de GND del Arduino al riel +' },
        { id: 'girar-led', text: 'Girar el LED' },
        { id: 'quitar-resistencia', text: 'Quitar la resistencia' },
        { id: 'cable-col-16', text: 'Agregar un cable de la columna 16 (pata corta) al riel −' },
      ],
    },
  },
  {
    id: 'A4',
    group: 'A',
    kind: 'circuit',
    title: 'El código está bien… ¿o no?',
    typeLabel: 'Circuito y código',
    expected: 'El LED parpadea cada segundo.',
    actual:
      'El LED no hace nada. El código compila sin errores y el LED, la resistencia y el GND están bien.',
    hints: [
      'Compara el número del pin en el código con el pin donde está conectado el cable azul.',
      'Mira el pin amarillo resaltado en el Arduino.',
    ],
    hasWokwi: true,
    circuit: 'A4',
    targets: [
      { id: 'wireGnd', label: 'Cable de GND del Arduino al riel −' },
      { id: 'arduinoPin9', label: 'Pin 9 del Arduino' },
      { id: 'wireSignal', label: 'Cable azul' },
      { id: 'resistor', label: 'Resistencia' },
      { id: 'led', label: 'LED' },
      { id: 'jumperGnd', label: 'Cable negro del LED al riel −' },
    ],
    code: BLINK_LED_8,
    codeClickable: true,
    fix: {
      type: 'choice',
      options: [
        { id: 'resistencia-1k', text: 'Cambiar la resistencia por una de 1 kΩ' },
        {
          id: 'pin-8',
          text: 'Mover el cable azul al pin 8 (o cambiar el código a `const int LED = 9;`)',
        },
        { id: 'girar-led', text: 'Girar el LED' },
        { id: 'led-5v', text: 'Conectar el LED directo a 5V' },
      ],
    },
  },
  {
    id: 'A5',
    group: 'A',
    kind: 'circuit',
    title: 'El botón está “siempre presionado”',
    typeLabel: 'Circuito',
    expected: 'El LED verde enciende solo mientras presionas el botón.',
    actual: 'El LED está encendido todo el tiempo, presiones o no.',
    hints: [
      'Mira las columnas. El cable verde (pin 2) y el cable negro (GND) del botón… ¿están en columnas distintas?',
      'Los 5 huecos de una columna están unidos. Si dos cables están en la misma columna, quedan conectados sin pasar por el botón.',
    ],
    hasWokwi: true,
    circuit: 'A5',
    targets: [
      { id: 'wireGnd', label: 'Cable de GND del Arduino al riel −' },
      { id: 'wireButtonSignal', label: 'Cable verde del pin 2' },
      { id: 'button', label: 'Botón' },
      { id: 'jumperButtonGnd', label: 'Cable negro del botón' },
      { id: 'wireSignal', label: 'Cable azul del pin 8' },
      { id: 'resistor', label: 'Resistencia' },
      { id: 'led', label: 'LED verde' },
      { id: 'jumperGnd', label: 'Cable negro del LED al riel −' },
    ],
    code: `const int BOTON = 2;
const int LED = 8;

void setup() {
  pinMode(BOTON, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
}

void loop() {
  int estado = digitalRead(BOTON);
  if (estado == LOW) {          // presionado
    digitalWrite(LED, HIGH);
  } else {
    digitalWrite(LED, LOW);
  }
}`,
    fix: {
      type: 'choice',
      options: [
        { id: 'quitar-pullup', text: 'Quitar INPUT_PULLUP del código' },
        { id: 'negro-col-6', text: 'Mover el cable negro a la columna 6 (el otro lado del botón)' },
        { id: 'negro-5v', text: 'Conectar el cable negro a 5V' },
        { id: 'girar-led', text: 'Girar el LED' },
      ],
    },
  },
  {
    id: 'A6',
    group: 'A',
    kind: 'circuit',
    title: 'El potenciómetro siempre marca 1023',
    typeLabel: 'Circuito',
    expected: 'Al girar la perilla, el Monitor Serie muestra números de 0 a 1023.',
    actual:
      'Siempre marca 1023. Y al girar hasta un extremo, el potenciómetro se calienta y el Arduino se reinicia.',
    hints: [
      'Recuerda qué trabajo tiene cada una de las 3 patas. ¿Cuál debe ir a A0?',
      'La pata del medio es el cursor: es la que “recoge” el voltaje. Mira qué tiene conectado.',
    ],
    hasWokwi: false,
    circuit: 'A6',
    targets: [
      { id: 'wire5v', label: 'Cable de 5V del Arduino al riel +' },
      { id: 'wireGnd', label: 'Cable de GND del Arduino al riel −' },
      { id: 'wireA0', label: 'Cable amarillo de A0' },
      { id: 'potentiometer', label: 'Potenciómetro' },
      { id: 'jumperPotMiddle', label: 'Cable rojo de la pata del medio' },
      { id: 'jumperPotRight', label: 'Cable negro de la pata derecha' },
    ],
    fix: {
      type: 'choice',
      options: [
        { id: 'pin-digital-8', text: 'Cambiar A0 por el pin digital 8' },
        { id: 'resistencia-amarillo', text: 'Agregar una resistencia de 220 Ω al cable amarillo' },
        { id: 'perilla-mitad', text: 'Dejar la perilla siempre en la mitad' },
        { id: 'medio-a0', text: 'La pata del medio a A0, y los extremos a 5V y GND' },
      ],
    },
  },
  {
    id: 'B1',
    group: 'B',
    kind: 'code',
    title: 'El IDE dice que hay un error… pero esa línea está bien',
    typeLabel: 'No compila',
    expected: 'Que compile y el LED parpadee.',
    actual: 'No compila. El IDE marca la línea 3, donde solo hay una llave }.',
    hints: [
      'Lee el mensaje: dice qué esperaba encontrar. El IDE avisa cuando se da cuenta… que suele ser una línea después.',
      'Mira el final de la línea 2. ¿Con qué termina toda instrucción?',
    ],
    hasWokwi: true,
    code: `void setup() {
  pinMode(8, OUTPUT)
}

void loop() {
  digitalWrite(8, HIGH);
  delay(1000);
  digitalWrite(8, LOW);
  delay(1000);
}`,
    compilerOutput: `sketch.ino: In function 'void setup()':
sketch.ino:3:1: error: expected ';' before '}' token
 }
 ^`,
    fix: { type: 'editLine', line: 2, mode: 'replace' },
  },
  {
    id: 'B2',
    group: 'B',
    kind: 'code',
    title: '“No fue declarado en este ámbito”',
    typeLabel: 'No compila',
    expected: 'Que compile y el LED parpadee.',
    actual: 'No compila: dice que digitalwrite “was not declared” (no fue declarado).',
    hints: [
      'Compara la línea 6 con la línea 8, letra por letra. ¿Para el Arduino son iguales?',
      'El Arduino distingue mayúsculas de minúsculas.',
    ],
    hasWokwi: true,
    code: `void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalwrite(8, HIGH);
  delay(500);
  digitalWrite(8, LOW);
  delay(500);
}`,
    compilerOutput: `sketch.ino: In function 'void loop()':
sketch.ino:6:3: error: 'digitalwrite' was not declared in this scope
   digitalwrite(8, HIGH);
   ^~~~~~~~~~~~`,
    fix: { type: 'editLine', line: 6, mode: 'replace' },
  },
  {
    id: 'B3',
    group: 'B',
    kind: 'code',
    title: 'La variable que “desapareció”',
    typeLabel: 'No compila',
    expected: 'Que compile y el LED parpadee cada medio segundo.',
    actual: 'No compila: dice que espera no existe… ¡pero está en la línea 3!',
    hints: [
      'Una variable creada dentro de unas llaves { } solo existe dentro de esas llaves.',
      '¿Dónde creamos siempre las constantes en nuestros programas: dentro del setup() o arriba de todo?',
    ],
    hasWokwi: true,
    code: `void setup() {
  pinMode(8, OUTPUT);
  int espera = 500;     // tiempo de parpadeo
}

void loop() {
  digitalWrite(8, HIGH);
  delay(espera);
  digitalWrite(8, LOW);
  delay(espera);
}`,
    compilerOutput: `sketch.ino: In function 'void loop()':
sketch.ino:8:9: error: 'espera' was not declared in this scope
   delay(espera);
         ^~~~~~`,
    fix: {
      type: 'choice',
      options: [
        { id: 'borrar-int', text: 'Borrar la palabra int de la línea 3' },
        { id: 'comillas', text: 'Escribir delay("espera") con comillas' },
        {
          id: 'mover-arriba',
          text: 'Mover la declaración arriba de todo, fuera de setup() y de loop()',
        },
        { id: 'cambiar-1000', text: 'Cambiar 500 por 1000' },
      ],
    },
  },
  {
    id: 'C1',
    group: 'C',
    kind: 'code',
    title: 'El LED no parpadea: se queda encendido',
    typeLabel: 'Lógica',
    expected: 'El LED enciende 1 segundo y se apaga 1 segundo.',
    actual: 'Compila bien, pero el LED parece siempre encendido.',
    hints: [
      'El loop() se repite rapidísimo. Después de apagar el LED… ¿cuánto tiempo espera antes de volver a encenderlo?',
      'Compara cuántos delay() hay con cuántos digitalWrite() hay.',
    ],
    hasWokwi: true,
    code: `const int LED = 8;

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  digitalWrite(LED, HIGH);
  delay(1000);
  digitalWrite(LED, LOW);
}`,
    locatePrompt: '¿Después de qué línea falta algo?',
    fix: { type: 'editLine', line: 10, mode: 'insertAfter' },
  },
  {
    id: 'C2',
    group: 'C',
    kind: 'code',
    title: 'El botón no hace nada',
    typeLabel: 'Lógica',
    expected: 'Al presionar el botón, el LED enciende.',
    actual: 'Compila (con una advertencia), pero el LED nunca enciende. El circuito está bien.',
    hints: [
      'Revisa la condición del if, símbolo por símbolo. ¿Está comparando o está guardando un valor?',
      'Para comparar se usan dos signos iguales.',
    ],
    hasWokwi: true,
    code: `const int BOTON = 2;
const int LED = 8;

void setup() {
  pinMode(BOTON, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
}

void loop() {
  int estado = digitalRead(BOTON);
  if (estado = LOW) {
    digitalWrite(LED, HIGH);
  } else {
    digitalWrite(LED, LOW);
  }
}`,
    fix: { type: 'editLine', line: 11, mode: 'replace' },
  },
  {
    id: 'C3',
    group: 'C',
    kind: 'code',
    title: 'La alarma roja nunca se enciende',
    typeLabel: 'Lógica',
    expected: 'Perilla baja: verde. Media: amarillo. Al tope (más de 400): rojo.',
    actual:
      'El verde y el amarillo funcionan, pero el rojo nunca enciende, aunque gires la perilla al máximo.',
    hints: [
      'Prueba “en tu cabeza” con nivel = 900. ¿Qué pregunta responde primero el Arduino?',
      'El Arduino revisa las condiciones en orden y se queda con la primera que sea verdadera.',
    ],
    hasWokwi: true,
    code: `const int LED_VERDE = 8, LED_AMARILLO = 9, LED_ROJO = 10;

void setup() {
  pinMode(LED_VERDE, OUTPUT);
  pinMode(LED_AMARILLO, OUTPUT);
  pinMode(LED_ROJO, OUTPUT);
}

void loop() {
  int nivel = analogRead(A0);    // potenciómetro
  digitalWrite(LED_VERDE, LOW);
  digitalWrite(LED_AMARILLO, LOW);
  digitalWrite(LED_ROJO, LOW);

  if (nivel > 100) {
    digitalWrite(LED_AMARILLO, HIGH);
  } else if (nivel > 400) {
    digitalWrite(LED_ROJO, HIGH);
  } else {
    digitalWrite(LED_VERDE, HIGH);
  }
  delay(100);
}`,
    fix: {
      type: 'choice',
      options: [
        { id: 'cambiar-1023', text: 'Cambiar 400 por 1023' },
        { id: 'borrar-else', text: 'Borrar el else final' },
        { id: 'delay-1000', text: 'Aumentar el delay a 1000' },
        {
          id: 'invertir-orden',
          text: 'Invertir el orden: preguntar primero si nivel > 400 y después si nivel > 100',
        },
      ],
    },
  },
  {
    id: 'C4',
    group: 'C',
    kind: 'code',
    title: 'El Monitor Serie está vacío',
    typeLabel: 'Lógica',
    expected: 'Ver en el Monitor Serie los números del potenciómetro.',
    actual: 'Compila y sube sin problemas, pero el Monitor Serie se queda en blanco.',
    hints: [
      'Antes de poder hablar con el computador, hay que abrir la comunicación.',
      '¿Qué línea va siempre en el setup() cuando usamos el Monitor Serie?',
    ],
    hasWokwi: true,
    code: `void setup() {
  // configuración
}

void loop() {
  int valor = analogRead(A0);
  Serial.print("Potenciómetro: ");
  Serial.println(valor);
  delay(300);
}`,
    fix: { type: 'editLine', line: 2, mode: 'replace' },
  },
  {
    id: 'C5',
    group: 'C',
    kind: 'code',
    title: 'El LED no se desvanece: parpadea',
    typeLabel: 'Lógica',
    expected: 'El LED sube y baja de brillo suavemente (efecto “fade”).',
    actual:
      'El LED está apagado un rato y de golpe se enciende al máximo. No hay brillos intermedios.',
    hints: [
      '¿Qué tienen de especial los pines marcados con ~? Mira tu tabla de la clase 2.',
      'analogWrite() solo da brillos intermedios en los pines 3, 5, 6, 9, 10 y 11.',
    ],
    hasWokwi: true,
    code: `const int LED = 8;

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  for (int b = 0; b <= 255; b++) {     // sube el brillo
    analogWrite(LED, b);
    delay(8);
  }
  for (int b = 255; b >= 0; b--) {     // baja el brillo
    analogWrite(LED, b);
    delay(8);
  }
}`,
    fix: { type: 'editLine', line: 1, mode: 'replace' },
  },
  {
    id: 'C6',
    group: 'C',
    kind: 'code',
    title: 'El LED funciona… al revés',
    typeLabel: 'Lógica',
    expected: 'El LED enciende mientras presionas el botón.',
    actual: 'El LED está encendido cuando no presionas, y se apaga cuando presionas.',
    hints: [
      'Con INPUT_PULLUP, ¿qué lee digitalRead() cuando el botón está presionado: HIGH o LOW?',
      'Compruébalo agregando Serial.println(estado); y mirando el Monitor Serie.',
    ],
    hasWokwi: true,
    code: `const int BOTON = 2;
const int LED = 8;

void setup() {
  pinMode(BOTON, INPUT_PULLUP);
  pinMode(LED, OUTPUT);
}

void loop() {
  int estado = digitalRead(BOTON);
  if (estado == HIGH) {         // ¿presionado?
    digitalWrite(LED, HIGH);
  } else {
    digitalWrite(LED, LOW);
  }
}`,
    fix: { type: 'editLine', line: 11, mode: 'replace' },
  },
];

const casesById = new Map<string, Case>(cases.map((c) => [c.id, c]));

export function isCaseId(id: string): id is CaseId {
  return casesById.has(id);
}

export function getCase(id: string): Case | undefined {
  return casesById.get(id);
}

/** Target id used for code lines in step 1 (e.g. `line:2`). */
export function lineTarget(line: number): string {
  return `line:${line}`;
}
