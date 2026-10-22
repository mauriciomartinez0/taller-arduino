/**
 * Public challenge content (statement, materials, hints).
 * Solutions live in `server/challenge-solutions.ts` and are only sent when the teacher
 * makes solutions visible. Programs are copied verbatim from the course material.
 */

export type ChallengeLevel = 1 | 2 | 3;

export type Challenge = {
  id: string;
  lesson: 2 | 3;
  kind: 'reto' | 'ejemplo';
  title: string;
  level?: ChallengeLevel;
  statement: string;
  /** "Lo lograste si…" */
  successCriteria?: string;
  steps?: string[];
  hints: string[];
  extras?: string[];
  /** Code that is always visible (not the solution). */
  givenCode?: { title: string; code: string };
  hasSolution: boolean;
};

export const MEDIR_RUIDO = `// Escucha durante 50 milisegundos y devuelve qué tan fuerte fue el sonido
int medirRuido() {
  int minimo = 1023;
  int maximo = 0;
  unsigned long inicio = millis();
  while (millis() - inicio < 50) {
    int valor = analogRead(A0);
    if (valor > maximo) maximo = valor;
    if (valor < minimo) minimo = valor;
  }
  return maximo - minimo;   // la "altura" de la onda
}`;

export const challenges: Challenge[] = [
  {
    id: 'reto-ola',
    lesson: 2,
    kind: 'reto',
    title: 'La ola de luz',
    statement:
      'Programa 3 LEDs (pines 9, 10 y 11, con resistencias de 220 Ω) para que la luz “viaje” de uno a otro como una ola, suavemente y sin saltos. El LED 1 se apaga mientras el LED 2 se enciende al mismo tiempo; luego el 2 le pasa la luz al 3, y el 3 se la devuelve al 1. Así, para siempre.',
    successCriteria:
      'El brillo cambia suave, nunca están los tres apagados y solo usas `analogWrite`, `for` y `delay`.',
    hints: [
      'Primero haz que solo el LED 1 se apague suavemente.',
      'Dentro de un mismo `for` puedes escribir en dos LEDs.',
      'Si `b` va de 0 a 255, ¿qué operación da 255 cuando b es 0, y 0 cuando b es 255?',
    ],
    extras: [
      'Ida y vuelta.',
      'Ola que se acelera en cada vuelta.',
      'Inventar una secuencia propia.',
    ],
    hasSolution: true,
  },
  {
    id: 'reto-amanecer',
    lesson: 2,
    kind: 'reto',
    title: 'Del amanecer a la noche',
    statement:
      'Con un LED rojo (pin 9), uno amarillo (10) y uno blanco o verde (11), simula un día: amanecer (el rojo se enciende lento, luego el amarillo, luego el blanco), mediodía (los tres al máximo 2 s), atardecer (se apagan en orden inverso, el rojo el más lento) y noche (el blanco es una estrella que titila débil exactamente 5 veces).',
    hints: [
      'Divide el código en 4 partes con comentarios.',
      'Para que un cambio sea más lento, cambia el `delay` de dentro del `for`.',
      'Un `for` también sirve para contar veces: `for (int i = 0; i < 5; i++)`.',
    ],
    extras: [
      'Calcular cuánto dura el amanecer (256 × 10 ms × 3 ≈ 7,7 s).',
      'Sol que “respira” al mediodía.',
      'Estrella con `random()`.',
    ],
    hasSolution: true,
  },
  {
    id: 'reto-inundacion-ejemplo',
    lesson: 3,
    kind: 'ejemplo',
    title: 'Alarma de inundación',
    statement:
      'El sensor de nivel de agua (S → A0, + → 5V, − → GND) controla 3 LEDs (verde pin 8, amarillo pin 9, rojo pin 10). Seco (menos de 100): verde, «Todo seco». Poca agua (más de 100): amarillo, «¡Cuidado, hay agua!». Mucha agua (más de 400): rojo, «¡Inundación!». Primero hay que observar los números en el Monitor Serie para elegir los límites.',
    hints: [],
    hasSolution: true,
  },
  {
    id: 'reto-ruido',
    lesson: 3,
    kind: 'reto',
    title: 'El semáforo del ruido del salón',
    statement:
      'Cambia el sensor de agua por el sensor de sonido (AO → A0, + → 5V, G → GND) y agrega el buzzer (+ → pin 7, − → GND). Silencio: LED verde. Están hablando: LED amarillo. ¡Demasiado ruido!: LED rojo y un pitido. En el Monitor Serie se ve el número del ruido y el mensaje.',
    steps: [
      'Dibujar el diagrama de flujo.',
      'Usar la función de regalo `medirRuido()` y mirar los números.',
      'Anotar los valores en silencio, hablando y con un aplauso.',
      'Elegir 2 límites y escribir el `if / else if / else`.',
    ],
    hints: [],
    extras: [
      'Que el rojo solo se encienda si el ruido fuerte dura un rato (contar cuántas veces seguidas se pasó el límite).',
    ],
    givenCode: { title: 'Función de regalo (no es la solución)', code: MEDIR_RUIDO },
    hasSolution: true,
  },
  ...(
    [
      [
        1,
        1,
        'El timbre',
        'Mientras presionas el botón, el buzzer suena. Cuando lo sueltas, silencio.',
        'Usa el código del botón y cambia el LED por el buzzer.',
      ],
      [
        2,
        1,
        'Parpadeo a tu gusto',
        'El potenciómetro controla qué tan rápido parpadea un LED.',
        'Puedes usar el valor del potenciómetro directo dentro del `delay()`.',
      ],
      [
        3,
        1,
        'Medidor de giro',
        'El Monitor Serie muestra cuánto está girado el potenciómetro, en porcentaje: “Giro: 75 %”.',
        '`map(valor, 0, 1023, 0, 100)`.',
      ],
      [
        4,
        1,
        'Alarma de cercanía',
        'Cuando algo se acerca al sensor IR, el buzzer da 3 pitidos y el monitor dice “¡Intruso!”.',
        'Junta el código del sensor IR con el del buzzer.',
      ],
      [
        5,
        2,
        'Sensor de reversa',
        'El potenciómetro simula la distancia: mientras más lo giras, más rápido pita el buzzer.',
        '`pausa = map(valor, 0, 1023, 1000, 50)` y úsala en los delay.',
      ],
      [
        6,
        2,
        'El semáforo de la planta',
        'Tres LEDs muestran la humedad de la tierra: verde (más de 60 %), amarillo (30–60 %) y rojo (menos de 30 %).',
        'Usa `if`, `else if` y `else`.',
      ],
      [
        7,
        2,
        'Contador de 0 a 9',
        'Cada vez que presionas el botón, el display suma 1. Después del 9 vuelve al 0.',
        'Después de sumar, espera a que suelten el botón: `while (digitalRead(BOTON) == LOW) { }`.',
      ],
      [
        8,
        2,
        'Lámpara por aplauso',
        'Un aplauso enciende el LED; otro aplauso lo apaga.',
        'Guarda el estado en `bool encendido` y usa `encendido = !encendido;`.',
      ],
      [
        9,
        3,
        'Alarma de inundación',
        'Si el nivel de agua pasa tu límite: el buzzer suena a ratos, un LED rojo parpadea y el monitor avisa.',
        'Primero mide cuánto marca tu sensor en un vaso.',
      ],
      [
        10,
        3,
        'Termómetro con display',
        'Muestra la temperatura del DHT11 en el display, un dígito a la vez (decenas y luego unidades).',
        '`decenas = temp / 10;` y `unidades = temp % 10;` (con `int temp`).',
      ],
      [
        11,
        3,
        'Dado electrónico',
        'Al presionar el botón, el display muestra números al azar muy rápido y se detiene en uno del 1 al 6.',
        '`random(1, 7)` da un número del 1 al 6. Usa un `for` para la animación.',
      ],
      [
        12,
        3,
        'Mi invento',
        'Inventa algo útil para tu casa o tu colegio con al menos 1 sensor y 2 salidas.',
        'Piensa primero qué problema resuelve, qué sensor lo detecta y cómo avisa.',
      ],
    ] as const
  ).map(([n, level, title, statement, hint]): Challenge => ({
    id: `reto-nivel-${n}`,
    lesson: 3,
    kind: 'reto',
    title: `${n}. ${title}`,
    level,
    statement,
    hints: [hint],
    hasSolution: false,
  })),
];

const byId = new Map(challenges.map((c) => [c.id, c]));

export function getChallenge(id: string): Challenge | undefined {
  return byId.get(id);
}
