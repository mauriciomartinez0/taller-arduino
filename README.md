# Taller de Arduino

Página web para que los estudiantes resuelvan los 15 casos de errores de Arduino, repasen lo visto en clase y vean los retos. El profe tiene un panel para ver el avance de cada clase.

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **PostgreSQL** en Railway, con **Drizzle ORM**
- Despliegue en **Vercel** (plan gratuito)

---

## 1. Correr el proyecto en tu computador

Necesitas **Node.js 22 o más nuevo** y **Docker** (para la base de datos local).

```bash
# 1. Base de datos local (PostgreSQL en Docker)
docker compose up -d

# 2. Dependencias
npm install

# 3. Variables de entorno
cp .env.example .env.local
#   Abre .env.local y pon en TOKEN_PEPPER una cadena larga y aleatoria:
#   openssl rand -base64 48

# 4. Crear las tablas
npm run db:migrate

# 5. Datos de prueba: profe demo y la clase DEMO-01
npm run db:seed

# 6. Arrancar
npm run dev
```

Abre <http://localhost:3000>:

- **Estudiante:** escribe un nombre (por ejemplo “Sara M.”) y el código `DEMO-01`.
- **Profe:** entra en <http://localhost:3000/profe/login> con `demo@taller.local` / `demo-taller-123`.

### Comandos útiles

| Comando                  | Qué hace                                             |
| ------------------------ | ---------------------------------------------------- |
| `npm run dev`            | Servidor de desarrollo                               |
| `npm test`               | Tests (Vitest)                                       |
| `npm run lint`           | Revisión de estilo (ESLint)                          |
| `npm run typecheck`      | Revisión de tipos (TypeScript)                       |
| `npm run format`         | Formatea el código (Prettier)                        |
| `npm run db:generate`    | Genera una migración nueva si cambias `db/schema.ts` |
| `npm run db:migrate`     | Aplica las migraciones a la base de `DATABASE_URL`   |
| `npm run db:studio`      | Abre Drizzle Studio para ver las tablas              |
| `npm run create-teacher` | Crea un profe (o le cambia la contraseña)            |

---

## 2. Poner la página en internet (Railway + Vercel)

Lo vas a hacer una sola vez. Toma unos 20 minutos.

### Paso 1 · Base de datos en Railway

1. Entra en <https://railway.com> y crea una cuenta (puedes usar tu cuenta de GitHub).
2. **New Project → Database → PostgreSQL**. Railway crea la base de datos.
3. Abre el servicio **Postgres → pestaña Variables** y copia el valor de **`DATABASE_PUBLIC_URL`**. Se ve así:
   `postgresql://postgres:CLAVE@algo.proxy.rlwy.net:12345/railway`

> **¿Por qué la pública y no `DATABASE_URL`?** La `DATABASE_URL` de Railway apunta a `*.railway.internal`, una dirección que solo existe _dentro_ de Railway. Vercel está fuera de Railway, así que necesita la dirección pública (la del proxy, `*.proxy.rlwy.net`).

> **Costos:** Railway da un crédito de prueba. Después cobra según el uso (plan Hobby, con un mínimo mensual pequeño). Una base de datos para un curso usa muy poco, pero revisa el consumo en el panel de Railway.

### Paso 2 · Crear las tablas en Railway

En tu computador, desde la carpeta del proyecto (cambia la URL por la tuya):

```bash
DATABASE_URL="postgresql://postgres:CLAVE@algo.proxy.rlwy.net:12345/railway" npm run db:migrate
```

### Paso 3 · Crear tu cuenta de profe

```bash
DATABASE_URL="postgresql://postgres:CLAVE@algo.proxy.rlwy.net:12345/railway" \
TOKEN_PEPPER="la-misma-cadena-que-pondrás-en-vercel" \
npm run create-teacher -- --email tu@correo.com
```

Te pide la contraseña dos veces (mínimo 10 caracteres). No se ve mientras escribes: es normal. Si olvidas la contraseña, corre el mismo comando y te deja poner una nueva.

### Paso 4 · Subir el código a GitHub

1. Crea un repositorio **privado** en <https://github.com/new> (por ejemplo `taller-arduino`).
2. En la carpeta del proyecto:

```bash
git remote add origin https://github.com/TU_USUARIO/taller-arduino.git
git push -u origin main
```

### Paso 5 · Publicar en Vercel

1. Entra en <https://vercel.com> con tu cuenta de GitHub.
2. **Add New → Project** e importa el repositorio `taller-arduino`.
3. En **Environment Variables** agrega:

   | Nombre                | Valor                                                  |
   | --------------------- | ------------------------------------------------------ |
   | `DATABASE_URL`        | La `DATABASE_PUBLIC_URL` de Railway                    |
   | `TOKEN_PEPPER`        | Una cadena aleatoria larga (`openssl rand -base64 48`) |
   | `SESSION_COOKIE_NAME` | `taller_session`                                       |

   > `TOKEN_PEPPER` debe ser **la misma** siempre: si la cambias, todos los estudiantes y profes tienen que volver a entrar, y los PIN guardados dejan de servir.

4. **Deploy**. En un par de minutos te da una dirección como `https://taller-arduino.vercel.app`.
5. _(Recomendado)_ En Vercel → **Settings → Functions → Region**, elige la región más cercana a la de tu base de datos en Railway (por ejemplo, si Railway está en `us-east`, usa `iad1`). Cada consulta viaja entre los dos, así que mientras más cerca, más rápida la página.

Cada vez que hagas `git push`, Vercel publica la nueva versión sola. Si cambias el esquema de la base de datos, corre otra vez el **Paso 2**.

### Paso 6 · Preparar la clase

1. Entra en `https://TU-PAGINA.vercel.app/profe/login`.
2. Crea una clase (por ejemplo “7°B 2026”). El código se genera solo, o escribe uno como `ARD-7B`.
3. Abre la clase y, en **Casos**, pega el enlace de Wokwi de cada caso y deja abiertos los casos del día.
4. Comparte con los estudiantes la dirección de la página y el código de la clase.

Cuando crees otra clase, los enlaces de Wokwi se copian de tu clase más reciente.

En la página de la clase, **Proyectar en el tablero** abre una vista con el porcentaje de la clase que va resolviendo cada caso, sin nombres de estudiantes ni tu correo.

---

## 3. Cómo está hecho

```text
app/                  Páginas (App Router) y rutas de la API
  (student)/          Casos, repaso y retos (requieren haber entrado)
  profe/              Login y panel del profe
  api/                Verificación de respuestas, pistas, quices, panel y CSV
components/           Interfaz (casos, circuitos SVG, repaso, panel)
  circuit/            Protoboard, Arduino UNO, cables, LED, resistencia, botón, potenciómetro
content/              Contenido público: casos, repaso y retos
server/               Código que solo corre en el servidor (respuestas, sesiones, base de datos)
db/                   Esquema de Drizzle y conexión
drizzle/              Migraciones SQL
scripts/              create-teacher y seed
```

### Seguridad y privacidad

- **Las respuestas correctas nunca llegan al navegador.** Viven en `server/` (con `import 'server-only'`) y el navegador solo recibe “correcto / incorrecto” y la retroalimentación. Las explicaciones, el código corregido y los circuitos corregidos se envían solo cuando el caso se resuelve.
- **La base de datos solo se toca desde el servidor.** `DATABASE_URL` nunca llega al navegador.
- **Contraseñas:** se guardan con argon2. **Tokens de sesión:** se guarda solo su hash (HMAC-SHA256 con `TOKEN_PEPPER`). **PIN de los estudiantes:** cifrado con AES-256-GCM para que el profe pueda verlo en el panel.
- **Límites:** 5 intentos fallidos de login (o de PIN) → esperar 10 minutos; máximo 30 respuestas por minuto por estudiante.
- **Datos de los estudiantes:** solo el nombre corto, el nombre de la pareja (opcional) y sus respuestas. Sin correo, apellido completo ni fotos.

### Conexión a la base de datos (Vercel + Railway)

`db/index.ts` crea **un solo cliente por instancia** del servidor y lo reutiliza:

- `max: 3` conexiones por instancia: Vercel puede tener varias instancias a la vez, y así el total queda muy por debajo del límite de Railway.
- `idle_timeout: 20` s: las conexiones que no se usan se cierran solas.
- `ssl: 'require'` con Railway; sin SSL contra el PostgreSQL local de Docker.
