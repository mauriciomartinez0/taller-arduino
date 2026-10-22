import 'server-only';

import type { CaseId } from '@/content/cases';

/**
 * Private case data: correct answers, feedback per wrong target, explanations and fixed versions.
 * Never import this from a client component.
 */

export type LocateAnswer = {
  /** Target ids that count as finding the error (`line:N` for code lines, element ids for circuits). */
  correct: string[];
  /** Guiding message for specific wrong targets. */
  feedback?: Record<string, string>;
  /** Message for any other wrong target (otherwise a generic one is used). */
  fallback?: string;
};

export type AcceptedLine =
  /** Compared against the normalized answer. */
  | { exact: string }
  /** Tested against the normalized answer; `note` is shown when accepted this way. */
  | { pattern: RegExp; note?: string };

export type FixAnswer =
  { type: 'choice'; correct: string } | { type: 'editLine'; accept: AcceptedLine[] };

export type CaseAnswer = {
  locate: LocateAnswer;
  fix: FixAnswer;
  /** "Por qué pasaba". */
  explanation: string;
  /** Extra message shown once solved. */
  solvedNote?: string;
  /** Corrected program (B and C cases). */
  fixedCode?: string;
  /** Scene id of the corrected circuit (A cases). */
  fixedCircuit?: string;
};

const LED_IS_FINE = 'El LED funciona: el problema es que siempre recibe la orden de encender.';

export const answers: Record<CaseId, CaseAnswer> = {
  A1: {
    locate: {
      correct: ['led'],
      feedback: {
        resistor: 'La resistencia está bien: 220 Ω y en su lugar.',
        wireSignal: 'El cable va al pin 8, igual que en el código.',
        wireGnd: 'El regreso a GND está completo.',
        jumperGnd: 'El regreso a GND está completo.',
      },
    },
    fix: { type: 'choice', correct: 'girar-led' },
    explanation:
      'Un LED solo deja pasar la corriente en un sentido: de la pata larga (+) a la corta (−). Al revés, bloquea la corriente. No se daña: solo no enciende.',
    fixedCircuit: 'A1-fixed',
  },
  A2: {
    locate: {
      correct: ['wireSignal'],
      feedback: {
        led: 'El LED está bien puesto. El problema está antes de llegar a él.',
        wireGnd: 'El regreso a GND está bien.',
        jumperGnd: 'El regreso a GND está bien.',
      },
    },
    fix: { type: 'choice', correct: 'resistencia-220' },
    explanation:
      'Sin resistencia, nada limita la corriente: pasa mucho más de 20 mA. El LED se quema y puede dañar el pin del Arduino. Siempre va una resistencia de 220 Ω entre el pin y la pata larga: (5 V − 2 V) ÷ 220 Ω ≈ 14 mA.',
    fixedCircuit: 'A2-fixed',
  },
  A3: {
    locate: {
      correct: ['ledCathode', 'column16'],
      feedback: {
        resistor: 'Esta parte está bien.',
        wireSignal: 'Esta parte está bien.',
        wireGnd: 'Este cable sí lleva GND al riel −. ¿Llega GND hasta el LED?',
      },
    },
    fix: { type: 'choice', correct: 'cable-col-16' },
    explanation:
      'El riel − tiene GND, pero la pata corta del LED no está conectada a él. El circuito queda abierto: sin camino de vuelta no hay corriente.',
    fixedCircuit: 'A3-fixed',
  },
  A4: {
    locate: {
      correct: ['wireSignal', 'arduinoPin9', 'line:1'],
      feedback: {
        led: 'Esta parte está bien.',
        resistor: 'Esta parte está bien.',
        jumperGnd: 'Esta parte está bien.',
      },
    },
    fix: { type: 'choice', correct: 'pin-8' },
    explanation:
      'El código enciende y apaga el pin 8, pero el cable está en el pin 9. Para el Arduino, en el pin 9 no pasa nada. Para eso sirven las constantes: si cambias de pin, solo editas una línea.',
    fixedCircuit: 'A4-fixed',
  },
  A5: {
    locate: {
      correct: ['jumperButtonGnd'],
      feedback: {
        wireButtonSignal: 'El cable del pin 2 está bien. Mira el otro cable del botón.',
        button: 'El botón está bien puesto sobre el canal.',
        led: LED_IS_FINE,
        resistor: LED_IS_FINE,
        wireSignal: LED_IS_FINE,
        jumperGnd: LED_IS_FINE,
      },
    },
    fix: { type: 'choice', correct: 'negro-col-6' },
    explanation:
      'El cable del pin 2 y el de GND están en la misma columna (4): quedan unidos por la protoboard, sin pasar por el botón. El pin 2 siempre lee LOW, que con INPUT_PULLUP significa “presionado”. El cable de GND va en la columna del otro lado del botón (6).',
    fixedCircuit: 'A5-fixed',
  },
  A6: {
    locate: {
      correct: ['jumperPotMiddle', 'wireA0'],
      feedback: {
        jumperPotRight: 'Ese extremo a GND está bien.',
        potentiometer: 'El potenciómetro está bien puesto. Revisa qué va a cada pata.',
      },
    },
    fix: { type: 'choice', correct: 'medio-a0' },
    explanation:
      'La pata del medio (el cursor) está en 5V y A0 en un extremo, así que A0 siempre ve 5V (1023). Al girar el cursor hasta la pata de GND, se unen 5V y GND: cortocircuito. Los extremos van a 5V y GND, y la pata del medio a A0. Si algo se calienta, desconecta el USB enseguida.',
    fixedCircuit: 'A6-fixed',
  },
  B1: {
    locate: {
      correct: ['line:2'],
      feedback: { 'line:3': 'El IDE marca esta línea, pero el error está justo antes.' },
    },
    fix: { type: 'editLine', accept: [{ exact: 'pinMode(8,OUTPUT);' }] },
    explanation:
      'Cada instrucción termina en ; (punto y coma). Al IDE le falta en la línea 2, pero solo se da cuenta al llegar a la llave de la línea 3. Regla: si el error no tiene sentido en esa línea, mira la de arriba.',
    fixedCode: `void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalWrite(8, HIGH);
  delay(1000);
  digitalWrite(8, LOW);
  delay(1000);
}`,
  },
  B2: {
    locate: { correct: ['line:6'] },
    fix: { type: 'editLine', accept: [{ exact: 'digitalWrite(8,HIGH);' }] },
    explanation:
      'El Arduino distingue mayúsculas de minúsculas: digitalwrite y digitalWrite son palabras distintas, y la primera no existe. Truco: si la palabra se pone de color en el IDE, es que la reconoce.',
    fixedCode: `void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalWrite(8, HIGH);
  delay(500);
  digitalWrite(8, LOW);
  delay(500);
}`,
  },
  B3: {
    locate: {
      correct: ['line:3'],
      feedback: {
        'line:8': 'Ahí se usa la variable, pero el problema es dónde se creó.',
        'line:10': 'Ahí se usa la variable, pero el problema es dónde se creó.',
      },
    },
    fix: { type: 'choice', correct: 'mover-arriba' },
    explanation:
      'La variable espera se creó dentro de setup(). Al cerrarse la llave del setup, la variable deja de existir, y el loop() no la conoce. Se crea arriba de todo, fuera de setup() y loop(), para que todos la vean.',
    fixedCode: `const int ESPERA = 500;   // tiempo de parpadeo (fuera de setup y loop)

void setup() {
  pinMode(8, OUTPUT);
}

void loop() {
  digitalWrite(8, HIGH);
  delay(ESPERA);
  digitalWrite(8, LOW);
  delay(ESPERA);
}`,
  },
  C1: {
    locate: { correct: ['line:10'] },
    fix: {
      type: 'editLine',
      accept: [
        { exact: 'delay(1000);' },
        {
          pattern: /^delay\(\d+\);$/,
          note: '¡Funciona! Para que quede igual de tiempo encendido y apagado, usa 1000.',
        },
      ],
    },
    explanation:
      'Después de apagar el LED, el loop vuelve a empezar al instante y lo enciende de nuevo. Queda apagado solo unos microsegundos, así que parece siempre encendido. Falta delay(1000) después de apagarlo.',
    fixedCode: `const int LED = 8;

void setup() {
  pinMode(LED, OUTPUT);
}

void loop() {
  digitalWrite(LED, HIGH);
  delay(1000);
  digitalWrite(LED, LOW);
  delay(1000);
}`,
  },
  C2: {
    locate: { correct: ['line:11'] },
    fix: { type: 'editLine', accept: [{ exact: 'if(estado==LOW){' }] },
    explanation:
      'Un solo = guarda LOW (0) en estado, y el if lo toma como “falso”, así que siempre va al else. Además, borra lo que se había leído. Para comparar se usan dos iguales: ==.',
    fixedCode: `const int BOTON = 2;
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
  },
  C3: {
    locate: {
      correct: ['line:15', 'line:17'],
      fallback: 'Esa línea está bien. El problema está en las preguntas del if.',
    },
    fix: { type: 'choice', correct: 'invertir-orden' },
    explanation:
      'Con nivel = 900, la primera pregunta (¿900 > 100?) ya es verdadera: enciende el amarillo y se salta el resto, así que la pregunta del rojo nunca se revisa. Regla: pregunta primero por el caso más extremo (el número más grande).',
    fixedCode: `const int LED_VERDE = 8, LED_AMARILLO = 9, LED_ROJO = 10;

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

  if (nivel > 400) {
    digitalWrite(LED_ROJO, HIGH);
  } else if (nivel > 100) {
    digitalWrite(LED_AMARILLO, HIGH);
  } else {
    digitalWrite(LED_VERDE, HIGH);
  }
  delay(100);
}`,
  },
  C4: {
    locate: {
      correct: ['line:2', 'line:1'],
      feedback: {
        'line:7': 'Estas líneas están bien escritas. ¿Qué falta antes de poder usarlas?',
        'line:8': 'Estas líneas están bien escritas. ¿Qué falta antes de poder usarlas?',
      },
    },
    fix: {
      type: 'editLine',
      accept: [
        { exact: 'Serial.begin(9600);' },
        {
          pattern: /^Serial\.begin\(\d+\);$/,
          note: 'Funciona, pero recuerda poner la misma velocidad en el monitor. En clase usamos 9600.',
        },
      ],
    },
    explanation:
      'Sin Serial.begin(), la comunicación nunca se abre: el Arduino “habla”, pero nadie lo escucha. Va en el setup(), y la velocidad del monitor debe ser la misma (9600).',
    fixedCode: `void setup() {
  Serial.begin(9600);
}

void loop() {
  int valor = analogRead(A0);
  Serial.print("Potenciómetro: ");
  Serial.println(valor);
  delay(300);
}`,
  },
  C5: {
    locate: {
      correct: ['line:1'],
      feedback: {
        'line:9': 'analogWrite está bien usado. Revisa en QUÉ pin.',
        'line:13': 'analogWrite está bien usado. Revisa en QUÉ pin.',
      },
    },
    fix: { type: 'editLine', accept: [{ pattern: /^constintLED=(3|5|6|9|10|11);$/ }] },
    solvedNote: '¡Y no olvides mover también el cable al nuevo pin!',
    explanation:
      'El pin 8 no tiene PWM. En un pin sin ~, analogWrite() solo apaga (valores menores que 128) o enciende (128 o más). Hay que usar un pin con ~ (3, 5, 6, 9, 10 u 11) y mover el cable.',
    fixedCode: `const int LED = 9;   // pin con ~ (PWM)

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
  },
  C6: {
    locate: { correct: ['line:11'] },
    fix: {
      type: 'editLine',
      accept: [
        { exact: 'if(estado==LOW){' },
        { exact: 'if(estado!=HIGH){' },
        { exact: 'if(!estado){' },
      ],
    },
    explanation:
      'Con INPUT_PULLUP, el pin lee HIGH cuando el botón está suelto y LOW cuando está presionado. La condición estaba al revés: hay que preguntar por LOW.',
    fixedCode: `const int BOTON = 2;
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
  },
};
