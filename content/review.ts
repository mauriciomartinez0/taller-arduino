/**
 * Review topics (/repaso). Public content: texts and quiz questions.
 * Correct answers live in `server/quiz-answers.ts`.
 */

export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'code'; code: string }
  | { type: 'callout'; tone: 'warn' | 'accent'; text: string }
  | { type: 'heading'; text: string }
  | {
      type: 'interactive';
      id: 'resistor-calculator' | 'potentiometer' | 'if-slider' | 'pwm-slider';
    }
  | { type: 'sensors' };

export type QuizQuestion = { id: string; prompt: string; options: { id: string; text: string }[] };

export type ReviewTopic = {
  slug: string;
  title: string;
  summary: string;
  lesson: number;
  blocks: Block[];
  quiz: QuizQuestion[];
};

/** Options are listed in a neutral order and shuffled on screen. */
const q = (id: string, prompt: string, options: [string, string][]): QuizQuestion => ({
  id,
  prompt,
  options: options.map(([oid, text]) => ({ id: oid, text })),
});

export const SENSORS = [
  {
    name: 'Sensor IR de obstáculos',
    measures: 'Si hay algo cerca, por la luz infrarroja que rebota.',
    output: 'Digital',
    pin: 'OUT → pin 4 · VCC → 5V · GND → GND',
    values: '`digitalRead`: LOW = hay obstáculo, HIGH = libre.',
  },
  {
    name: 'Sensor de sonido',
    measures: 'Qué tan fuerte suena el ambiente.',
    output: 'Analógica (AO) y digital (DO)',
    pin: 'AO → A0 · DO → pin 3 · + → 5V · G → GND',
    values:
      'AO da números de 0 a 1023; DO avisa cuando se pasa el límite. El tornillo azul ajusta la sensibilidad.',
  },
  {
    name: 'Sensor de humedad de tierra',
    measures: 'Cuánta agua tiene la tierra de la maceta.',
    output: 'Analógica',
    pin: 'AO → A1 · VCC → pin 6 (digital) · GND → GND',
    values:
      'Seco = número alto, húmedo = número bajo. Aliméntalo desde un pin digital (`HIGH` solo al medir) para que no se oxide.',
  },
  {
    name: 'Sensor de nivel de agua',
    measures: 'Qué tanto del sensor está bajo el agua.',
    output: 'Analógica',
    pin: 'S → A0 · + → 5V · − → GND',
    values: 'Más agua = número más alto.',
  },
  {
    name: 'DHT11',
    measures: 'Temperatura y humedad del aire.',
    output: 'Datos (digital, con librería)',
    pin: 'DATA → pin 2 · VCC → 5V · GND → GND',
    values:
      'Librería “DHT sensor library” de Adafruit. Lee cada 2 s como mínimo. Mide de 0 a 50 °C y de 20 a 90 % de humedad.',
  },
  {
    name: 'Buzzer activo (TMB12A05)',
    measures: 'No mide: es una salida que pita.',
    output: 'Digital',
    pin: 'Pata larga (+) → pin 7 · pata corta (−) → GND',
    values: '`digitalWrite(7, HIGH)` suena, `LOW` se calla.',
  },
] as const;

export const reviewTopics: ReviewTopic[] = [
  {
    slug: 'pines',
    title: 'Pines del Arduino UNO',
    summary: 'Digitales, PWM (~) y analógicos: qué lee y qué escribe cada uno.',
    lesson: 2,
    blocks: [
      {
        type: 'table',
        head: ['Pines', 'Qué hacen', 'Funciones'],
        rows: [
          [
            'Digitales 0–13',
            'Leen o escriben solo dos valores: HIGH (5 V) o LOW (0 V).',
            '`pinMode`, `digitalWrite`, `digitalRead`',
          ],
          [
            'PWM ~ (3, 5, 6, 9, 10, 11)',
            'Además, escriben valores intermedios de 0 a 255.',
            '`analogWrite`',
          ],
          [
            'Analógicos A0–A5',
            'Leen voltajes de 0 a 5 V como números de 0 a 1023.',
            '`analogRead`',
          ],
        ],
      },
      { type: 'heading', text: 'El resumen 2 × 2' },
      {
        type: 'table',
        head: ['', 'Digital', 'Analógico'],
        rows: [
          ['Escribir', 'Todos los pines (`digitalWrite`)', 'Solo los ~ (`analogWrite`)'],
          ['Leer', 'Todos los pines (`digitalRead`)', 'Solo A0–A5 (`analogRead`)'],
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        text: 'Los pines 0 y 1 se usan para la comunicación con el computador: mejor no conectes nada ahí. Y `analogWrite` no funciona en A0–A5.',
      },
    ],
    quiz: [
      q('pines-1', '¿En qué pines da brillos intermedios `analogWrite()`?', [
        ['a0a5', 'En A0–A5'],
        ['todos', 'En todos los pines digitales'],
        ['pwm', 'Solo en los pines con ~ (3, 5, 6, 9, 10 y 11)'],
        ['13', 'Solo en el pin 13'],
      ]),
      q('pines-2', 'Quieres leer un potenciómetro. ¿A qué pin conectas la pata del medio?', [
        ['9', 'Al pin 9'],
        ['a0', 'Al pin A0'],
        ['0', 'Al pin 0'],
        ['5v', 'Al pin 5V'],
      ]),
      q('pines-3', '¿Por qué es mejor no usar los pines 0 y 1?', [
        ['pwm', 'Porque no tienen PWM'],
        ['solo-leen', 'Porque solo sirven para leer'],
        ['serial', 'Porque se usan para la comunicación con el computador'],
        ['3v', 'Porque dan 3,3 V en vez de 5 V'],
      ]),
      q('pines-4', '¿Con qué función lees si un pulsador está presionado?', [
        ['analogread', '`analogRead`'],
        ['digitalread', '`digitalRead`'],
        ['analogwrite', '`analogWrite`'],
        ['digitalwrite', '`digitalWrite`'],
      ]),
    ],
  },
  {
    slug: 'resistencias',
    title: 'Resistencias y código de colores',
    summary: 'Leer las bandas de colores y calcular la resistencia de un LED.',
    lesson: 3,
    blocks: [
      {
        type: 'p',
        text: 'Las dos primeras bandas son números, la tercera dice cuántos ceros agregar y la última es la tolerancia (qué tan exacto es el valor).',
      },
      {
        type: 'table',
        head: ['Color', 'Número'],
        rows: [
          ['Negro', '0'],
          ['Café', '1'],
          ['Rojo', '2'],
          ['Naranja', '3'],
          ['Amarillo', '4'],
          ['Verde', '5'],
          ['Azul', '6'],
          ['Violeta', '7'],
          ['Gris', '8'],
          ['Blanco', '9'],
          ['Dorado', 'tolerancia ±5 %'],
          ['Plateado', 'tolerancia ±10 %'],
        ],
      },
      {
        type: 'callout',
        tone: 'accent',
        text: 'Truco del arcoíris: del 2 al 7 los colores van en el orden del arcoíris: rojo, naranja, amarillo, verde, azul, violeta.',
      },
      { type: 'interactive', id: 'resistor-calculator' },
      { type: 'heading', text: 'Ley de Ohm con el LED' },
      {
        type: 'p',
        text: 'Un LED rojo usa unos 2 V y aguanta unos 20 mA (0,02 A). Con los 5 V del Arduino, a la resistencia le tocan 5 V − 2 V = 3 V. Entonces R = 3 V ÷ 0,02 A = 150 Ω. Ese es el mínimo: usamos 220 Ω, el valor comercial más cercano por encima, para ir seguros.',
      },
    ],
    quiz: [
      q('resistencias-1', '¿Cuánto vale una resistencia rojo-rojo-café-dorado?', [
        ['22', '22 Ω'],
        ['2200', '2200 Ω'],
        ['220', '220 Ω'],
        ['120', '120 Ω'],
      ]),
      q('resistencias-2', '¿Qué significa la banda dorada?', [
        ['10', 'Tolerancia ±10 %'],
        ['5', 'Tolerancia ±5 %'],
        ['x10', 'Multiplica por 10'],
        ['cero', 'Que el valor es 0'],
      ]),
      q('resistencias-3', '¿Cuánto vale una resistencia café-negro-naranja?', [
        ['103', '103 Ω'],
        ['1k', '1 kΩ'],
        ['10k', '10 kΩ'],
        ['100k', '100 kΩ'],
      ]),
      q(
        'resistencias-4',
        'Con 5 V, un LED de 2 V y una corriente de 0,02 A, ¿qué resistencia mínima da la ley de Ohm?',
        [
          ['100', '100 Ω'],
          ['150', '150 Ω'],
          ['250', '250 Ω'],
          ['2.5', '2,5 Ω'],
        ],
      ),
    ],
  },
  {
    slug: 'monitor-serie',
    title: 'Monitor Serie',
    summary: 'Ver lo que piensa el Arduino: `Serial.begin`, `print` y `println`.',
    lesson: 3,
    blocks: [
      {
        type: 'p',
        text: 'El Monitor Serie es una ventana del IDE donde el Arduino te escribe mensajes y números. Es la mejor herramienta para saber qué está leyendo un sensor.',
      },
      {
        type: 'code',
        code: `void setup() {
  Serial.begin(9600);          // abre la comunicación
}

void loop() {
  int valor = analogRead(A0);
  Serial.print("Valor: ");     // escribe y se queda en la misma línea
  Serial.println(valor);       // escribe y salta a la línea siguiente
  delay(300);
}`,
      },
      {
        type: 'list',
        items: [
          '`Serial.begin(9600)` va en el `setup()`. Sin esa línea, el monitor se queda en blanco.',
          '`print` escribe y sigue en la misma línea; `println` escribe y salta de línea.',
          'La velocidad del monitor (abajo a la derecha) debe ser la misma del código: 9600. Si no coincide, salen símbolos raros.',
          'El Serial Plotter (Herramientas → Serial Plotter) dibuja los números como una gráfica.',
        ],
      },
    ],
    quiz: [
      q('monitor-serie-1', '¿Dónde va `Serial.begin(9600);`?', [
        ['loop', 'Dentro del `loop()`'],
        ['setup', 'Dentro del `setup()`'],
        ['arriba', 'Arriba de todo, antes del `setup()`'],
        ['nada', 'No hace falta escribirla'],
      ]),
      q('monitor-serie-2', '¿Qué diferencia hay entre `print` y `println`?', [
        ['color', '`println` escribe en otro color'],
        ['salto', '`println` salta a la línea siguiente después de escribir'],
        ['numeros', '`print` solo escribe números'],
        ['igual', 'Ninguna, son iguales'],
      ]),
      q('monitor-serie-3', 'El monitor muestra símbolos raros. ¿Qué revisas primero?', [
        ['usb', 'Cambiar el cable USB'],
        ['velocidad', 'Que la velocidad del monitor sea la misma del código'],
        ['delay', 'Aumentar el `delay`'],
        ['pin', 'Cambiar el pin del sensor'],
      ]),
      q('monitor-serie-4', '¿Para qué sirve el Serial Plotter?', [
        ['subir', 'Para subir el programa más rápido'],
        ['grafica', 'Para ver los números como una gráfica'],
        ['errores', 'Para encontrar errores de compilación'],
        ['imprimir', 'Para imprimir el código'],
      ]),
    ],
  },
  {
    slug: 'potenciometro',
    title: 'Potenciómetro',
    summary: 'Cómo es por dentro, sus 3 patas y el divisor de voltaje.',
    lesson: 3,
    blocks: [
      {
        type: 'p',
        text: 'Por dentro tiene una pista de carbón y un cursor que se desliza sobre ella cuando giras la perilla. Los extremos de la pista van a 5V y a GND, y el cursor (la pata del medio) “recoge” un voltaje entre 0 y 5 V: es un divisor de voltaje.',
      },
      {
        type: 'table',
        head: ['Voltaje en A0', '`analogRead(A0)`'],
        rows: [
          ['0 V', '0'],
          ['2,5 V', '512'],
          ['5 V', '1023'],
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        text: 'Los extremos van a 5V y GND, y la pata del medio a A0. Si conectas el cursor a 5V, al girar hasta GND haces un cortocircuito.',
      },
      { type: 'interactive', id: 'potentiometer' },
      {
        type: 'p',
        text: '`map(valor, 0, 1023, 0, 255)` convierte la lectura (0–1023) al rango de `analogWrite` (0–255).',
      },
    ],
    quiz: [
      q('potenciometro-1', '¿Qué pata del potenciómetro va a A0?', [
        ['izq', 'La de la izquierda'],
        ['medio', 'La del medio'],
        ['der', 'La de la derecha'],
        ['cualquiera', 'Cualquiera'],
      ]),
      q('potenciometro-2', 'Si A0 recibe 2,5 V, ¿qué número da `analogRead(A0)`?', [
        ['255', 'Unos 255'],
        ['512', 'Unos 512'],
        ['1023', '1023'],
        ['2.5', '2,5'],
      ]),
      q('potenciometro-3', '¿Cuánto da `map(1023, 0, 1023, 0, 255)`?', [
        ['0', '0'],
        ['128', '128'],
        ['255', '255'],
        ['1023', '1023'],
      ]),
    ],
  },
  {
    slug: 'decisiones-if',
    title: 'Decisiones con if',
    summary: '`if / else if / else`, los comparadores y por qué importa el orden.',
    lesson: 3,
    blocks: [
      {
        type: 'table',
        head: ['Comparador', 'Pregunta'],
        rows: [
          ['`>`', '¿mayor que?'],
          ['`<`', '¿menor que?'],
          ['`>=`', '¿mayor o igual?'],
          ['`<=`', '¿menor o igual?'],
          ['`==`', '¿igual a?'],
          ['`!=`', '¿distinto de?'],
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        text: 'Un solo `=` guarda un valor; dos `==` comparan. `if (estado = LOW)` no pregunta nada: guarda LOW en estado.',
      },
      {
        type: 'p',
        text: 'El Arduino revisa las condiciones en orden y se queda con la primera que sea verdadera. Por eso, en la alarma de inundación, se pregunta primero por el caso más extremo (más de 400) y después por el siguiente (más de 100). Mueve el deslizador para ver qué camino se ejecuta:',
      },
      { type: 'interactive', id: 'if-slider' },
    ],
    quiz: [
      q('decisiones-if-1', '¿Cuál línea pregunta si `estado` es igual a LOW?', [
        ['asignar', '`if (estado = LOW)`'],
        ['comparar', '`if (estado == LOW)`'],
        ['distinto', '`if (estado != LOW)`'],
        ['mayor', '`if (estado >= LOW)`'],
      ]),
      q(
        'decisiones-if-2',
        'Con `nivel = 250`: `if (nivel > 400)` rojo, `else if (nivel > 100)` amarillo, `else` verde. ¿Qué LED enciende?',
        [
          ['rojo', 'El rojo'],
          ['amarillo', 'El amarillo'],
          ['verde', 'El verde'],
          ['ninguno', 'Ninguno'],
        ],
      ),
      q('decisiones-if-3', '¿Por qué se pregunta primero `nivel > 400` y después `nivel > 100`?', [
        ['rapido', 'Porque así el programa es más rápido'],
        ['primera', 'Porque el Arduino se queda con la primera condición verdadera'],
        ['grande', 'Porque los números grandes siempre van primero en C++'],
        ['igual', 'Da igual el orden'],
      ]),
      q('decisiones-if-4', '¿Qué pregunta `!=`?', [
        ['igual', '¿Es igual?'],
        ['distinto', '¿Es distinto?'],
        ['mayor', '¿Es mayor?'],
        ['negativo', '¿Es negativo?'],
      ]),
    ],
  },
  {
    slug: 'pwm',
    title: 'PWM y analogWrite',
    summary: 'Cómo un pin digital “finge” brillos intermedios.',
    lesson: 2,
    blocks: [
      {
        type: 'p',
        text: 'Un pin digital solo sabe dar 0 V o 5 V. Con PWM se prende y se apaga muy rápido (unas 500 veces por segundo): si pasa más tiempo encendido, el LED se ve más brillante. `analogWrite(pin, valor)` recibe un valor de 0 a 255.',
      },
      {
        type: 'table',
        head: ['Valor', 'Tiempo encendido'],
        rows: [
          ['0', '0 % (apagado)'],
          ['64', '25 %'],
          ['128', '50 %'],
          ['191', '75 %'],
          ['255', '100 % (máximo)'],
        ],
      },
      { type: 'interactive', id: 'pwm-slider' },
    ],
    quiz: [
      q('pwm-1', '¿Qué rango de valores recibe `analogWrite`?', [
        ['1023', 'De 0 a 1023'],
        ['255', 'De 0 a 255'],
        ['100', 'De 0 a 100'],
        ['5', 'De 0 a 5'],
      ]),
      q('pwm-2', '`analogWrite(9, 128)` deja el LED encendido…', [
        ['25', 'El 25 % del tiempo'],
        ['50', 'La mitad del tiempo'],
        ['100', 'Todo el tiempo'],
        ['nunca', 'Nunca'],
      ]),
      q('pwm-3', '¿Qué hace `analogWrite(9, 0)`?', [
        ['apaga', 'Apaga el LED'],
        ['max', 'Lo enciende al máximo'],
        ['medio', 'Lo deja a medio brillo'],
        ['error', 'Da error'],
      ]),
    ],
  },
  {
    slug: 'sensores',
    title: 'Sensores del kit',
    summary: 'Qué mide cada sensor, qué salida tiene y qué números da.',
    lesson: 3,
    blocks: [
      {
        type: 'p',
        text: 'Antes de escribir un `if`, mira siempre en el Monitor Serie qué números da tu sensor: cada sensor (y cada salón) es distinto.',
      },
      { type: 'sensors' },
      {
        type: 'callout',
        tone: 'accent',
        text: 'Los pines de esta página son un ejemplo: puedes usar otros, siempre que el código diga los mismos.',
      },
    ],
    quiz: [
      q('sensores-1', 'El sensor IR detecta un obstáculo. ¿Qué lee `digitalRead`?', [
        ['high', 'HIGH'],
        ['low', 'LOW'],
        ['1023', '1023'],
        ['0-100', 'Un número de 0 a 100'],
      ]),
      q('sensores-2', 'Con el sensor de humedad de tierra, ¿qué da la tierra seca?', [
        ['alto', 'Un número alto'],
        ['bajo', 'Un número bajo'],
        ['cero', 'Siempre 0'],
        ['high', 'HIGH'],
      ]),
      q('sensores-3', '¿Cada cuánto conviene leer el DHT11?', [
        ['10ms', 'Cada 10 milisegundos'],
        ['2s', 'Cada 2 segundos o más'],
        ['1h', 'Una vez por hora'],
        ['siempre', 'Sin pausa, lo más rápido posible'],
      ]),
      q('sensores-4', '¿Con qué función haces sonar el buzzer activo?', [
        ['analogread', '`analogRead`'],
        ['digitalwrite', '`digitalWrite`'],
        ['serial', '`Serial.println`'],
        ['map', '`map`'],
      ]),
      q('sensores-5', 'Con el sensor de nivel de agua, si hay más agua…', [
        ['alto', 'El número sube'],
        ['bajo', 'El número baja'],
        ['igual', 'El número no cambia'],
        ['low', 'Lee LOW'],
      ]),
    ],
  },
  {
    slug: 'encontrar-errores',
    title: 'Método para encontrar errores',
    summary: 'Los 5 pasos y la lista de chequeo del circuito.',
    lesson: 4,
    blocks: [
      { type: 'heading', text: 'Los 5 pasos' },
      {
        type: 'list',
        items: [
          '**Observar:** ¿qué debería pasar y qué pasa en realidad?',
          '**Revisar el circuito** con la lista de chequeo.',
          '**Leer el mensaje de error** del IDE (y mirar también la línea de arriba).',
          '**Usar el Monitor Serie** para ver qué está leyendo y decidiendo el Arduino.',
          '**Cambiar una cosa a la vez** y probar otra vez.',
        ],
      },
      { type: 'heading', text: 'Lista de chequeo del circuito' },
      {
        type: 'list',
        items: [
          '**GND:** ¿el GND del Arduino llega al circuito?',
          '**Pin:** ¿el cable está en el mismo pin que dice el código?',
          '**Polaridad:** ¿la pata larga del LED va hacia el pin y la corta hacia GND?',
          '**Resistencia:** ¿hay una de 220 Ω antes del LED?',
          '**Columnas:** ¿cada pata está en la columna correcta de la protoboard?',
          '**Contacto:** ¿los cables están bien metidos?',
        ],
      },
    ],
    quiz: [
      q('encontrar-errores-1', '¿Cuál es el primer paso del método?', [
        ['codigo', 'Borrar el código y empezar de nuevo'],
        ['observar', 'Observar qué debería pasar y qué pasa'],
        ['cables', 'Cambiar todos los cables'],
        ['profe', 'Llamar al profe'],
      ]),
      q('encontrar-errores-2', '¿Por qué se cambia una sola cosa a la vez?', [
        ['rapido', 'Porque es más rápido'],
        ['saber', 'Para saber qué cambio lo arregló (o lo dañó)'],
        ['ide', 'Porque el IDE no deja cambiar más'],
        ['regla', 'Porque es una regla del colegio'],
      ]),
      q(
        'encontrar-errores-3',
        'El código compila, pero el LED no enciende. ¿Qué revisas con la lista de chequeo?',
        [
          ['monitor', 'Solo la velocidad del Monitor Serie'],
          ['lista', 'GND, pin, polaridad, resistencia, columnas y contacto'],
          ['ide', 'Reinstalar el IDE'],
          ['nada', 'Nada: si compila, el circuito está bien'],
        ],
      ),
    ],
  },
];

const bySlug = new Map(reviewTopics.map((t) => [t.slug, t]));

export function getReviewTopic(slug: string) {
  return bySlug.get(slug);
}

/** Progress item id of a quiz question, e.g. "quiz-pines-1". */
export const quizItemId = (questionId: string) => `quiz-${questionId}`;
