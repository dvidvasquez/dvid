# Mi Cuartel Digital

Portafolio personal estilo red social: un feed que combina blog, viajes y proyectos en una sola línea de tiempo, más vistas dedicadas por sección y un perfil.

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

4. Aplica el esquema de Prisma y carga datos de ejemplo:

   ```bash
   npx prisma db push
   npm run prisma:seed
   ```

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
- `npm run prisma:seed` — carga datos de ejemplo (posts, viajes, proyectos, perfil)
- `npm run storage:setup` — crea el bucket público `media` en Supabase Storage si no existe
- `npm run storage:upload -- <archivo> <ruta-en-bucket>` — sube un archivo a Storage y devuelve su URL pública
