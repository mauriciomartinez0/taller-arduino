/**
 * Final project of the period (/proyectos), from the slides “proyecto final - fichas”.
 * Texts use **bold** and `code`.
 */

export type WireDot =
  'red' | 'black' | 'white' | 'blue' | 'green' | 'yellow' | 'orange' | 'cyan' | 'purple';

export type Connection = { color: WireDot; pin: string; to: string };

export type Project = {
  slug: string;
  number: number;
  emoji: string;
  title: string;
  /** Main components, shown on the project list. */
  kit: string;
  story: string;
  basic: string[];
  extra: string;
  materials: string[];
  connections: Connection[];
  hints: string[];
};

const POWER: Connection[] = [
  { color: 'red', pin: '5V', to: 'riel + de la protoboard' },
  { color: 'black', pin: 'GND', to: 'riel − de la protoboard' },
];

const BUTTON: Connection = {
  color: 'blue',
  pin: 'Pin 2',
  to: 'una pata del botón · la pata del otro lado → GND',
};

const IR: Connection = {
  color: 'white',
  pin: 'Pin 4',
  to: 'OUT del sensor IR (VCC → 5V, GND → GND)',
};

const LEDS: Connection[] = [
  { color: 'green', pin: 'Pin 8', to: '220 Ω → pata larga del LED verde · pata corta → GND' },
  { color: 'yellow', pin: 'Pin 9', to: '220 Ω → pata larga del LED amarillo · pata corta → GND' },
  { color: 'orange', pin: 'Pin 10', to: '220 Ω → pata larga del LED rojo · pata corta → GND' },
  { color: 'purple', pin: 'Pin 7', to: 'pata larga (+) del buzzer · pata corta (−) → GND' },
];

const THREE_LEDS = ['3 LEDs (verde, amarillo, rojo)', '3 resistencias de 220 Ω', 'Buzzer'];

export const projects: Project[] = [
  {
    slug: 'humedad-del-suelo',
    number: 1,
    emoji: '🌱',
    title: 'Monitor de humedad del suelo',
    kit: 'Sensor de humedad de tierra, 3 LEDs',
    story:
      'Una planta sin agua se daña en pocos días. Construye un sistema que vigile la humedad de la tierra y avise cuando haya que regar.',
    basic: [
      'El Monitor Serie muestra la humedad en **porcentaje** (0 a 100 %).',
      '**Más de 60 %** → LED verde.',
      '**Entre 30 y 60 %** → LED amarillo.',
      '**Menos de 30 %** → LED rojo, 3 pitidos y el mensaje «¡Tengo sed! Riégame».',
      'Mide cada 2 segundos.',
    ],
    extra:
      'Un botón (pin 2) que **silencia** la alarma: los LEDs siguen funcionando, pero el buzzer deja de sonar hasta que vuelvas a presionarlo.',
    materials: [
      'Sensor de humedad de tierra',
      '3 LEDs (verde, amarillo, rojo)',
      '3 resistencias de 220 Ω',
      'Buzzer',
      'Una matera o vaso con tierra',
    ],
    connections: [
      { color: 'orange', pin: 'Pin 12', to: 'VCC del sensor de humedad' },
      { color: 'cyan', pin: 'A0', to: 'AO del sensor' },
      { color: 'black', pin: 'GND', to: 'GND del sensor' },
      ...LEDS,
    ],
    hints: [
      'Primero calibra: anota el valor del sensor **al aire** (seco) y **en un vaso de agua** (mojado).',
      'Para pasar a porcentaje: `map(valor, SECO, MOJADO, 0, 100)` y luego `constrain(humedad, 0, 100)`.',
      'El sensor se alimenta desde el pin 12: enciéndelo (HIGH), espera 10 ms, lee y apágalo. Así no se oxida.',
    ],
  },
  {
    slug: 'alarma-de-inundacion',
    number: 2,
    emoji: '🌧️',
    title: 'Alarma de inundación',
    kit: 'Sensor de nivel de agua, 3 LEDs',
    story:
      'En temporada de lluvias, el agua puede subir muy rápido. Construye una alarma que avise cuando el nivel del agua empiece a subir.',
    basic: [
      'El Monitor Serie muestra el nivel del agua (el número que da el sensor).',
      '**Seco** → LED verde y «Todo seco».',
      '**Un poco de agua** → LED amarillo y «¡Cuidado, hay agua!».',
      '**Mucha agua** → LED rojo, pitidos y «¡Inundación!».',
      'Tú decides los dos límites, después de medir.',
    ],
    extra:
      'Agrega el **potenciómetro** (pata del medio → A1) para ajustar el límite de «¡Inundación!» girando la perilla, sin cambiar el código. Muestra el límite en el Monitor Serie.',
    materials: [
      'Sensor de nivel de agua',
      '3 LEDs (verde, amarillo, rojo)',
      '3 resistencias de 220 Ω',
      'Buzzer',
      'Un vaso con agua',
    ],
    connections: [
      { color: 'orange', pin: 'Pin 12', to: '+ del sensor de nivel' },
      { color: 'cyan', pin: 'A0', to: 'S del sensor' },
      { color: 'black', pin: 'GND', to: '− del sensor' },
      ...LEDS,
    ],
    hints: [
      'Mide primero: ¿qué número da el sensor seco, hundido un poco y hundido casi todo? Con eso eliges los límites.',
      'En el if, pregunta primero por el caso **más grande** (mucha agua). ¿Recuerdas el caso C3 de la clase pasada?',
      'Moja solo las pistas del sensor, nunca los pines.',
    ],
  },
  {
    slug: 'contador-automatico',
    number: 3,
    emoji: '🔢',
    title: 'Contador automático',
    kit: 'Sensor IR de obstáculos, Pulsador',
    story:
      'En una fábrica, los productos pasan por una banda transportadora y hay que contarlos. Construye un contador automático que avise cuando se completa un lote.',
    basic: [
      'Cada vez que pasa la mano (un “objeto”) frente al sensor, suma **1**, da un bip corto y muestra el total en el Monitor Serie.',
      'Cuenta **una sola vez** por cada paso, aunque la mano se quede quieta frente al sensor.',
      'Los LEDs muestran el avance del lote de 9: verde desde 3, amarillo desde 6 y rojo al llegar a 9.',
      'Al llegar a 9: alarma y «¡Lote completo!». El botón reinicia el contador a 0.',
    ],
    extra:
      'Lleva la cuenta de cuántos **lotes completos** van en el día y muéstrala en el Monitor Serie cada vez que se reinicia el contador.',
    materials: ['Sensor IR de obstáculos', 'Pulsador', ...THREE_LEDS],
    connections: [...POWER, IR, BUTTON, ...LEDS],
    hints: [
      'El sensor IR da **LOW** cuando detecta algo.',
      'Para contar una sola vez: después de sumar, espera a que la mano se quite con `while (digitalRead(PIN_IR) == LOW) { }`.',
      'Calibra el tornillo azul del sensor para que detecte a unos 5 cm.',
    ],
  },
  {
    slug: 'parqueadero-inteligente',
    number: 4,
    emoji: '🅿️',
    title: 'Parqueadero inteligente',
    kit: 'Sensor IR de obstáculos, Pulsador',
    story:
      'En el parqueadero del centro comercial, un letrero dice si hay cupos libres. Construye el sistema que cuenta los carros y avisa cuando está lleno.',
    basic: [
      'El parqueadero tiene **5 cupos**. El Monitor Serie siempre muestra cuántos quedan libres.',
      'Cada carro que pasa frente al sensor IR **resta un cupo** y suena un bip.',
      'Si hay cupos → LED verde. Si no quedan cupos → LED rojo.',
      'Si llega un carro cuando está lleno: pitido largo y «¡Parqueadero lleno!» (sin restar).',
    ],
    extra:
      'El **botón** registra que un carro **sale** (suma un cupo, sin pasar de 5). Y cuando queda **un solo cupo**, se enciende el LED amarillo con el mensaje «¡Último cupo!».',
    materials: ['Sensor IR de obstáculos (la entrada)', 'Pulsador (la salida)', ...THREE_LEDS],
    connections: [...POWER, IR, BUTTON, ...LEDS],
    hints: [
      'Cada carro debe contar una sola vez: espera a que se quite del sensor con un `while`.',
      'Guarda los cupos en una variable: `int cupos = 5;` y réstale 1 con `cupos = cupos - 1;`.',
      'Antes de restar, pregunta con un if si todavía hay cupos.',
    ],
  },
  {
    slug: 'temporizador',
    number: 5,
    emoji: '⏲️',
    title: 'Temporizador',
    kit: 'Potenciómetro, Pulsador',
    story:
      'Para medir el tiempo de una exposición, de un ejercicio o de una prueba hace falta un temporizador. Construye uno donde eliges el tiempo con una perilla y te avisa cuando se acaba.',
    basic: [
      'Con la perilla eliges el tiempo: de **5 a 60 segundos**, de 5 en 5. El Monitor Serie muestra el tiempo elegido (solo cuando cambia).',
      'Mientras eliges, el LED amarillo está encendido.',
      'Al presionar el botón empieza la cuenta regresiva: «Faltan 20 s», «Faltan 19 s»… con el LED verde parpadeando.',
      'En los últimos 5 segundos parpadea el **rojo** con un bip cada segundo.',
      'Al llegar a 0: «¡Tiempo!» y una alarma de 3 pitidos largos.',
    ],
    extra: 'Que el botón también sirva para **cancelar** la cuenta regresiva a mitad de camino.',
    materials: ['Potenciómetro', 'Pulsador', ...THREE_LEDS],
    connections: [
      ...POWER,
      { color: 'cyan', pin: 'A0', to: 'pata del MEDIO del potenciómetro (extremos → 5V y GND)' },
      BUTTON,
      ...LEDS,
    ],
    hints: [
      '`map(analogRead(A0), 0, 1024, 1, 13)` da un número del 1 al 12. Multiplícalo por 5.',
      'Para mostrar el tiempo solo cuando cambia, guárdalo en una variable `anterior` y compáralo.',
      'La cuenta regresiva es un `for` que va hacia atrás: `for (int t = segundos; t > 0; t--)`.',
    ],
  },
  {
    slug: 'semaforo-del-ruido',
    number: 6,
    emoji: '🔊',
    title: 'Semáforo del ruido',
    kit: 'Sensor de sonido, 3 LEDs',
    story:
      'Cuando el salón está muy ruidoso nadie se concentra. Construye un semáforo que muestre qué tan ruidoso está el salón y avise cuando se pasan.',
    basic: [
      'Usa la función `medirRuido()` de la clase 3 y muestra el ruido en el Monitor Serie.',
      '**Silencio** → LED verde.',
      '**Están hablando** → LED amarillo.',
      '**¡Demasiado ruido!** → LED rojo y un pitido.',
      'Los límites los eliges tú, después de medir en el salón.',
    ],
    extra:
      'Cuenta cuántas veces se pasan de ruido. Cuando lleguen a **5**: alarma larga y el mensaje «¡Salón muy ruidoso!», y el contador vuelve a 0.',
    materials: ['Sensor de sonido', ...THREE_LEDS],
    connections: [
      ...POWER,
      { color: 'cyan', pin: 'A0', to: 'AO del sensor de sonido (+ → 5V, G → GND)' },
      ...LEDS,
    ],
    hints: [
      'Mide primero: ¿qué número da en silencio? ¿Hablando normal? ¿Con un aplauso?',
      'Si el LED rojo no se apaga, el sensor está muy sensible: gira su tornillo azul.',
      'Guarda los límites como constantes arriba del código, así los cambias en una sola línea.',
    ],
  },
  {
    slug: 'alarma-antirrobo',
    number: 7,
    emoji: '🚨',
    title: 'Alarma antirrobo',
    kit: 'Sensor IR de obstáculos, Pulsador',
    story:
      'Una tienda quiere proteger su vitrina en la noche. Construye una alarma que se active con un botón y suene si alguien se acerca.',
    basic: [
      'Al presionar el botón, la alarma se **activa** (LED rojo fijo y «Alarma ACTIVADA»). Al presionarlo otra vez, se **desactiva** (LED verde).',
      'Si está activada y alguien pasa frente al sensor: «¡INTRUSO!» y una **sirena**: el buzzer y el LED rojo parpadean rápido.',
      'La sirena suena hasta que alguien presione el botón, y entonces la alarma queda desactivada.',
      'Si está desactivada, el sensor no hace nada.',
    ],
    extra:
      'Al activarla, una **cuenta regresiva de 5 segundos** para que el dueño alcance a salir: el LED amarillo parpadea con un bip por segundo, y después se arma.',
    materials: ['Sensor IR de obstáculos', 'Pulsador', ...THREE_LEDS],
    connections: [...POWER, IR, BUTTON, ...LEDS],
    hints: [
      'Guarda si la alarma está activada en `bool activada = false;` y cámbiala con `activada = !activada;`.',
      'Después de leer el botón, espera a que lo suelten con un `while`. Si no, cambiaría de estado muchas veces.',
      'La sirena puede ser un `while` que se repite mientras el botón NO esté presionado.',
    ],
  },
  {
    slug: 'juego-de-reflejos',
    number: 8,
    emoji: '⚡',
    title: 'Juego de reflejos',
    kit: 'Pulsador, 3 LEDs',
    story:
      '¿Quién tiene los reflejos más rápidos de la clase? Construye un juego que mida, en milésimas de segundo, cuánto tardas en reaccionar.',
    basic: [
      'El LED amarillo se enciende: «Prepárate…». Después de un tiempo **al azar** (entre 2 y 5 s) se enciende el **rojo**: ¡YA!',
      'El jugador presiona el botón lo más rápido posible. El Monitor Serie muestra el tiempo en milisegundos.',
      'Si tardó **menos de 500 ms**: LED verde, bip y un punto más. Si no: «Muy lento».',
      'Si presiona **antes** de que se encienda el rojo: pitido largo y «¡Trampa!».',
    ],
    extra:
      '**Duelo:** un segundo botón (pin 3) para el otro jugador de la pareja. Gana el primero que presione cuando se encienda el rojo, y el Monitor Serie lleva el marcador de los dos.',
    materials: ['Pulsador', ...THREE_LEDS],
    connections: [...POWER, BUTTON, ...LEDS],
    hints: [
      '`random(2000, 5000)` da un tiempo al azar. En el setup pon `randomSeed(analogRead(A5));` para que no se repita siempre igual.',
      '`millis()` dice cuántos milisegundos lleva encendido el Arduino. Guárdalo cuando se enciende el rojo y réstalo cuando presionen.',
      'Para detectar la trampa, revisa el botón mientras esperas el tiempo al azar.',
    ],
  },
  {
    slug: 'lampara-inteligente',
    number: 9,
    emoji: '💡',
    title: 'Lámpara inteligente',
    kit: 'Sensor de sonido, Potenciómetro',
    story:
      '¿Una lámpara que se prende con un aplauso? Construye una lámpara que se enciende y se apaga aplaudiendo, y cuyo brillo eliges con una perilla.',
    basic: [
      'Un aplauso **enciende** la lámpara y otro aplauso la **apaga**.',
      'Mientras está encendida, la perilla controla el **brillo** (de apagado a máximo).',
      'El Monitor Serie dice «Lámpara encendida» o «Lámpara apagada» cada vez que cambia.',
      'Un mismo aplauso no debe contarse dos veces.',
    ],
    extra:
      'Que la lámpara se encienda y se apague **suavemente** (efecto fade de la clase 2), en lugar de hacerlo de golpe.',
    materials: [
      'Sensor de sonido',
      'Potenciómetro',
      '1 LED (la lámpara)',
      '1 resistencia de 220 Ω',
    ],
    connections: [
      ...POWER,
      { color: 'white', pin: 'Pin 5', to: 'DO del sensor de sonido (+ → 5V, G → GND)' },
      { color: 'cyan', pin: 'A0', to: 'pata del MEDIO del potenciómetro (extremos → 5V y GND)' },
      { color: 'yellow', pin: 'Pin 9 (~)', to: '220 Ω → pata larga del LED · pata corta → GND' },
    ],
    hints: [
      'Ajusta el tornillo azul del sensor: el LED del módulo debe encenderse solo con el aplauso, no con la voz.',
      'Guarda el estado en `bool encendida = false;` y cámbialo con `encendida = !encendida;`. Después espera unos 400 ms.',
      'El LED va en el pin 9 porque necesita PWM para los brillos: `analogWrite` y `map(valor, 0, 1023, 0, 255)`.',
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const RUBRIC = [
  {
    emoji: '🔌',
    criterion: 'Funciona',
    value: '2,0',
    goal: 'La versión básica hace **todo** lo que pide la ficha (0,5 por cada punto de la lista que funcione, hasta 2,0).',
  },
  {
    emoji: '🔀',
    criterion: 'Diagrama de flujo',
    value: '0,5',
    goal: 'Está en el cuaderno, tiene inicio, decisiones (rombos) y los caminos posibles.',
  },
  {
    emoji: '💻',
    criterion: 'Código',
    value: '0,5',
    goal: 'Usa constantes para los pines, tiene comentarios y está ordenado (sangría).',
  },
  {
    emoji: '🎤',
    criterion: 'Presentación',
    value: '1,0',
    goal: 'En 2 minutos explican qué problema resuelve, qué componentes usaron, cómo decide el programa y qué fue lo más difícil.',
  },
  {
    emoji: '⭐',
    criterion: 'Extra',
    value: '1,0',
    goal: 'Hicieron el extra de la ficha (o una mejora propia que el profe apruebe).',
  },
] as const;

export const PRESENTATION_STEPS = [
  '¿Qué problema resuelve?',
  'Demostración en vivo.',
  '¿Cómo decide el programa? (muestren el if)',
  '¿Qué fue lo más difícil y cómo lo resolvieron?',
];

export const FLOWCHART_EXAMPLES = [
  {
    image: '/proyectos/diagrama-ejemplo-1.webp',
    width: 1105,
    height: 792,
    title: 'Luz con botón: un if con 2 caminos',
    alt: 'Diagrama de flujo: Inicio, setup, leer el botón, rombo ¿Presionado? Sí: encender el LED. No: apagar el LED. Las dos ramas vuelven a leer el botón.',
    notes: [
      '**Qué hace:** mientras presionas el botón, el LED se enciende. Cuando lo sueltas, se apaga.',
      '**Lo importante:** hay **una sola pregunta** (¿presionado?), así que hay **un rombo** con dos caminos: Sí y No.',
      '**En el código:** `if (estado == LOW) { … } else { … }`. El «Sí» es lo que va dentro del if; el «No», lo que va dentro del else.',
    ],
  },
  {
    image: '/proyectos/diagrama-ejemplo-2.webp',
    width: 1980,
    height: 702,
    title: 'Indicador de batería: 3 caminos con 2 rombos',
    alt: 'Diagrama de flujo: Inicio, setup, leer la perilla, mostrar en el Monitor Serie, apagar los 3 LEDs. Rombo ¿valor > 700? Sí: LED verde. No: rombo ¿valor > 300? Sí: LED amarillo. No: LED rojo y bip. Luego esperar 500 ms y volver a leer la perilla.',
    notes: [
      '**Qué hace:** la perilla simula la carga de una batería; 3 LEDs muestran si está llena, media o baja.',
      '**3 opciones = 2 rombos:** primero se pregunta por el número **más grande** (700) y luego por el siguiente (300).',
      '**En el código:** `if` → `else if` → `else`. Cada color del diagrama es uno de esos bloques.',
    ],
  },
  {
    image: '/proyectos/diagrama-ejemplo-3.webp',
    width: 1125,
    height: 792,
    title: 'Timbre que cuenta visitas: una variable que guarda',
    alt: 'Diagrama de flujo: Inicio, setup con visitas = 0. Rombo ¿Presionan? No: vuelve a preguntar. Sí: sumar una visita, bip y mostrar. Rombo ¿visitas ≥ 5? Sí: LED rojo encendido. Después esperar a que suelte y volver a preguntar.',
    notes: [
      '**Qué hace:** cada vez que presionan el timbre suma una visita y suena un bip. A partir de 5 visitas se enciende el LED rojo.',
      '**La variable:** `visitas` empieza en 0 en el setup() y **guarda** el número entre una vuelta y otra del loop.',
      '**Dos regresos:** si no presionan, el programa vuelve a preguntar. Al final de cada visita, también vuelve a la pregunta del inicio.',
    ],
  },
] as const;

export const PROJECTS_PDF = '/proyectos/fichas-proyecto-final.pdf';
