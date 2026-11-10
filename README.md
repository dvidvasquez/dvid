# Mi Cuartel Digital

Portafolio personal estilo red social: el inicio reúne las últimas noticias de fuentes que sigo (vía RSS, agrupadas por tema y actualizadas cada 6 horas), y hay vistas dedicadas a blog, viajes, proyectos y un perfil.

Las fuentes de noticias se configuran en `src/constants/newsSources.ts`. Si una fuente no tiene `feedUrl`, se busca el feed automáticamente en su página. El estado de cada fuente se puede ver en `/fuentes`.

La **agenda** (`/agenda`) reúne los próximos eventos de Medellín y alrededores (conciertos, teatro, ferias y festivales) para los siguientes 60 días, con filtro por fechas, tipo, municipio y texto. Las fuentes se configuran en `src/constants/eventSources.ts` y se actualizan cada 3 horas. Cada fuente se lee de una de tres formas: `kind: "tribe"` (WordPress con The Events Calendar: API REST y, si falla, su iCal), `kind: "ics"` (cualquier calendario `.ics` público) o `kind: "jsonld"` (páginas HTML con eventos de schema.org en JSON-LD o en microdatos, sin necesidad de API; si no los traen se prueba, en este orden, el JSON embebido en la página —`__NEXT_DATA__` y flujo RSC de Next.js, Nuxt 3 y cualquier `<script type="application/json">`— y las tarjetas con `<time datetime>`, y el panel avisa cuál lector funcionó; cada página puede llevar una `categoryHint` si todo lo que lista es de un género, y las que listan un mes por URL se declaran con `{month}` y `months` para leer el mes actual y los siguientes). Cada evento muestra su imagen o, si no tiene, una portada por defecto (`public/defaults/events.svg`). Cada tarjeta tiene un marcador para **guardar** el evento en ese día (de un evento de varios días solo se guarda el día marcado) y el botón «Guardados» muestra solo esos, en todo el rango de fechas; se guardan en el navegador (`localStorage`, sin cuenta ni base de datos, así que son por dispositivo), con el evento completo para que siga visible aunque la fuente deje de traerlo, y se sueltan solos cuando el evento ya pasó. Al final de la página, el panel «Fuentes» muestra cuáles respondieron, cuántos eventos trajo cada una y por qué falló la que no; si una página responde pero no trae eventos, explica qué datos sí tiene (bloques JSON-LD y sus tipos, microdatos, las listas de objetos del JSON embebido con sus campos, etiquetas `<time>` y `<article>` y las direcciones de API que aparecen en el HTML), para saber si sirve o hay que escribirle un lector propio. Los eventos cuyo municipio es otra ciudad conocida (Bogotá, Cali...) se descartan y el panel dice cuántos; las listas están en `src/constants/events.ts`. Los sitios que bloquean tráfico automático (403) no se pueden leer y se quitan de la lista; si piden esperar (429) se reintenta una vez.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components)
- [Prisma 7](https://www.prisma.io) con adapter `@prisma/adapter-pg` sobre PostgreSQL (Supabase)
- [Supabase Storage](https://supabase.com/storage) para multimedia (bucket público `media`)
- SCSS Modules para estilos de componente + design tokens en `src/styles/theme.css`

Ver [AGENTS.md](./AGENTS.md) para las convenciones de arquitectura del proyecto.

## Empezando

1. Crea un archivo `.env` con:

   ```bash
   DATABASE_URL=              # conexion a tu instancia de PostgreSQL (Supabase)
   SUPABASE_URL=               # Project URL, en Supabase > Project Settings > API
   SUPABASE_SERVICE_ROLE_KEY=  # service_role key, misma pantalla. Nunca exponer al cliente.
   ```

2. Instala dependencias:

   ```bash
   npm install
   ```

3. Crea el bucket de Storage (una sola vez):

   ```bash
   npm run storage:setup
   ```

4. Aplica el esquema de Prisma:

   ```bash
   npx prisma db push
   ```

   Si es un entorno nuevo (sin contenido real todavía), puedes cargar datos de ejemplo con `npm run prisma:seed -- --yes` — ver advertencia en [Scripts](#scripts).

5. Corre el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

## Multimedia

Las imágenes viven en el bucket público `media` de Supabase Storage, organizado por carpetas: `blog/`, `travels/`, `projects/`, `profile/`. Para subir un archivo:

```bash
npm run storage:upload -- ./ruta/local/foto.jpg blog/mi-post-cover.jpg
```

El comando imprime la URL pública final; esa es la que va en `heroImage`, `photoUrl` o `images` del registro correspondiente (ver `prisma/seed.ts` para el patrón con `getPublicMediaUrl`).

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run start` — sirve el build de producción
- `npm run lint` — ESLint
- `npm test` — pruebas unitarias de `src/utils` (runner nativo `node:test` vía `tsx`)

Cada pull request y cada push a `main` corre el lint y las pruebas en GitHub Actions (`.github/workflows/ci.yml`); los tipos y la compilación los valida el despliegue de Vercel.
- `npm run prisma:seed -- --yes` — ⚠️ borra y recrea posts, viajes, proyectos y perfil con datos de ejemplo. Solo para bootstrap inicial de un entorno nuevo; **no correrlo** una vez haya contenido real (por ejemplo cargado desde el Table Editor de Supabase), porque lo destruye. El flag `--yes` es obligatorio a propósito, para evitar correrlo sin querer.
- `npm run storage:setup` — crea el bucket público `media` en Supabase Storage si no existe
- `npm run storage:upload -- <archivo> <ruta-en-bucket>` — sube un archivo a Storage y devuelve su URL pública
- `npm run news:check` — revisa qué fuentes de noticias (`src/constants/newsSources.ts`) responden con un feed RSS/Atom
- `npm run events:check` — revisa qué fuentes de eventos (`src/constants/eventSources.ts`) responden, cuántos eventos traen y con cuántas imágenes
