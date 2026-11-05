/**
 * Class slides (/clases). Generated from the course PDFs: each slide is an image in
 * `public/clases/<slug>/NN.webp`, and its text is used as the alt text.
 * The teacher-only solution slides were left out (clase 4: 20–24; leer y decidir: 11–12).
 */

export type Slide = { kicker: string; title: string; text: string };

export type ClassDeck = {
  slug: string;
  lesson: string;
  title: string;
  summary: string;
  pdf: string;
  slides: Slide[];
};

export const SLIDE_SIZE = { width: 1600, height: 901 } as const;

export const classDecks: ClassDeck[] = [
  {
    slug: 'clases-1-y-2',
    lesson: 'Clases 1 y 2',
    title: 'Punto de partida: placa, electricidad y primeros programas',
    summary:
      'Qué es Arduino, los pines, la ley de Ohm, la protoboard, el IDE, variables, if/for/while y 7 ejemplos: del Blink al pulsador.',
    pdf: '/clases/clases-1-y-2.pdf',
    slides: [
      {
        kicker: 'PUNTO DE PARTIDA',
        title: '¿Qué es Arduino?',
        text: 'PUNTO DE PARTIDA 02 ¿Qué es Arduino? La placa (hardware) El IDE (software) La comunidad El circuito físico con su chip, sus pines El programa gratuito donde escribes Miles de ejemplos, librerías y y su conector USB. La más común es el código en el computador y lo envías tutoriales gratis. Casi cualquier idea la Arduino UNO. a la placa por el cable USB. que se te ocurra ya la intentó alguien. Una placa Arduino es una placa de desarrollo electrónico que integra un microcontrolador, junto con los componentes necesarios para alimentarlo, programarlo y conectarlo con sensores, actuadores y otros…',
      },
      {
        kicker: 'LA PLACA',
        title: 'Anatomía de una Arduino UNO',
        text: 'LA PLACA 04 Anatomía de una Arduino UNO Todas las placas Arduino comparten esta misma lógica: pines, alimentación y un microcontrolador.',
      },
      {
        kicker: 'LA PLACA',
        title: 'Anatomía de una Arduino UNO',
        text: 'LA PLACA 04 Anatomía de una Arduino UNO Todas las placas Arduino comparten esta misma lógica: pines, alimentación y un microcontrolador.',
      },
      {
        kicker: 'LA PLACA',
        title: 'Anatomía de una Arduino UNO',
        text: 'LA PLACA 04 Anatomía de una Arduino UNO Todas las placas Arduino comparten esta misma lógica: pines, alimentación y un microcontrolador.',
      },
      {
        kicker: 'LA PLACA',
        title: 'Los pines: por dónde entra y sale la información',
        text: 'LA PLACA 05 Los pines: por dónde entra y sale la información',
      },
      {
        kicker: 'ENERGÍA',
        title: '¿Cómo se alimenta el Arduino?',
        text: 'ENERGÍA 06 ¿Cómo se alimenta el Arduino?',
      },
      {
        kicker: 'ELECTRICIDAD',
        title: 'Voltaje, corriente y resistencia',
        text: 'ELECTRICIDAD 07 Voltaje, corriente y resistencia',
      },
      { kicker: 'ELECTRICIDAD', title: 'La ley de Ohm', text: 'ELECTRICIDAD 08 La ley de Ohm' },
      {
        kicker: 'ELECTRICIDAD',
        title: 'Por qué el LED siempre lleva resistencia',
        text: 'ELECTRICIDAD 09 Por qué el LED siempre lleva resistencia',
      },
      {
        kicker: 'MONTAJE',
        title: 'La protoboard: conectar sin soldar',
        text: 'MONTAJE 10 La protoboard: conectar sin soldar',
      },
      {
        kicker: 'SOFTWARE',
        title: 'El Arduino IDE por dentro',
        text: 'SOFTWARE 11 El Arduino IDE por dentro',
      },
      {
        kicker: 'SOFTWARE',
        title: 'Cómo se guarda un programa',
        text: 'SOFTWARE 12 Cómo se guarda un programa',
      },
      {
        kicker: 'SOFTWARE',
        title: 'Del código a la placa',
        text: 'SOFTWARE 13 Del código a la placa',
      },
      {
        kicker: 'PROGRAMACIÓN',
        title: 'La estructura de todo sketch: setup() y loop()',
        text: 'PROGRAMACIÓN 14 La estructura de todo sketch: setup() y loop()',
      },
      {
        kicker: 'PROGRAMACIÓN',
        title: 'Un sketch comentado línea por línea',
        text: 'PROGRAMACIÓN 15 Un sketch comentado línea por línea Todo lo que va después de // es un comentario: el Arduino lo ignora, pero tu profesor y tu yo del futuro lo agradecen.',
      },
      {
        kicker: 'PROGRAMACIÓN',
        title: 'Variables: tipos de datos',
        text: 'PROGRAMACIÓN 16 Variables: tipos de datos',
      },
      {
        kicker: 'PROGRAMACIÓN',
        title: 'Declarar variables y constantes',
        text: 'PROGRAMACIÓN 17 Declarar variables y constantes Estructura: tipo + nombre + = + valor + ; · const significa que el valor nunca cambia.',
      },
      {
        kicker: 'PROGRAMACIÓN',
        title: 'Decisiones y ciclos: if, for y while',
        text: 'PROGRAMACIÓN 18 Decisiones y ciclos: if, for y while Con estas tres estructuras se puede programar prácticamente cualquier cosa.',
      },
      {
        kicker: 'PROGRAMACIÓN',
        title: 'Las funciones que más vas a usar',
        text: 'PROGRAMACIÓN 19 Las funciones que más vas a usar',
      },
      {
        kicker: 'EJEMPLO 1',
        title: 'Encender un LED: el sketch “Blink”',
        text: 'EJEMPLO 1 20 Encender un LED: el sketch “Blink” Montaje: pin 8 → resistencia de 220 Ω → pata larga del LED · pata corta del LED → GND.',
      },
      {
        kicker: 'EJEMPLO 2',
        title: 'El mismo LED, pero con nombres claros',
        text: 'EJEMPLO 2 21 El mismo LED, pero con nombres claros Usar constantes al inicio hace que el código se entienda y que cambiar de pin sea cuestión de una línea.',
      },
      {
        kicker: 'EJEMPLO 3',
        title: 'Secuencia de tres LEDs: el montaje',
        text: 'EJEMPLO 3 22 Secuencia de tres LEDs: el montaje',
      },
      {
        kicker: 'EJEMPLO 3',
        title: 'Secuencia de tres LEDs: el código',
        text: 'EJEMPLO 3 23 Secuencia de tres LEDs: el código Fíjate en el patrón: encender → esperar → apagar. Se repite para cada LED.',
      },
      {
        kicker: 'EJEMPLO 4',
        title: 'Barrido tipo “auto fantástico” con un ciclo for',
        text: 'EJEMPLO 4 24 Barrido tipo “auto fantástico” con un ciclo for Seis LEDs en los pines 2 a 7 y solo dos ciclos for: ida y vuelta.',
      },
      {
        kicker: 'EJEMPLO 5',
        title: 'Un semáforo de verdad',
        text: 'EJEMPLO 5 25 Un semáforo de verdad',
      },
      {
        kicker: 'EJEMPLO 5',
        title: 'El código del semáforo',
        text: 'EJEMPLO 5 26 El código del semáforo Aquí creamos nuestra propia función, luz(), para no repetir las mismas cuatro líneas tres veces.',
      },
      {
        kicker: 'EJEMPLO 6',
        title: 'PWM: brillos intermedios',
        text: 'EJEMPLO 6 27 PWM: brillos intermedios',
      },
      {
        kicker: 'EJEMPLO 6',
        title: 'El código del efecto “fade”',
        text: 'EJEMPLO 6 28 El código del efecto “fade” Recuerda: analogWrite() solo funciona en los pines marcados con ~.',
      },
      {
        kicker: 'EJEMPLO 7',
        title: 'Leer un pulsador: la primera entrada',
        text: 'EJEMPLO 7 29 Leer un pulsador: la primera entrada',
      },
      {
        kicker: 'EJEMPLO 7',
        title: 'El código del pulsador',
        text: 'EJEMPLO 7 30 El código del pulsador digitalRead() devuelve HIGH o LOW; el if decide qué hacer con esa respuesta.',
      },
      {
        kicker: 'HERRAMIENTA CLAVE',
        title: 'El Monitor Serie: depurar y ver datos',
        text: 'HERRAMIENTA CLAVE 31 El Monitor Serie: depurar y ver datos',
      },
      {
        kicker: 'CONSEJOS',
        title: 'Errores comunes (y cómo salir de ellos)',
        text: 'CONSEJOS 32 Errores comunes (y cómo salir de ellos)',
      },
      {
        kicker: 'CONCEPTO CLAVE',
        title: 'Los tres tipos de pines del Arduino UNO',
        text: 'CONCEPTO CLAVE Los tres tipos de pines del Arduino UNO Digitales Digitales PWM ~ Analógicos pines 0 – 13 pines 3, 5, 6, 9, 10, 11 pines A0 – A5 Solo 2 estados: Igual que los digitales: Cualquier voltaje de 0 a 5 V, ¿Qué leen? LOW (0 V) o HIGH (5 V) LOW o HIGH como un número de 0 a 1023 0 V, 5 V o un “promedio” Solo 0 V o 5 V (como digitales). ¿Qué escriben? Solo 0 V o 5 V con valores de 0 a 255 No pueden hacer PWM Leer con… digitalRead() digitalRead() analogRead() y digitalRead() Escribir con… digitalWrite() digitalWrite() y analogWrite() digitalWrite() Digitales: pulsador, Analógicos…',
      },
      {
        kicker: 'RESUMEN',
        title: '¿Qué pin uso?',
        text: 'RESUMEN ¿Qué pin uso? DIGITAL ANALÓGICO solo 0 V o 5 V valores intermedios ✏️ ESCRIBIR Todos los pines digitalWrite(pin, HIGH) Solo los PWM ~ ~3 ~5 ~6 ~9 ~10 ~11 el Arduino habla analogWrite(pin, 0 … 255) 👂 LEER Todos los pines digitalRead(pin) Solo los analógicos A0 A1 A2 A3 A4 A5 el Arduino escucha analogRead(pin) → 0 … 1023 ⚠️ Pines 0 y 1: mejor no usarlos. El Arduino los necesita para hablar con el computador.',
      },
    ],
  },
  {
    slug: 'clase-3-sensores',
    lesson: 'Clase 3',
    title: 'Sensores: el Arduino aprende a escuchar',
    summary:
      'Resistencias, Monitor Serie, potenciómetro, pulsador, buzzer, display de 7 segmentos y los cinco sensores del kit, con retos al final.',
    pdf: '/clases/clase-3-sensores.pdf',
    slides: [
      {
        kicker: 'CLASE 3',
        title: 'Sensores: el Arduino aprende a escuchar',
        text: 'PROGRAMACIÓN CON ARDUINO · CLASE 3 Sensores: el Arduino aprende a escuchar Potenciómetro, pulsador, buzzer, display y cinco sensores UNO del kit. Leemos el mundo, lo vemos en el Monitor Serie y 8 reaccionamos. Entradas analogRead() Monitor Serie Retos',
      },
      {
        kicker: 'PUNTO DE PARTIDA',
        title: 'De hablar a escuchar: entradas y salidas',
        text: 'PUNTO DE PARTIDA De hablar a escuchar: entradas y salidas 02 👂 🧠 📢 Las clases 1 y 2 fueron de salidas: el Arduino hablaba. Hoy trabajamos las entradas: el Arduino escucha. 1. ENTRADA 2. PROCESO 3. SALIDA Un sensor mide algo del mundo: luz, sonido, humedad, si presionaste un ➜ El Arduino decide qué hacer con esa información según tu programa. ➜ Algo reacciona: un LED se enciende, el buzzer suena, el display muestra un botón… número. if map() Serial digitalRead() analogRead() digitalWrite() analogWrite() Entrada digital: ¿SÍ o NO? Entrada analógica: ¿CUÁNTO? Solo dos respuestas: HIGH o LOW. Se…',
      },
      {
        kicker: 'TU KIT',
        title: 'Lo que trae el kit de cada pareja',
        text: 'TU KIT Lo que trae el kit de cada pareja 03 Arduino UNO Protoboard Jumpers Resistencias LEDs Pulsadores Potenciómetro El cerebro Conectar sin soldar Los cables Limitan la corriente Salida Entrada digital Entrada analógica + 8 Buzzer TMB12A05 Display 7 Sensor IR Sensor de sonido Humedad de tierra Nivel de agua DHT11 segmentos Salida (sonido) Entrada digital Analógica y digital Analógica y digital Entrada analógica Temperatura y Salida (números) humedad Entrada digital responde SÍ o NO Entrada analógica responde CUÁNTO (0 a 1023) Salida el Arduino la controla Digital especial envía datos Hoy…',
      },
      {
        kicker: 'PLAN DE HOY',
        title: 'La ruta de la clase',
        text: 'PLAN DE HOY La ruta de la clase 04 Herramientas 1 Código de colores de las resistencias y el Monitor Serie. Entradas básicas 2 Potenciómetro (a fondo) y pulsador. Salidas nuevas 3 Buzzer y display de 7 segmentos. Sensores 4 IR, sonido, humedad de tierra, nivel de agua y DHT11. Retos 5 Combina sensores y salidas para crear tus propios inventos.',
      },
      {
        kicker: 'RESISTENCIAS',
        title: 'El código de colores',
        text: 'RESISTENCIAS El código de colores 05 Resistencia de 4 bandas Color Cifra Multiplicador Tolerancia Negro 0 ×1 Café (marrón) 1 × 10 ±1% Rojo 2 × 100 ±2% 1ª cifra tolerancia 2ª cifra Naranja 3 × 1.000 multiplicador Amarillo 4 × 10.000 Verde 5 × 100.000 Las resistencias son tan pequeñas que no cabe el Azul 6 × 1.000.000 número impreso. Por eso su valor se escribe con colores. Violeta 7 Gris 8 Truco para recordar el orden: los colores del 2 al 7 Blanco 9 siguen el arcoíris: rojo, naranja, amarillo, verde, azul, violeta. Antes van negro (0) y café (1); después Dorado — × 0,1 ±5% gris (8) y blanco…',
      },
      {
        kicker: 'RESISTENCIAS',
        title: 'Cómo leer una resistencia de 4 bandas',
        text: 'RESISTENCIAS Cómo leer una resistencia de 4 bandas 06 rojo 2 · rojo 2 · café ×10 Paso a paso 22 × 10 = 220 Ω → para LEDs 1. Pon la banda dorada a la derecha. 2. Las 2 primeras bandas son cifras: escríbelas juntas. 3. La 3ª banda dice cuántos ceros agregar (multiplicador). café 1 · negro 0 · rojo ×100 4. La última es la tolerancia: cuánto se puede 10 × 100 = 1.000 Ω = 1 kΩ equivocar (±5 %). k = kilo = 1.000. Por eso 10.000 Ω se escribe 10 café 1 · negro 0 · naranja ×1.000 kΩ y 4.700 Ω se escribe 4,7 kΩ. 10 × 1.000 = 10.000 Ω = 10 kΩ Truco: la 3ª banda dice cuántos ceros poner. Café = 1 cero,…',
      },
      {
        kicker: 'RESISTENCIAS',
        title: '¿Y si tiene 5 bandas? ¿Por dónde empiezo?',
        text: 'RESISTENCIAS ¿Y si tiene 5 bandas? ¿Por dónde empiezo? 07 Resistencia de 5 bandas (cuerpo azul) ➡️ La dirección 🚫 Nunca empieza así La banda de tolerancia (dorada, Una resistencia nunca empieza por plateada o café) está un poco más dorado o plateado. Si ves esos colores separada de las demás. Ponla a la a la izquierda, voltéala. 1ª toler. derecha y lee de izquierda a derecha. 2ª 3ª cifra mult. 2 · 2 · 0 × 1 = 220 Ω 📦 Las de tu kit 🔎 ¿Dudas? 220 Ω: para LEDs y el display. Si los colores se ven raros con la luz Con 5 bandas hay 3 cifras antes del 10 kΩ: para botones y sensores. del salón,…',
      },
      {
        kicker: 'RESISTENCIAS · RETO RÁPIDO',
        title: '¿Cuánto vale cada resistencia?',
        text: 'RESISTENCIAS · RETO RÁPIDO ¿Cuánto vale cada resistencia? 08 En parejas A ¿ ______ Ω ? Usen la tabla de colores y escriban el valor de cada una en su cuaderno. B ¿ ______ Ω ? ⏱ Tienen 3 minutos. ⭐ Bonus: busquen en su kit una resistencia de 220 Ω y otra de 10 kΩ. C ¿ ______ Ω ? D ¿ ______ Ω ?',
      },
      {
        kicker: 'RESISTENCIAS · RESPUESTAS',
        title: 'Respuestas del reto',
        text: 'RESISTENCIAS · RESPUESTAS Respuestas del reto 09 El error más común es olvidar el 4 · 7 · ×100 A multiplicador. Las dos primeras 4.700 Ω = 4,7 kΩ bandas son cifras; la tercera dice cuántos ceros agregar. 3 · 3 · ×10 En la D hay 5 bandas: tres cifras B 330 Ω (1, 0, 0) y luego el multiplicador naranja (× 1.000). 5 · 6 · ×1 C 56 Ω 1 · 0 · 0 · ×1.000 (5 bandas) D 100.000 Ω = 100 kΩ',
      },
      {
        kicker: 'MONITOR SERIE',
        title: 'El Monitor Serie: los ojos dentro del Arduino',
        text: 'MONITOR SERIE El Monitor Serie: los ojos dentro del Arduino 10 Monitor Serie 🔍 ¿Cómo lo abro? En el Arduino IDE, el ícono de la lupa arriba a la Potenciómetro: 512 derecha, o Ctrl + Shift + M. cable USB Potenciómetro: 618 ARDUINO ⚡ Regla de oro Potenciómetro: 734 Temperatura: 27 °C datos viajan al PC La velocidad elegida en el monitor (abajo a la 9600 baudios ▾ derecha) debe ser igual a la del código: Serial.begin(9600) . Si no, verás símbolos raros. 🔌 Usa los pines 0 y 1 Un sensor da números, pero el Arduino no tiene pantalla. El Monitor Serie muestra en el computador lo que el Arduino…',
      },
      {
        kicker: 'MONITOR SERIE',
        title: 'Tu primer mensaje',
        text: 'MONITOR SERIE Tu primer mensaje 11 HolaSerial.ino Monitor Serie 1 int contador = 0; // variable que vamos a mostrar ¡Hola! Soy tu Arduino 2 Contador: 0 3 void setup() { Contador: 1 4 Serial.begin(9600); // abre la comunicación Contador: 2 5 Serial.println("¡Hola! Soy tu Arduino"); Contador: 3 6 } Contador: 4 7 _ 8 void loop() { 9 Serial.print("Contador: "); // escribe SIN bajar de línea 10 Serial.println(contador); // escribe el número y SÍ baja Serial.print() escribe y se queda en la misma 11 contador = contador + 1; // suma 1 línea. 12 delay(1000); // espera 1 segundo 13 } Serial.println()…',
      },
      {
        kicker: 'MONITOR SERIE',
        title: 'El Serial Plotter: ver los datos como una gráfica',
        text: 'MONITOR SERIE El Serial Plotter: ver los datos como una gráfica 12 Serial Plotter Plotter.ino pot sonido 1 void setup() { 2 Serial.begin(9600); 3 } 4 5 void loop() { 6 int pot = analogRead(A0); 7 int sonido = analogRead(A1); 8 9 // formato "nombre:valor", separados por coma 10 Serial.print("pot:"); 11 Serial.print(pot); 12 Serial.print(","); 13 Serial.print("sonido:"); Ábrelo en Herramientas ▸ Serial Plotter o con Ctrl + Shift 14 Serial.println(sonido); // println al final + L. Usa el mismo código que el Monitor Serie, pero dibuja los 15 delay(50); números como una línea que se mueve. 16 }…',
      },
      {
        kicker: 'POTENCIÓMETRO',
        title: '¿Qué es un potenciómetro?',
        text: 'POTENCIÓMETRO ¿Qué es un potenciómetro? 13 B10K Es una resistencia que puedes cambiar girando una perilla. Para el Arduino es la forma más fácil de leer un valor analógico: girar = cambiar un número entre gira 0 y 1023. 🔊 Volumen de un parlante 🌀 Velocidad de un 🎮 Joystick de un control o radio ventilador (¡son 2 potenciómetros!) ¿Qué dice “B10K”? 10K = 10.000 Ω entre las dos patas de los extremos. B = lineal: si giras la mitad, cambia la mitad. 1 2 3 extremo CURSOR extremo Tiene 3 patas, y eso es lo que más confunde. En las siguientes diapositivas vemos por qué.',
      },
      {
        kicker: 'POTENCIÓMETRO',
        title: 'Por dentro: una pista y un cursor que se desliza',
        text: 'POTENCIÓMETRO Por dentro: una pista y un cursor que se desliza 14 1 · La pista Pista de carbón Cursor (escobilla) Es una tira de carbón en forma de herradura. Toda la pista mide 10 kΩ. Sus dos puntas están soldadas a las patas 1 y 3. 2 · El cursor Es una lámina de metal que toca la pista y se mueve cuando giras la perilla. Está conectado a la pata 2 (la del medio). Eje (la perilla) 3 · La idea clave Entre las patas 1 y 3 siempre hay 10 kΩ. Lo que cambia es dónde toca el cursor, y eso es lo que lee el Arduino por la pata del medio. pata 1 pata 2 pata 3',
      },
      {
        kicker: 'POTENCIÓMETRO',
        title: 'El divisor de voltaje: ¿qué voltaje toca el cursor?',
        text: 'POTENCIÓMETRO El divisor de voltaje: ¿qué voltaje toca el cursor? 15 cursor junto a GND cursor en la mitad cursor junto a 5V Conectamos un extremo a 5V y el otro a GND. Así la pista queda como una rampa de voltaje: 0 V en una punta y 5 V en la otra (fíjate en el color). El cursor “recoge” el voltaje del punto donde está tocando. Ese voltaje sale por la pata del medio hacia A0. Es como un tobogán: arriba hay 5 V, GND A0 5V GND A0 5V GND A0 5V abajo 0 V. El cursor es un niño que se 0V 2,5 V 5V detiene en cualquier punto del tobogán. analogRead = 0 analogRead = 512 analogRead = 1023',
      },
      {
        kicker: 'POTENCIÓMETRO',
        title: 'Cómo conectarlo: cada pata tiene su trabajo',
        text: 'POTENCIÓMETRO Cómo conectarlo: cada pata tiene su trabajo 16 ✅ La regla 🔄 ¿Extremos al revés? Los extremos van a 5V y a GND. No pasa nada malo: solo gira al revés (a La pata del medio va al pin analógico la derecha baja en vez de subir). Si quieres, (A0). intercambia los cables de los extremos. ⛔ Nunca el medio a 5V o GND 🔎 ¿Cuál es la del medio? Si conectas la pata del medio a 5V o a GND Siempre la del centro de las tres, la que y giras hasta el tope, haces un está sola entre las otras dos. Es la del cortocircuito: el potenciómetro se cursor. calienta y el Arduino se puede reiniciar. GND 5V…',
      },
      {
        kicker: 'POTENCIÓMETRO',
        title: 'Montaje: el potenciómetro en A0',
        text: 'POTENCIÓMETRO Montaje: el potenciómetro en A0 17 Conexiones + + riel + (rojo) de la − − 5V → protoboard 1 5 10 15 20 a riel − (azul) de la b GND → c B10K protoboard GND 13 12 ~11~10 ~9 8 7 ~6 ~5 4 ~3 2 1 0 d e pata izquierda Riel − → (columna 8) UNO ATmega328P f g pata del MEDIO A0 → h (columna 10) IOREF RESET GND i 3.3V 5V GND VIN A0 A1 A2 A3 A4 A5 j pata derecha (columna Riel + → 12) + + − − Recuerda: los 5 huecos de una columna están unidos. Cada pata del potenciómetro queda en su propia columna, y ahí conectamos su cable.',
      },
      {
        kicker: 'POTENCIÓMETRO',
        title: 'Código: leer el potenciómetro',
        text: 'POTENCIÓMETRO Código: leer el potenciómetro 18 LeerPotenciometro.ino Monitor Serie 1 const int PIN_POT = A0; // la pata del medio va a A0 Valor: 0 Voltaje: 0.00 V 2 Valor: 204 Voltaje: 1.00 V 3 void setup() { Valor: 512 Voltaje: 2.50 V 4 Serial.begin(9600); // para ver los números Valor: 860 Voltaje: 4.20 V Valor: 1023 Voltaje: 5.00 V 5 } 6 7 void loop() { Prueba: gira la perilla despacio y mira cómo cambian los 8 int valor = analogRead(PIN_POT); // de 0 a 1023 números. Luego ábrelo en el Serial Plotter. 9 float voltaje = valor * 5.0 / 1023.0; // pasar a voltios 10 11 Serial.print("Valor: ");…',
      },
      {
        kicker: 'PROGRAMACIÓN',
        title: 'map(): traducir de una escala a otra',
        text: 'PROGRAMACIÓN map(): traducir de una escala a otra 19 Lo que lee analogRead(): 0 a 1023 La receta map(valor, // de esta escala… 0 256 512 767 1023 0, 1023, // …a esta otra 0, 255); 0 63 127 191 255 Más ejemplos: map(valor, 0, 1023, 0, 100) → porcentaje map(valor, 0, 1023, 0, 9) → un número Lo que acepta analogWrite(): 0 a 255 para el display Es como pasar de centímetros a pulgadas: el mismo punto, contado en otra regla. Si el Ojo: map() trabaja con números enteros: corta potenciómetro está a la mitad (512), el LED queda a la mitad (127). los decimales.',
      },
      {
        kicker: 'POTENCIÓMETRO',
        title: 'Montaje: el potenciómetro controla un LED',
        text: 'POTENCIÓMETRO Montaje: el potenciómetro controla un LED 20 Conexiones + + pata izquierda del pot − − Riel − → (col. 3) 1 5 10 15 20 a pata del medio del pot b A0 → c B10K (col. 5) GND 13 12 ~11~10~9 8 7 ~6 ~5 4 ~3 2 1 0 d e pata derecha del pot Riel + → (col. 7) UNO ATmega328P f g resistencia de 220 Ω Pin ~9 → h (col. 12) IOREF RESET GND i 3.3V 5V GND VIN A0 A1 A2 A3 A4 A5 j de la col. 12 a la pata 220 Ω → larga del LED + + − − pata corta del LED (col. Riel − → 17) El LED va en el pin ~9 porque necesitamos PWM para los brillos intermedios (clase 2).',
      },
      {
        kicker: 'POTENCIÓMETRO',
        title: 'Código: la perilla controla el brillo',
        text: 'POTENCIÓMETRO Código: la perilla controla el brillo 21 PotLED.ino 1 · Leer 1 const int PIN_POT = A0; analogRead() nos da la posición de la perilla: 0 a 2 const int LED = 9; // pin con ~ (PWM) 1023. 3 4 void setup() { 5 pinMode(LED, OUTPUT); 6 Serial.begin(9600); 2 · Traducir 7 } map() convierte ese número a la escala del LED: 0 a 8 255. 9 void loop() { 10 int valor = analogRead(PIN_POT); // 0 a 1023 11 int brillo = map(valor, 0, 1023, 0, 255); // 0 a 255 12 analogWrite(LED, brillo); 3 · Actuar 13 analogWrite() enciende el LED con ese brillo. 14 Serial.print("Pot: "); 15 Serial.print(valor);…',
      },
      {
        kicker: 'PULSADOR',
        title: 'El pulsador por dentro: 4 patas, 2 pares',
        text: 'PULSADOR El pulsador por dentro: 4 patas, 2 pares 22 1 2 🔗 Las patas van en pares Las patas 1 y 3 están siempre unidas por dentro. Las patas 2 y 4 también. Por eso, aunque siempre unidas siempre unidas tenga 4 patas, el botón funciona como un interruptor de 2. 👇 Al presionar Se une el par de la izquierda con el de la derecha y la corriente puede pasar. 🧩 En la protoboard 3 4 al presionar se une el lado izquierdo con el derecho Ponlo “a caballo” sobre el canal del centro. Así cada par queda en su propia columna y no hay cortos. Si el botón “siempre está presionado”, seguramente lo pusiste…',
      },
      {
        kicker: 'PULSADOR',
        title: 'INPUT_PULLUP: el botón sin resistencia extra',
        text: 'PULSADOR INPUT_PULLUP: el botón sin resistencia extra 23 Botón ¿Qué pasa? digitalRead() Dentro del Arduino Suelto La resistencia interna lleva el pin a 5V HIGH (1) 5V Presionado El botón une el pin con GND LOW (0) ¡La lógica queda al revés! resistencia interna Presionado = LOW. Por eso en el código preguntamos botón if (estado == LOW) . pin 2 lee el pin 2 Conexión: una pata del botón al pin 2 y la otra a GND. Nada más. GND En la clase 1 usamos una resistencia de 10 kΩ (pull-down). El Arduino trae una resistencia interna que podemos activar con pinMode(2, INPUT_PULLUP) . ¡Un componente menos!',
      },
      {
        kicker: 'PULSADOR',
        title: 'Montaje: botón en el pin 2 y LED en el pin 8',
        text: 'PULSADOR Montaje: botón en el pin 2 y LED en el pin 8 24 Conexiones + + GND → riel − de la protoboard − − 1 5 10 15 20 a pata izquierda del Pin 2 → b botón (col. 4) c GND 13 12 ~11~10 ~9 8 7 ~6 ~5 4 ~3 2 1 0 d pata derecha del botón Riel − → e (col. 6) UNO ATmega328P f resistencia de 220 Ω Pin 8 → g (col. 11) h IOREF RESET GND 3.3V GND i de la col. 11 a la pata 5V VIN A0 A1 A2 A3 A4 A5 220 Ω → j larga del LED + + − − pata corta del LED (col. Riel − → 16) El botón va sobre el canal. Gracias a INPUT_PULLUP no necesita resistencia ni cable a 5V.',
      },
      {
        kicker: 'PULSADOR',
        title: 'Código: el botón enciende el LED',
        text: 'PULSADOR Código: el botón enciende el LED 25 BotonLED.ino Abre el Monitor Serie: verás una lluvia de 1. Presiona el botón y cambian a 0. 1 const int BOTON = 2; 💡 Reto mini 2 const int LED = 8; 3 4 void setup() { 5 pinMode(BOTON, INPUT_PULLUP); // resistencia interna Cambia el código para que el LED quede encendido 6 pinMode(LED, OUTPUT); cuando NO presionas y se apague al presionar. 7 Serial.begin(9600); ⭐ Reto plus: interruptor 8 } 9 10 void loop() { 11 int estado = digitalRead(BOTON); Que cada vez que presiones, el LED cambie de 12 Serial.println(estado); // 1 = suelto, 0 = presionado…',
      },
      {
        kicker: 'BUZZER',
        title: 'El buzzer: activo o pasivo',
        text: 'BUZZER El buzzer: activo o pasivo 26 ACTIVO (el tuyo) PASIVO Buzzer ACTIVO Buzzer PASIVO ¿Cómo suena? Siempre el mismo tono (un “biiip”) Puede hacer notas y melodías + ¿Cómo se controla? digitalWrite(pin, HIGH) tone(pin, frecuencia) Por debajo Sellado con resina negra Se ve la placa verde Prueba rápida Lo conectas a 5V y GND y suena solo Con 5V fijo solo hace “clic” corta − ➕ Tiene polaridad 🔇 La etiqueta larga + La pata larga (+) va al pin del Arduino Si trae un sticker encima, quítalo: está abajo: sellado (negro) abajo: se ve la placa verde y la corta (−) a GND. Busca el “+” ahí para la…',
      },
      {
        kicker: 'BUZZER',
        title: 'Montaje: buzzer activo en el pin 8',
        text: 'BUZZER Montaje: buzzer activo en el pin 8 27 Conexiones + + pata larga (+) del − − Pin 8 → buzzer (col. 9) 1 5 10 15 20 a b GND → riel − de la protoboard c GND 13 12 ~11~10 ~9 8 7 ~6 ~5 4 ~3 2 1 0 d pata corta (−) del + Riel − → e buzzer (col. 11) UNO ATmega328P f Este buzzer consume poca corriente (unos 30 g h mA), así que lo conectamos directo al pin, sin resistencia. IOREF RESET GND i 3.3V 5V GND VIN A0 A1 A2 A3 A4 A5 j + + − − Si quedó al revés, no suena, pero tampoco se daña. Gíralo y prueba otra vez.',
      },
      {
        kicker: 'BUZZER',
        title: 'Código: pitidos con el buzzer activo',
        text: 'BUZZER Código: pitidos con el buzzer activo 28 Buzzer.ino SiFueraPasivo.ino 1 const int BUZZER = 8; 1 // Solo si tu buzzer fuera PASIVO: 2 2 tone(8, 440); // nota LA (440 Hz) 3 void setup() { 3 delay(500); 4 pinMode(BUZZER, OUTPUT); 4 noTone(8); // apagar el sonido 5 delay(500); 5 } 6 7 void loop() { Con el activo, el ritmo lo hacemos con delay(): cuánto suena 8 // tres pitidos cortos y cuánto calla. Así se pueden hacer alarmas, avisos y hasta 9 for (int i = 0; i < 3; i++) { código Morse. 10 digitalWrite(BUZZER, HIGH); // suena 11 delay(100); 12 digitalWrite(BUZZER, LOW); // silencio 13…',
      },
      {
        kicker: 'SENSORES',
        title: 'Antes de empezar: cómo leer los pines de un módulo',
        text: 'SENSORES Antes de empezar: cómo leer los pines de un módulo 29 Si dice… Significa Va a… LEDs indicadores VCC · + · 5V Alimentación 5V (riel +) GND · G · − Tierra GND (riel −) DO · OUT · S Salida digital: SÍ o NO Un pin digital (2 a 13) tornillo: sensibilidad MÓDULO SENSOR AO · A0 · S Salida analógica: CUÁNTO Un pin analógico (A0 a A5) VCC GND DO AO ⚠️ VCC y GND al revés 🔧 El tornillo azul Es el error que más daña sensores. Ajusta cuándo se activa la salida Revisa dos veces antes de conectar digital (DO). No cambia la analógica El orden de los pines cambia según el fabricante. el USB. (AO).…',
      },
      {
        kicker: 'SENSOR IR',
        title: 'Sensor infrarrojo de obstáculos',
        text: 'SENSOR IR Sensor infrarrojo de obstáculos 30 emisor (LED IR) ¿Cómo funciona? El LED transparente lanza luz infrarroja. Si hay un objeto cerca, la luz luz infrarroja rebota y llega al receptor negro. Entonces el módulo avisa por el pin VCC OUT. GND OUT rebota ¡La salida es al revés! tu mano Hay obstáculo → OUT = LOW (0). receptor distancia LED “detectó” No hay nada → OUT = HIGH (1). 📱 Truco: la luz infrarroja es invisible para nosotros, pero muchas cámaras de celular sí la ven. Apunta la cámara al LED transparente y Alcance y límites verás un brillo morado. De 2 a 30 cm, según el tornillo…',
      },
      {
        kicker: 'SENSOR IR',
        title: 'Montaje: sensor IR en el pin 2',
        text: 'SENSOR IR Montaje: sensor IR en el pin 2 31 Conexiones + + 5V → riel + de la protoboard − − 1 5 10 15 20 a GND → riel − de la protoboard b IR c Riel + → VCC del sensor (col. 9) GND 13 12 ~11~10 ~9 8 7 ~6 ~5 4 ~3 2 1 0 d VCC GND OUT e GND del sensor (col. Riel − → 10) UNO ATmega328P f g OUT del sensor (col. h Pin 2 → 11) IOREF RESET GND i 3.3V 5V GND VIN A0 A1 A2 A3 A4 A5 j + + Como aviso usamos el LED “L” que trae la − − placa, conectado internamente al pin 13. ¡No hay que cablear nada más!',
      },
      {
        kicker: 'SENSOR IR',
        title: 'Código: detectar un obstáculo',
        text: 'SENSOR IR Código: detectar un obstáculo 32 SensorIR.ino Para calibrar: pon tu mano a la distancia que quieres detectar y gira el tornillo azul hasta que el LED verde 1 const int PIN_IR = 2; del módulo apenas se encienda. 2 const int LED = 13; // LED "L" de la placa 🧪 Experimenta 3 4 void setup() { 5 pinMode(PIN_IR, INPUT); 6 pinMode(LED, OUTPUT); Prueba con una hoja blanca y con una negra. ¿A qué 7 Serial.begin(9600); distancia detecta cada una? ¿Por qué crees que pasa 8 } eso? 9 10 void loop() { 11 int estado = digitalRead(PIN_IR); Si el LED queda siempre encendido, el sensor está 12…',
      },
      {
        kicker: 'SENSOR DE SONIDO',
        title: 'Sensor de sonido: un micrófono que mide el ruido',
        text: 'SENSOR DE SONIDO Sensor de sonido: un micrófono que mide el ruido 33 LED “escuchó” ¿Qué mide? AO Qué tan fuerte es el sonido. No entiende palabras ni notas: solo “silencio” o G “¡ruido!”. + DO AO: salida analógica Da un número con analogRead(). En silencio se queda casi quieto; con un ruido fuerte salta hacia arriba y hacia abajo (mira la gráfica). micrófono umbral (sensibilidad) umbral DO: salida digital Se pone en HIGH cuando el ruido pasa el umbral que eliges con el tornillo azul. Ideal para detectar aplausos. silencio ¡aplauso! Calibra en silencio: gira el tornillo hasta que el LED…',
      },
      {
        kicker: 'SENSOR DE SONIDO',
        title: 'Montaje: sensor de sonido en A0 y en el pin 2',
        text: 'SENSOR DE SONIDO Montaje: sensor de sonido en A0 y en el pin 2 34 Conexiones + + A0 → AO del sensor (col. 8) − − 1 5 10 15 20 a Riel − → G del sensor (col. 9) b SONIDO c Riel + → + del sensor (col. 10) GND 13 12 ~11~10 ~9 8 7 ~6 ~5 4 ~3 2 1 0 d e AO G + DO Pin 2 → DO del sensor (col. 11) UNO ATmega328P f 5V / GND → a los rieles + y − g h IOREF RESET GND i 3.3V 5V GND VIN A0 A1 A2 A3 A4 A5 Usamos las dos salidas: AO para ver la onda j en el Serial Plotter y DO para detectar el + + aplauso. − −',
      },
      {
        kicker: 'SENSOR DE SONIDO',
        title: 'Código: el Arduino escucha un aplauso',
        text: 'SENSOR DE SONIDO Código: el Arduino escucha un aplauso 35 SensorSonido.ino Abre el Serial Plotter (Ctrl + Shift + L), habla cerca del micrófono y luego aplaude. ¿Ves la diferencia? 1 const int PIN_AO = A0; // salida analógica 2 const int PIN_DO = 2; // salida digital 3 const int LED = 13; // LED "L" de la placa ¿El LED se queda prendido siempre? Hay dos 4 opciones: el umbral está muy bajo (gira el tornillo) o tu 5 void setup() { módulo funciona al revés (cambia HIGH por LOW en el 6 pinMode(PIN_DO, INPUT); if). 7 pinMode(LED, OUTPUT); 🧪 Experimenta 8 Serial.begin(9600); 9 } 10 11 void loop() {…',
      },
      {
        kicker: 'HUMEDAD DE TIERRA',
        title: 'Sensor de humedad de tierra: ¿mi planta tiene sed?',
        text: 'HUMEDAD DE TIERRA Sensor de humedad de tierra: ¿mi planta tiene sed? 36 ¿Cómo funciona? El agua conduce la electricidad. Las dos patas se clavan en la tierra: si está húmeda, la corriente pasa fácil entre ellas; si está seca, le cuesta. Los números van al revés VCC GND DO AO Seca → número alto (cerca de 1000). Mojada → número bajo (300 a 500). sonda: dos patas Cada sensor es distinto: hay que calibrarlo. ⚠️ Se oxida Si le damos energía todo el tiempo, las patas se corroen en pocos días. Truco: lo alimentamos desde un pin digital y solo lo encendemos al medir.',
      },
      {
        kicker: 'HUMEDAD DE TIERRA',
        title: 'Montaje: sensor de humedad en A0, alimentado por el pin 7',
        text: 'HUMEDAD DE TIERRA Montaje: sensor de humedad en A0, alimentado por el pin 7 37 Conexiones + + Pin 7 → VCC del módulo (col. 8) − − 1 5 10 sonda (va en la 20 15 tierra) a GND del módulo (col. Riel − → b 9) c HUMEDAD GND 13 12 ~11~10 ~9 8 7 ~6 ~5 4 ~3 2 1 0 d A0 → AO del módulo (col. 11) VCC GND e DO AO GND → riel − de la protoboard UNO ATmega328P f g h ¿Por qué VCC va al pin 7 y no a 5V? Así el IOREF RESET GND i Arduino enciende el sensor solo cuando va a 3.3V 5V GND VIN A0 A1 A2 A3 A4 A5 j medir, y las patas duran mucho más. El pin DO + + no lo usamos. − −',
      },
      {
        kicker: 'HUMEDAD DE TIERRA',
        title: 'Código: medir la humedad en porcentaje',
        text: 'HUMEDAD DE TIERRA Código: medir la humedad en porcentaje 38 HumedadTierra.ino 📏 Cómo calibrar 1 const int PIN_SENSOR = A0; 1. Sonda al aire (seca): anota el valor del monitor → 2 const int PIN_ENERGIA = 7; // alimenta el sensor SECO. 3 const int SECO = 1000; // valor en el aire (calibrar) 2. Sonda en un vaso con agua (sin mojar el módulo): 4 const int MOJADO = 400; // valor en agua (calibrar) anota el valor → MOJADO. 5 3. Escribe esos dos números en el código y súbelo otra 6 void setup() { 7 pinMode(PIN_ENERGIA, OUTPUT); vez. 8 digitalWrite(PIN_ENERGIA, LOW); 9 Serial.begin(9600); 10 }…',
      },
      {
        kicker: 'NIVEL DE AGUA',
        title: 'Sensor de nivel de agua',
        text: 'NIVEL DE AGUA Sensor de nivel de agua 39 pistas de cobre ¿Cómo funciona? Tiene pistas de cobre intercaladas, como los dientes de dos peinillas. El agua las va uniendo: mientras más hundido esté el sensor, más pistas se conectan y más alto es el número. agua Los números Seco → 0 (o casi). Medio hundido → unos 400. Bien hundido → 500 a 700, según el sensor y el agua. ⚠️ Cuidado S + − Solo se mojan las pistas, nunca los pines ni la parte de arriba. Igual que el de tierra, se oxida: lo alimentamos desde un pin digital. Usos: alarma de inundación, avisar cuando la pecera o el tanque se están…',
      },
      {
        kicker: 'NIVEL DE AGUA',
        title: 'Montaje: sensor de nivel en A0, alimentado por el pin 7',
        text: 'NIVEL DE AGUA Montaje: sensor de nivel en A0, alimentado por el pin 7 40 Conexiones + NIVEL + A0 → S del sensor (col. 10) − − 1 5 10 15 20 a Pin 7 → + del sensor (col. 11) b c Riel − → − del sensor (col. 12) GND 13 12 ~11~10 ~9 8 7 ~6 ~5 4 ~3 2 1 0 d e S + − GND → riel − de la protoboard UNO ATmega328P f g Para probarlo, usa un vaso con agua y hunde el h sensor poco a poco, sin mojar los pines. IOREF RESET GND i 3.3V 5V GND VIN A0 A1 A2 A3 A4 A5 j + + − −',
      },
      {
        kicker: 'NIVEL DE AGUA',
        title: 'Código: ¿cuánta agua hay?',
        text: 'NIVEL DE AGUA Código: ¿cuánta agua hay? 41 NivelAgua.ino Es la misma receta que el sensor de tierra: encender → esperar un poquito → leer → apagar. 1 const int PIN_SENSOR = A0; 🧪 Experimenta 2 const int PIN_ENERGIA = 7; 3 const int ALERTA = 400; // ajústalo a tu sensor 4 5 void setup() { Hunde el sensor en 3 niveles (poco, medio y casi todo) y 6 pinMode(PIN_ENERGIA, OUTPUT); anota los valores. Con eso decide tu número de 7 digitalWrite(PIN_ENERGIA, LOW); ALERTA. 8 Serial.begin(9600); 9 } 10 ¿Y si en vez de agua del grifo usas agua con sal? Pruébalo: 11 void loop() { la sal hace que el agua…',
      },
      {
        kicker: 'DHT11',
        title: 'DHT11: temperatura y humedad del aire',
        text: 'DHT11 DHT11: temperatura y humedad del aire 42 rejilla: entra el aire 🌡️ Temperatura 💧 Humedad del aire De 0 a 50 °C. De 20 a 90 %. Precisión: ± 2 °C. Precisión: ± 5 %. Un sensor “que habla” DHT11 Tiene un chip propio: mide y le envía al Arduino un mensaje digital con los dos chip interno números por un solo cable (pin S). Por eso no usamos analogRead(), sino una librería que entiende ese mensaje. S + − Es lento: solo da una lectura nueva cada 1 a 2 segundos. Si le preguntas más rápido, te repite el dato viejo o da error. El orden de los pines cambia según el módulo (“S + −” o “+ OUT −”). Lee…',
      },
      {
        kicker: 'DHT11',
        title: 'Antes de programar: instalar la librería del DHT',
        text: 'DHT11 Antes de programar: instalar la librería del DHT 43 Abre el gestor 1 GESTOR DE BIBLIOTECAS En el Arduino IDE, haz clic en el ícono de libros de la barra izquierda (o Ctrl + Shift + I). Busca 🔍 DHT sensor library 2 Escribe DHT sensor library. DHT sensor library Instala 3 por Adafruit Elige la de Adafruit y presiona INSTALAR. INSTALAR Acepta lo que necesita 4 Cuando pregunte por Adafruit Unified Sensor, elige INSTALAR TODO. ¿Instalar también Adafruit Unified Sensor? → INSTALAR TODO ¿Qué es una librería? Código que otra persona ya escribió y comparte para que nosotros lo usemos. Se instala…',
      },
      {
        kicker: 'DHT11',
        title: 'Montaje: DHT11 en el pin 2',
        text: 'DHT11 Montaje: DHT11 en el pin 2 44 Conexiones + + S (datos) del sensor − − Pin 2 → (col. 9) 1 5 10 15 20 a b DHT11 Riel + → + del sensor (col. 10) c GND 13 12 ~11~10 ~9 8 7 ~6 ~5 4 ~3 2 1 0 d Riel − → − del sensor (col. 11) e S + − 5V / GND → a los rieles + y − UNO ATmega328P f g h El módulo ya trae la resistencia que necesita el IOREF RESET GND i DHT11. Si tu sensor fuera la versión suelta de 3.3V 5V GND VIN A0 A1 A2 A3 A4 A5 j 4 patas, habría que agregar una de 10 kΩ. + + − −',
      },
      {
        kicker: 'DHT11',
        title: 'Código: tu propia estación del clima',
        text: 'DHT11 Código: tu propia estación del clima 45 EstacionClima.ino Monitor Serie 1 #include <DHT.h> // la librería que instalamos Temperatura: 28.00 °C Humedad: 71.00 % 2 Temperatura: 28.00 °C Humedad: 72.00 % 3 const int PIN_DHT = 2; Temperatura: 29.00 °C Humedad: 76.00 % 4 DHT dht(PIN_DHT, DHT11); // creamos el sensor 5 6 void setup() { isnan() pregunta “¿no es un número?”. Si el sensor falló, 7 Serial.begin(9600); mostramos un aviso en lugar de números raros. 8 dht.begin(); // lo encendemos 🧪 Experimenta: sopla suavemente sobre el sensor. ¿Qué 9 } 10 11 void loop() { sube más rápido, la…',
      },
      {
        kicker: 'DISPLAY',
        title: 'El display de 7 segmentos: 8 LEDs en uno',
        text: 'DISPLAY El display de 7 segmentos: 8 LEDs en uno 46 g f COM a b pines de arriba ¿Qué es? a Son 8 LEDs con forma de rayita: 7 segmentos (de la a a la g) y un punto (dp). Encendiendo algunos y otros no, formamos los números del 0 al 9. Por eso lo llamamos “de 8 segmentos” o “de 7 segmentos con punto”. f b g Sus 10 pines e c 8 pines, uno para cada segmento, y 2 pines COM (común) en el medio, que están unidos por dentro. Basta con conectar uno de ellos. d dp pines de abajo Cada segmento es un LED e d COM c dp Por eso necesita resistencia. Lo ideal es una de 220 Ω por segmento. Para simplificar,…',
      },
      {
        kicker: 'DISPLAY',
        title: '¿Cátodo común o ánodo común? Descúbrelo',
        text: 'DISPLAY ¿Cátodo común o ánodo común? Descúbrelo 47 a b c d a b c d 🔬 La prueba de los 30 segundos 1 Conecta un pin COM (el del medio) a GND. 2 Con una resistencia de 220 Ω, lleva 5V a cualquier otra pata. COM → GND COM → 5V 3 ¿Se encendió un segmento? → Tu display es de cátodo común. Cátodo común Ánodo común 4 ¿No encendió? Al revés: COM a 5V y la resistencia a GND. Si segmento se enciende con HIGH segmento se enciende con LOW ahora enciende → ánodo común. En el código hay una línea para eso: const bool ANODO_COMUN = false; Así también descubres qué pata enciende qué segmento, por si tu…',
      },
      {
        kicker: 'DISPLAY',
        title: 'La tabla secreta: qué segmentos forman cada número',
        text: 'DISPLAY La tabla secreta: qué segmentos forman cada número 48 Número a b c d e f g 0 1 1 1 1 1 1 0 1 0 1 1 0 0 0 0 0 1 2 3 4 5 6 7 8 9 2 1 1 0 1 1 0 1 3 1 1 1 1 0 0 1 Para mostrar un 2 encendemos a, b, d, e y g. Esa lista de 1 y 0 la guardamos en el código 4 0 1 1 0 0 1 1 como una tabla (un arreglo): una fila por cada número. 5 1 0 1 1 0 1 1 6 1 0 1 1 1 1 1 Reto relámpago: sin mirar la tabla, ¿qué segmentos necesitas para la letra A? ¿Y para la 7 1 1 1 0 0 0 0 H? 8 1 1 1 1 1 1 1 9 1 1 1 1 0 1 1',
      },
      {
        kicker: 'DISPLAY',
        title: 'Montaje: display en los pines 2 a 9',
        text: 'DISPLAY Montaje: display en los pines 2 a 9 49 Conexiones (pin → segmento) Pin 2 → a → col. 12, arriba Pin 3 → b → col. 13, arriba + + Pin 4 → c → col. 12, abajo − − 1 5 10 15 20 a Pin 5 → d → col. 10, abajo b c GND 13 12 ~11~10~9 8 7 ~6~5 4 ~3 2 1 0 Pin 6 → e → col. 9, abajo d g f C a b e Pin 7 → f → col. 10, arriba UNO ATmega328P f g Pin 8 → g → col. 9, arriba e d C c . h IOREF RESET GND 3.3V GND i Pin 9 → dp → col. 13, abajo 5V VIN A0 A1 A2 A3 A4 A5 j + + 220 Ω al riel − (o a + si COM (col. 11) → es ánodo) − −',
      },
      {
        kicker: 'DISPLAY',
        title: 'Código: contar del 0 al 9',
        text: 'DISPLAY Código: contar del 0 al 9 50 Display7Seg.ino 📋 Arreglos (tablas) 1 // pines de los segmentos: a b c d e f g SEGMENTOS[7] guarda 7 números en una sola variable. 2 const int SEGMENTOS[7] = { 2, 3, 4, 5, 6, 7, 8 }; SEGMENTOS[0] es el primero (el 2), SEGMENTOS[1] el 3 const bool ANODO_COMUN = false; // true si es ánodo común 4 const int NUMEROS[10][7] = { // 1 = encendido, 0 = apagado segundo… ¡Se cuenta desde 0! 5 {1,1,1,1,1,1,0}, {0,1,1,0,0,0,0}, // 0 y 1 🧩 Nuestra función 6 {1,1,0,1,1,0,1}, {1,1,1,1,0,0,1}, // 2 y 3 7 {0,1,1,0,0,1,1}, {1,0,1,1,0,1,1}, // 4 y 5 8 {1,0,1,1,1,1,1},…',
      },
      {
        kicker: 'RESUMEN',
        title: 'La chuleta de la clase',
        text: 'RESUMEN La chuleta de la clase 51 Componente Tipo Pin Cómo se usa Para recordar Potenciómetro Analógica A0–A5 analogRead() 0 a 1023 Pulsador Digital 2–13 digitalRead() + INPUT_PULLUP LOW = presionado Buzzer activo Salida 2–13 digitalWrite() HIGH = suena Display 7 seg. Salida 2–9 digitalWrite() × 7 tabla de números Sensor IR Digital 2–13 digitalRead() LOW = obstáculo Sonido Analógica + digital A0 y 2–13 analogRead() / digitalRead() DO = HIGH con ruido Humedad de tierra Analógica A0–A5 analogRead() seca = número alto Nivel de agua Analógica A0–A5 analogRead() más agua = número alto DHT11…',
      },
      {
        kicker: 'RETOS',
        title: 'Retos nivel 1: para calentar',
        text: 'RETOS Retos nivel 1: para calentar 52 1. El timbre 🟢 Nivel 1 2. Parpadeo a tu gusto 🟢 Nivel 1 Mientras presionas el botón, el buzzer suena. Cuando lo sueltas, El potenciómetro controla qué tan rápido parpadea un LED. silencio. Perilla a un lado: lento; al otro: rapidísimo. Pulsador Buzzer Potenciómetro LED 💡 Pista: usa el código del botón y cambia el LED por el buzzer. 💡 Pista:. puedes usar el valor del potenciómetro directo dentro del delay() 3. Medidor de giro 🟢 Nivel 1 4. Alarma de cercanía 🟢 Nivel 1 Muestra en el Monitor Serie cuánto está girado el potenciómetro Cuando algo se acerca al…',
      },
      {
        kicker: 'RETOS',
        title: 'Retos nivel 2: combinar',
        text: 'RETOS Retos nivel 2: combinar 53 5. Sensor de reversa 🟡 Nivel 2 6. El semáforo de la planta 🟡 Nivel 2 Como en los carros: el potenciómetro simula la distancia. Mientras Tres LEDs muestran la humedad de la tierra: verde (más de 60 más lo giras, el buzzer pita más rápido. Al tope, suena seguido. %), amarillo (30 a 60 %) y rojo (menos de 30 %). Potenciómetro Buzzer Humedad de tierra 3 LEDs 💡 Pista: pausa = map(valor, 0, 1023, 1000, 50) y úsala en los delay. 💡 Pista: usa if , else if y else . 7. Contador de 0 a 9 🟡 Nivel 2 8. Lámpara por aplauso 🟡 Nivel 2 Cada vez que presionas el botón, el…',
      },
      {
        kicker: 'RETOS',
        title: 'Retos nivel 3: proyectos',
        text: 'RETOS Retos nivel 3: proyectos 54 9. Alarma de inundación 🔴 Nivel 3 10. Termómetro con display 🔴 Nivel 3 Si el nivel de agua pasa tu número de alerta: el buzzer suena a Muestra la temperatura del DHT11 en el display, un dígito a la ratos, un LED rojo parpadea y el Monitor Serie avisa. Si baja, todo vez: primero las decenas y luego las unidades (2… 7…), con una se apaga. pausa entre cada lectura. Nivel de agua Buzzer LED DHT11 Display 💡 Pista: primero mide cuánto marca tu sensor en un vaso, luego decide la alerta. 💡 Pista: ). int temp decenas = temp / 10; y unidades = temp % 10; (con 11. Dado…',
      },
      {
        kicker: 'CONSEJOS',
        title: 'Errores comunes con sensores (y cómo salir de ellos)',
        text: 'CONSEJOS Errores comunes con sensores (y cómo salir de ellos) 55 ! El valor siempre es 0 o 1023 ! Los números saltan solos El cable de señal está suelto o en otro pin. Revisa que esté en Pin “flotando”: falta un GND compartido, o el botón no tiene A0 y no en el pin digital 0. INPUT_PULLUP . ! El monitor muestra símbolos raros ! El monitor está vacío La velocidad del monitor no es igual a Serial.begin(9600) . ¿Olvidaste Serial.begin(9600) en el setup()? ¿Elegiste el puerto correcto? ! El sensor se calienta ! El DHT11 da “Error” ¡Desconecta el USB ya! Seguramente VCC y GND están al Revisa el…',
      },
      {
        kicker: 'CIERRE · CLASE 3',
        title: 'Hoy el Arduino aprendió a escuchar',
        text: 'CIERRE · CLASE 3 Hoy el Arduino aprendió a 📝 Para la próxima clase escuchar Cada pareja elige un reto de nivel 2 o 3 y lo trae funcionando. ✅ Leemos resistencias por sus colores Prepárense para explicar en 1 minuto: ¿qué ✅ Vemos lo que piensa el Arduino con el Monitor Serie hace?, ¿qué sensor usaron? y ¿qué fue lo más difícil? ✅ Entendemos el potenciómetro por dentro ✅ Usamos botón, buzzer, display y 5 sensores Pregunta para pensar: si combinamos el sensor de humedad, una bomba de agua y el Arduino… ¿qué podríamos construir?',
      },
    ],
  },
  {
    slug: 'clase-3-leer-y-decidir',
    lesson: 'Clase 3',
    title: 'Leer y decidir: la receta para cualquier sensor',
    summary:
      'Monitor Serie → conectar → leer y observar → decidir con if. Se practica con la alarma de inundación.',
    pdf: '/clases/clase-3-leer-y-decidir.pdf',
    slides: [
      {
        kicker: 'LEER Y DECIDIR',
        title: 'La receta para trabajar con cualquier sensor',
        text: 'LEER Y DECIDIR La receta para trabajar con cualquier sensor 01 🖥️ 1 🔌 2 👀 3 🔀 4 Abrir el Monitor Serie Conectar el sensor Leer y observar Decidir con if Para ver lo que mide el sensor. VCC, GND y la señal a un pin. Mirar qué números da en cada Si el número es tal, entonces situación. hago algo. Hoy lo practicamos con una alarma de inundación: el sensor de nivel de agua decide qué LED se enciende. Sin el paso 3 no sabemos qué números poner en el if. ¡Primero se observa, después se decide!',
      },
      {
        kicker: 'PASO 1',
        title: 'El Monitor Serie: la pantalla del Arduino',
        text: 'PASO 1 El Monitor Serie: la pantalla del Arduino 02 Serial.ino Serial.begin(9600) 1 void setup() { Va en el setup(). Abre la conversación entre el Arduino y el 2 Serial.begin(9600); // 1) abrir computador por el cable USB. 3 } 4 5 void loop() { Serial.print() / println() 6 Serial.print("Nivel: "); // 2) texto 7 Serial.println(345); // 3) número Escriben en la pantalla. println además baja a la siguiente 8 delay(500); línea. 9 } Monitor Serie · 9600 baudios ¿Cómo lo abro? Ícono de la lupa (arriba a la derecha) o Ctrl + Shift + M. Nivel: 345 Abajo elige 9600 baudios, igual que en el código.…',
      },
      {
        kicker: 'PASO 2',
        title: 'Conectar: sensor de nivel de agua + 3 LEDs',
        text: 'PASO 2 Conectar: sensor de nivel de agua + 3 LEDs 03 Conexiones + NIVEL + 5V → riel + de la protoboard − − 1 5 10 15 20 a GND → riel − de la protoboard b c A0 → S del sensor (col. 2) GND 13 12 ~11~10~9 8 7 ~6 ~5 4 ~3 2 1 0 d e S + − Riel + → + del sensor (col. 3) UNO ATmega328P f Riel − → − del sensor (col. 4) g h Pin 8 → 220 Ω → LED verde IOREF RESET GND i 3.3V 5V GND VIN A0 A1 A2 A3 A4 A5 j Pin 9 → 220 Ω → LED amarillo + + − − Pin 10 → 220 Ω → LED rojo Riel − → pata corta de cada LED',
      },
      {
        kicker: 'PASO 3',
        title: 'Leer y observar: ¿qué números da el sensor?',
        text: 'PASO 3 Leer y observar: ¿qué números da el sensor? 04 LeerNivel.ino Prueba Lo que vimos (ejemplo) Sensor seco, al aire 0 a 20 1 const int PIN_AGUA = A0; Hundido un poquito unos 250 2 3 void setup() { Hundido casi todo unos 550 4 Serial.begin(9600); Lo que lee analogRead(A0) 5 } 6 seco poca agua mucha agua 7 void loop() { 8 int nivel = analogRead(PIN_AGUA); // 0 a 1023 0 100 400 1023 9 Serial.print("Nivel: "); nuestros 2 límites: 100 y 400 10 Serial.println(nivel); 11 delay(500); Cada sensor es distinto: hagan la prueba con un vaso de agua y anoten 12 } SUS números. Con eso eligen los límites.',
      },
      {
        kicker: 'PASO 4',
        title: 'Decidir: if, else if y else',
        text: 'PASO 4 Decidir: if, else if y else 05 ☔ Así decidimos las personas Estructura del if SI está lloviendo → llevo paraguas. 1 if (nivel > 400) { SI NO, SI hace mucho sol → llevo gorra. 2 // camino 1: mucha agua 3 } SI NO → no llevo nada. 4 else if (nivel > 100) { 5 // camino 2: poca agua 6 } El Arduino revisa las preguntas en orden, de arriba hacia 7 else { abajo. Apenas una es verdadera, hace lo que está entre sus 8 // camino 3: seco llaves { } y se salta todas las demás. 9 // (cuando nada de lo anterior se cumplió) 10 } Símbolo Significa Símbolo Significa > mayor que < menor que Ojo: para…',
      },
      {
        kicker: 'DIAGRAMA DE FLUJO',
        title: 'Los caminos que puede tomar el programa',
        text: 'DIAGRAMA DE FLUJO Los caminos que puede tomar el programa 06 setup() Leer el sensor Mostrar en el Apagar los Inicio Serial.begin · pinMode nivel = analogRead(A0) Monitor Serie 3 LEDs No No ¿nivel > 100? ¿nivel > 400? loop(): se repite para siempre Sí Sí LED verde LED amarillo LED rojo «Todo seco» «¡Cuidado, hay agua!» «¡Inundación!» Esperar 500 ms camino 1 (if) camino 2 (else if) camino 3 (else) En cada vuelta del loop, el programa toma SOLO UNO de los 3 caminos.',
      },
      {
        kicker: 'EL CÓDIGO',
        title: 'Alarma de inundación: el programa completo',
        text: 'EL CÓDIGO Alarma de inundación: el programa completo 07 AlarmaInundacion.ino Leer → mostrar → decidir 1 const int PIN_AGUA = A0; Las líneas 12 a 14 leen y muestran (pasos 3 y 1). Las líneas 19 2 const int LED_VERDE = 8, LED_AMARILLO = 9, LED_ROJO = 10; a 28 deciden (paso 4). 3 4 void setup() { 5 Serial.begin(9600); 6 pinMode(LED_VERDE, OUTPUT); Camino 1 · líneas 19 a 21 7 pinMode(LED_AMARILLO, OUTPUT); 8 pinMode(LED_ROJO, OUTPUT); Si hay más de 400 → LED rojo. 9 } 10 11 12 void loop() { int nivel = analogRead(PIN_AGUA); // LEER Camino 2 · líneas 22 a 24 13 Serial.print("Nivel: "); // MOSTRAR…',
      },
      {
        kicker: 'CUIDADO',
        title: '¿Por qué el orden de las preguntas importa?',
        text: 'CUIDADO ¿Por qué el orden de las preguntas importa? 08 ✗ Orden equivocado ✓ Orden correcto 1 if (nivel > 100) { 1 if (nivel > 400) { 2 // LED amarillo 2 // LED rojo 3 } else if (nivel > 400) { 3 } else if (nivel > 100) { 4 // LED rojo <- ¡nunca llega aquí! 4 // LED amarillo 5 } 5 } Con nivel = 550: la primera pregunta (¿550 > 100?) ya es Con nivel = 550: ¿550 > 400? Sí → rojo. ✅ verdadera, así que enciende el amarillo y se salta el resto. ¡La Con nivel = 250: ¿250 > 400? No. ¿250 > 100? Sí → amarillo. ✅ alarma roja nunca se enciende! Regla: pregunta primero por el caso más extremo (el número…',
      },
      {
        kicker: 'RETO',
        title: 'El semáforo del ruido del salón',
        text: '🔊 El semáforo del ruido del salón RETO 09 La misión Los pasos Cambia el sensor de agua por el sensor de sonido y 1. Dibuja el diagrama de flujo en tu cuaderno: ¿cuáles son los 3 construye un semáforo que vigile el ruido del salón: caminos? 🟢 Silencio → LED verde. 2. Conecta y usa la función medirRuido() (siguiente diapositiva) 🟡 Están hablando → LED amarillo. para ver los números en el Monitor Serie. 🔴 ¡Demasiado ruido! → LED rojo + un pitido del buzzer. 3. Observa y anota: ¿qué número da en silencio? ¿Hablando normal? ¿Con un aplauso? 4. Elige tus 2 límites y escribe el if / else if / else.…',
      },
      {
        kicker: 'RETO · AYUDA',
        title: 'Te regalamos esta función: medirRuido()',
        text: 'RETO · AYUDA Te regalamos esta función: medirRuido() 10 máximo − mínimo = ruido medirRuido() 1 // Escucha durante 50 milisegundos y devuelve 2 // qué tan fuerte fue el sonido 3 int medirRuido() { 4 int minimo = 1023; silencio: sube y baja poquito aplauso: sube y baja mucho 5 int maximo = 0; 6 unsigned long inicio = millis(); 7 El sonido es una onda: el número sube y baja muy rápido. Un solo 8 while (millis() - inicio < 50) { analogRead() no dice si hay ruido. Esta función mide cuánto sube 9 int valor = analogRead(A0); y baja la onda. 10 if (valor > maximo) maximo = valor; 11 if (valor <…',
      },
    ],
  },
  {
    slug: 'clase-4-depurar',
    lesson: 'Clase 4',
    title: 'Depurar: encontrar y corregir errores',
    summary:
      'El método de 5 pasos, la lista de chequeo del circuito, Wokwi y los 15 casos de errores.',
    pdf: '/clases/clase-4-depurar.pdf',
    slides: [
      {
        kicker: 'CLASE 4',
        title: 'Depurar: encontrar y corregir errores',
        text: 'CLASE 4 Depurar: encontrar y corregir errores 01 9 de septiembre de 1947 · 15:45 Los errores son normales Todo programador y todo ingeniero comete errores todos los días. Lo que distingue a uno bueno no es que no se equivoque, sino que sabe encontrar el error rápido. “First actual case of bug being found” (“Primer caso real de un bicho encontrado”) 🔌 Circuito ⛔ No compila 🤔 Lógica Un cable, una pata o un El IDE no entiende lo que Compila, pero no hace lo componente mal puesto. escribimos. que queremos. En 1947, el equipo del computador Harvard Mark II encontró una polilla atrapada en un relé.…',
      },
      {
        kicker: 'MÉTODO',
        title: 'Cómo buscar un error, paso a paso',
        text: 'MÉTODO Cómo buscar un error, paso a paso 02 Observa 1 Compara: ¿qué debería pasar y qué está pasando? Descríbelo con palabras. Revisa el circuito 2 Sigue cada cable desde el Arduino hasta el componente y de vuelta a GND. Lee el mensaje de error 3 Si no compila, el IDE dice en qué línea y qué espera. Mira también la línea de arriba. Usa el Monitor Serie 4 Imprime valores para ver qué está “pensando” el Arduino. Cambia una cosa a la vez 5 Si cambias muchas cosas juntas, no sabrás cuál era el problema. Truco profesional: explícale tu código, línea por línea, a tu compañero. Muchas veces el error…',
      },
      {
        kicker: 'MÉTODO',
        title: 'La lista de chequeo del circuito',
        text: 'MÉTODO La lista de chequeo del circuito 03 🔋 ☐ GND ¿Todo vuelve a GND? ¿El GND del Arduino llega al riel − de la protoboard? 📍 ☐ El pin ¿El cable está en el mismo pin que dice el código? 💡 ☐ Polaridad LEDs y buzzer: ¿la pata larga (+) va hacia el pin? 🧱 ☐ Resistencia ¿Cada LED tiene su resistencia de 220 Ω? 🧩 ☐ Columnas ¿Cada pata está en su propia columna? ¿Hay dos patas del mismo componente en la misma columna? 🔗 ☐ Contacto ¿Los cables están bien metidos en la protoboard y en el Arduino? Cuando algo no funciona, recorran esta lista ANTES de cambiar el código.',
      },
      {
        kicker: 'SIMULADOR',
        title: 'Wokwi: un Arduino dentro del navegador',
        text: 'SIMULADOR Wokwi: un Arduino dentro del navegador 04 wokwi ▶ Start 💾 Save ↗ Share 1 Abre el enlace del caso que te dio el profe. sketch.ino diagram.json 2 Presiona ▶ Start y observa qué pasa. ¿Es lo que debería pasar? void setup() { pinMode(8, OUTPUT); 3 Busca el error: en el código (pestaña sketch.ino) o en los cables } del dibujo. void loop() { 4 Corrígelo y vuelve a presionar ▶. Si quieres guardar tus cambios, digitalWrite(8, HIGH); crea una cuenta gratis y usa Save. … Ojo: en el simulador nada se quema. En la vida real, algunos de estos errores dañan componentes. ¡Por eso es mejor…',
      },
      {
        kicker: 'CASO A1 · CIRCUITO',
        title: 'El LED no enciende',
        text: 'CASO A1 · CIRCUITO El LED no enciende 05 + + ✅ Lo que debería pasar − − El LED del pin 8 parpadea cada segundo. 1 5 10 15 20 ❌ Lo que pasa a b c GND 13 12 ~11~10 ~9 8 7 ~6 ~5 4 ~3 2 1 0 d El LED nunca enciende. El código está e bien y el resto del circuito también. − + UNO 💡 Pista ATmega328P f g h IOREF RESET GND i 3.3V GND VIN 5V A0 A1 A2 A3 A4 A5 j Fíjate en las marcas + y − del LED. ¿Hacia + + dónde va cada pata? − − WOKWI Pruébalo en el simulador: caso A1',
      },
      {
        kicker: 'CASO A2 · CIRCUITO',
        title: 'El LED brilla muchísimo… y después nunca más',
        text: 'CASO A2 · CIRCUITO El LED brilla muchísimo… y después nunca más 06 + + ✅ Lo que debería pasar − − El LED enciende con un brillo normal. 1 5 10 15 20 ❌ Lo que pasa a b c GND 13 12 ~11~10 ~9 8 7 ~6 ~5 4 ~3 2 1 0 d Al principio brilla muy fuerte. Al rato se e apaga para siempre y huele raro. + − UNO 💡 Pista ATmega328P f g h IOREF RESET GND i 3.3V GND VIN 5V A0 A1 A2 A3 A4 A5 j Sigue el camino del cable azul. ¿Qué + + componente falta entre el pin y el LED? − − Este error no se puede ver en el simulador: se razona con lo que sabemos de electricidad.',
      },
      {
        kicker: 'CASO A3 · CIRCUITO',
        title: 'Todo parece bien conectado, pero nada enciende',
        text: 'CASO A3 · CIRCUITO Todo parece bien conectado, pero nada enciende 07 + + ✅ Lo que debería pasar − − El LED del pin 8 parpadea. 1 5 10 15 20 ❌ Lo que pasa a b c GND 13 12 ~11~10 ~9 8 7 ~6 ~5 4 ~3 2 1 0 d El LED no enciende nunca. El GND del e Arduino sí está conectado al riel −. + − UNO 💡 Pista ATmega328P f g h IOREF RESET GND i 3.3V GND VIN 5V A0 A1 A2 A3 A4 A5 j La corriente necesita un camino de ida y + + de vuelta. ¿Por dónde vuelve desde la − − pata corta? WOKWI Pruébalo en el simulador: caso A3',
      },
      {
        kicker: 'CASO A4 · CIRCUITO Y CÓDIGO',
        title: 'El código está bien… ¿o no?',
        text: 'CASO A4 · CIRCUITO Y CÓDIGO El código está bien… ¿o no? 08 const int LED = 8; + + ✅ Lo que debería pasar // fragmento del código − − El LED parpadea cada segundo. 1 5 10 15 20 ❌ Lo que pasa a b c GND 13 12 ~11~10~9 8 7 ~6 ~5 4 ~3 2 1 0 d El LED no hace nada. El código compila e sin errores y el LED, la resistencia y el + − GND están bien. UNO ATmega328P f g 💡 Pista h IOREF RESET GND i 3.3V 5V GND VIN A0 A1 A2 A3 A4 A5 j + + Compara el número del pin en el código − − con el pin donde está conectado el cable azul. WOKWI Pruébalo en el simulador: caso A4',
      },
      {
        kicker: 'CASO A5 · CIRCUITO',
        title: 'El botón está “siempre presionado”',
        text: 'CASO A5 · CIRCUITO El botón está “siempre presionado” 09 + + ✅ Lo que debería pasar − − El LED verde enciende solo mientras 1 5 10 15 20 presionas el botón (código con a INPUT_PULLUP ). b ❌ Lo que pasa c GND 13 12 ~11~10 ~9 8 7 ~6 ~5 4 ~3 2 1 0 d e + − El LED está encendido todo el tiempo, UNO ATmega328P f g presiones o no. h IOREF RESET GND 💡 Pista i 3.3V 5V GND VIN A0 A1 A2 A3 A4 A5 j + + − − Mira las columnas. El cable verde (pin 2) y el cable negro (GND) del botón… ¿están en columnas distintas? WOKWI Pruébalo en el simulador: caso A5',
      },
      {
        kicker: 'CASO A6 · CIRCUITO',
        title: 'El potenciómetro siempre marca 1023',
        text: 'CASO A6 · CIRCUITO El potenciómetro siempre marca 1023 10 + + ✅ Lo que debería pasar − − Al girar la perilla, el Monitor Serie muestra 1 5 10 15 20 números de 0 a 1023. a ❌ Lo que pasa b c B10K GND 13 12 ~11~10 ~9 8 7 ~6 ~5 4 ~3 2 1 0 d e Siempre marca 1023. Y al girar hasta un extremo, el potenciómetro se calienta y el UNO ATmega328P f g Arduino se reinicia. h IOREF RESET GND 💡 Pista i 3.3V 5V GND VIN A0 A1 A2 A3 A4 A5 j + + − − Recuerda qué trabajo tiene cada una de las 3 patas. ¿Cuál debe ir a A0? Este error no se puede ver en el simulador: se razona con lo que sabemos de electricidad.',
      },
      {
        kicker: 'CASO B1 · NO COMPILA',
        title: 'El IDE dice que hay un error… pero esa línea está bien',
        text: "CASO B1 · NO COMPILA El IDE dice que hay un error… pero esa línea está bien 11 caso_B1.ino ✅ Lo que debería pasar 1 void setup() { Que compile y el LED parpadee. 2 pinMode(8, OUTPUT) 3 4 } ❌ Lo que pasa 5 void loop() { No compila. El IDE marca la línea 3, donde solo hay una llave 6 digitalWrite(8, HIGH); }. 7 delay(1000); 8 9 digitalWrite(8, LOW); delay(1000); 💡 Pista 10 } Lee el mensaje: dice qué esperaba encontrar. El IDE avisa cuando se da cuenta… que suele ser una línea después. Salida del compilador WOKWI Pruébalo en el simulador: caso B1 sketch.ino: In function 'void setup()':…",
      },
      {
        kicker: 'CASO B2 · NO COMPILA',
        title: '“No fue declarado en este ámbito”',
        text: "CASO B2 · NO COMPILA “No fue declarado en este ámbito” 12 caso_B2.ino ✅ Lo que debería pasar 1 void setup() { Que compile y el LED parpadee. 2 pinMode(8, OUTPUT); 3 4 } ❌ Lo que pasa 5 void loop() { No compila: dice que digitalwrite “was not declared” (no fue 6 digitalwrite(8, HIGH); declarado). 7 delay(500); 8 9 digitalWrite(8, LOW); delay(500); 💡 Pista 10 } Compara la línea 6 con la línea 8, letra por letra. ¿Para el Arduino son iguales? Salida del compilador WOKWI Pruébalo en el simulador: caso B2 sketch.ino: In function 'void loop()': sketch.ino:6:3: error: 'digitalwrite' was not declared…",
      },
      {
        kicker: 'CASO B3 · NO COMPILA',
        title: 'La variable que “desapareció”',
        text: 'CASO B3 · NO COMPILA La variable que “desapareció” 13 caso_B3.ino ✅ Lo que debería pasar 1 void setup() { Que compile y el LED parpadee cada medio segundo. 2 pinMode(8, OUTPUT); 3 4 } int espera = 500; // tiempo de parpadeo ❌ Lo que pasa 5 No compila: dice que espera no existe… ¡pero está en la 6 void loop() { línea 3! 7 digitalWrite(8, HIGH); 8 9 delay(espera); digitalWrite(8, LOW); 💡 Pista 10 delay(espera); Una variable creada dentro de unas llaves { } solo existe 11 } dentro de esas llaves. ¿Dónde se crean las constantes en nuestros programas? Salida del compilador WOKWI Pruébalo en el…',
      },
      {
        kicker: 'CASO C1 · LÓGICA',
        title: 'El LED no parpadea: se queda encendido',
        text: 'CASO C1 · LÓGICA El LED no parpadea: se queda encendido 14 caso_C1.ino ✅ Lo que debería pasar 1 const int LED = 8; El LED enciende 1 segundo y se apaga 1 segundo. 2 3 4 void setup() { pinMode(LED, OUTPUT); ❌ Lo que pasa 5 } Compila bien, pero el LED parece siempre encendido. 6 7 8 void loop() { digitalWrite(LED, HIGH); 💡 Pista 9 delay(1000); El loop() se repite rapidísimo. Después de apagar el LED… 10 digitalWrite(LED, LOW); ¿cuánto tiempo espera antes de volver a encenderlo? 11 } WOKWI Pruébalo en el simulador: caso C1',
      },
      {
        kicker: 'CASO C2 · LÓGICA',
        title: 'El botón no hace nada',
        text: 'CASO C2 · LÓGICA El botón no hace nada 15 caso_C2.ino ✅ Lo que debería pasar 1 const int BOTON = 2; Al presionar el botón, el LED enciende. 2 const int LED = 8; 3 4 void setup() { ❌ Lo que pasa 5 pinMode(BOTON, INPUT_PULLUP); Compila (con una advertencia), pero el LED nunca enciende. El 6 pinMode(LED, OUTPUT); circuito está bien. 7 } 8 9 10 void loop() { int estado = digitalRead(BOTON); 💡 Pista Revisa la condición del if, símbolo por símbolo. ¿Está 11 if (estado = LOW) { comparando o está guardando un valor? 12 digitalWrite(LED, HIGH); 13 } else { 14 digitalWrite(LED, LOW); WOKWI Pruébalo en…',
      },
      {
        kicker: 'CASO C3 · LÓGICA',
        title: 'La alarma roja nunca se enciende',
        text: 'CASO C3 · LÓGICA La alarma roja nunca se enciende 16 caso_C3.ino ✅ Lo que debería pasar 1 const int LED_VERDE = 8, LED_AMARILLO = 9, LED_ROJO = 10; Perilla baja: verde. Media: amarillo. Al tope (más de 400): rojo. 2 3 4 5 void setup() { pinMode(LED_VERDE, OUTPUT); pinMode(LED_AMARILLO, OUTPUT); ❌ Lo que pasa 6 pinMode(LED_ROJO, OUTPUT); El verde y el amarillo funcionan, pero el rojo nunca enciende, 7 } aunque gires la perilla al máximo. 8 💡 Pista 9 void loop() { 10 int nivel = analogRead(A0); // potenciómetro 11 digitalWrite(LED_VERDE, LOW); 12 digitalWrite(LED_AMARILLO, LOW); 13…',
      },
      {
        kicker: 'CASO C4 · LÓGICA',
        title: 'El Monitor Serie está vacío',
        text: 'CASO C4 · LÓGICA El Monitor Serie está vacío 17 caso_C4.ino ✅ Lo que debería pasar 1 void setup() { Ver en el Monitor Serie los números del potenciómetro. 2 // configuración 3 4 } ❌ Lo que pasa 5 void loop() { Compila y sube sin problemas, pero el Monitor Serie se queda 6 int valor = analogRead(A0); en blanco. 7 Serial.print("Potenciómetro: "); 8 9 Serial.println(valor); delay(300); 💡 Pista 10 } Antes de poder hablar con el computador, hay que abrir la comunicación. ¿Qué línea va siempre en el setup()? Monitor Serie WOKWI Pruébalo en el simulador: caso C4 (no aparece nada)',
      },
      {
        kicker: 'CASO C5 · LÓGICA',
        title: 'El LED no se desvanece: parpadea',
        text: 'CASO C5 · LÓGICA El LED no se desvanece: parpadea 18 caso_C5.ino ✅ Lo que debería pasar 1 const int LED = 8; El LED sube y baja de brillo suavemente (efecto “fade”). 2 3 4 void setup() { pinMode(LED, OUTPUT); ❌ Lo que pasa 5 } El LED está apagado un rato y de golpe se enciende al máximo. 6 No hay brillos intermedios. 7 void loop() { 💡 Pista 8 for (int b = 0; b <= 255; b++) { // sube el brillo 9 analogWrite(LED, b); 10 delay(8); 11 } ¿Qué tienen de especial los pines marcados con ~? Mira tu tabla 12 for (int b = 255; b >= 0; b--) { // baja el brillo de la clase 2. 13 analogWrite(LED, b); 14…',
      },
      {
        kicker: 'CASO C6 · LÓGICA',
        title: 'El LED funciona… al revés',
        text: 'CASO C6 · LÓGICA El LED funciona… al revés 19 caso_C6.ino ✅ Lo que debería pasar 1 const int BOTON = 2; El LED enciende mientras presionas el botón. 2 const int LED = 8; 3 4 void setup() { ❌ Lo que pasa 5 pinMode(BOTON, INPUT_PULLUP); El LED está encendido cuando no presionas, y se apaga cuando 6 pinMode(LED, OUTPUT); presionas. 7 } 8 9 10 void loop() { int estado = digitalRead(BOTON); 💡 Pista Con INPUT_PULLUP , ¿qué lee digitalRead() cuando el botón está 11 if (estado == HIGH) { // ¿presionado? presionado: HIGH o LOW? Compruébalo con 12 digitalWrite(LED, HIGH); Serial.println(estado) . 13 }…',
      },
      {
        kicker: 'ACTIVIDAD FINAL',
        title: 'Ahora ustedes ponen el error',
        text: 'ACTIVIDAD FINAL Ahora ustedes ponen el error 25 🔁 Intercambio entre parejas ⏱️ Reglas 1. Cada pareja arma un programa que funcione (pueden usar uno de las 5 minutos por ronda. Pueden pedir una pista a la otra clases anteriores). pareja, pero se pierde un punto. 2. Le meten un solo error: de circuito, de compilación o de lógica. 🏆 Puntos 3. Escriben en un papel qué debería hacer el programa. 4. Intercambian con otra pareja: ¿quién encuentra y corrige el error más rápido? 2 puntos si lo encuentran y lo explican. +1 si dicen en qué paso del método lo descubrieron. 📝 Al final Cada pareja cuenta…',
      },
    ],
  },
];

export function getClassDeck(slug: string) {
  return classDecks.find((d) => d.slug === slug);
}
