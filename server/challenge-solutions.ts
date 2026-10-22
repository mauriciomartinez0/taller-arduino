import 'server-only';

import { MEDIR_RUIDO } from '@/content/challenges';

/** Challenge solutions, copied verbatim. Sent only when the teacher makes solutions visible. */
export const challengeSolutions: Record<string, string> = {
  'reto-ola': `const int LED1 = 9;
const int LED2 = 10;
const int LED3 = 11;
const int ESPERA = 4;

void setup() {
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
}

void loop() {
  pasar(LED1, LED2);
  pasar(LED2, LED3);
  pasar(LED3, LED1);
}

void pasar(int de, int hacia) {
  for (int b = 0; b <= 255; b++) {
    analogWrite(de, 255 - b);
    analogWrite(hacia, b);
    delay(ESPERA);
  }
}`,
  'reto-amanecer': `const int ROJO = 9, AMARILLO = 10, BLANCO = 11;

void setup() {
  pinMode(ROJO, OUTPUT); pinMode(AMARILLO, OUTPUT); pinMode(BLANCO, OUTPUT);
}

void loop() {
  // amanecer
  for (int b = 0; b <= 255; b++) { analogWrite(ROJO, b);     delay(10); }
  for (int b = 0; b <= 255; b++) { analogWrite(AMARILLO, b); delay(10); }
  for (int b = 0; b <= 255; b++) { analogWrite(BLANCO, b);   delay(10); }
  // mediodía
  delay(2000);
  // atardecer
  for (int b = 255; b >= 0; b--) { analogWrite(BLANCO, b);   delay(5); }
  for (int b = 255; b >= 0; b--) { analogWrite(AMARILLO, b); delay(5); }
  for (int b = 255; b >= 0; b--) { analogWrite(ROJO, b);     delay(15); }
  // noche: la estrella titila 5 veces
  for (int i = 0; i < 5; i++) {
    analogWrite(BLANCO, 20); delay(300);
    analogWrite(BLANCO, 0);  delay(700);
  }
}`,
  'reto-inundacion-ejemplo': `const int PIN_AGUA = A0;
const int LED_VERDE = 8, LED_AMARILLO = 9, LED_ROJO = 10;

void setup() {
  Serial.begin(9600);
  pinMode(LED_VERDE, OUTPUT);
  pinMode(LED_AMARILLO, OUTPUT);
  pinMode(LED_ROJO, OUTPUT);
}

void loop() {
  int nivel = analogRead(PIN_AGUA);
  Serial.print("Nivel: ");
  Serial.println(nivel);
  digitalWrite(LED_VERDE, LOW);
  digitalWrite(LED_AMARILLO, LOW);
  digitalWrite(LED_ROJO, LOW);

  if (nivel > 400) {
    digitalWrite(LED_ROJO, HIGH);
    Serial.println("¡Inundación!");
  } else if (nivel > 100) {
    digitalWrite(LED_AMARILLO, HIGH);
    Serial.println("¡Cuidado, hay agua!");
  } else {
    digitalWrite(LED_VERDE, HIGH);
    Serial.println("Todo seco");
  }
  delay(500);
}`,
  'reto-ruido': `const int LED_VERDE = 8, LED_AMARILLO = 9, LED_ROJO = 10;
const int BUZZER = 7;
const int LIMITE_HABLA = 40;    // calibrar con el monitor
const int LIMITE_GRITO = 150;   // calibrar con el monitor

void setup() {
  Serial.begin(9600);
  pinMode(LED_VERDE, OUTPUT);   pinMode(LED_AMARILLO, OUTPUT);
  pinMode(LED_ROJO, OUTPUT);    pinMode(BUZZER, OUTPUT);
}

void loop() {
  int ruido = medirRuido();
  Serial.print("Ruido: ");
  Serial.println(ruido);
  digitalWrite(LED_VERDE, LOW);
  digitalWrite(LED_AMARILLO, LOW);
  digitalWrite(LED_ROJO, LOW);

  if (ruido > LIMITE_GRITO) {
    digitalWrite(LED_ROJO, HIGH);
    Serial.println("¡Demasiado ruido!");
    digitalWrite(BUZZER, HIGH);  delay(200);
    digitalWrite(BUZZER, LOW);
  } else if (ruido > LIMITE_HABLA) {
    digitalWrite(LED_AMARILLO, HIGH);
    Serial.println("Están hablando");
  } else {
    digitalWrite(LED_VERDE, HIGH);
    Serial.println("Silencio");
  }
  delay(100);
}

${MEDIR_RUIDO}`,
};
