# Mi Cuartel Digital

Portafolio personal estilo red social: un feed que combina blog, viajes y proyectos en una sola línea de tiempo, más vistas dedicadas por sección y un perfil.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Server Components)
- [Prisma 7](https://www.prisma.io) con adapter `@prisma/adapter-pg` sobre PostgreSQL (Supabase)
- SCSS Modules para estilos de componente + design tokens en `src/styles/theme.css`

Ver [AGENTS.md](./AGENTS.md) para las convenciones de arquitectura del proyecto.

## Empezando

1. Crea un archivo `.env` con `DATABASE_URL` apuntando a tu instancia de PostgreSQL.
2. Instala dependencias:

   ```bash
   npm install
   ```

3. Aplica el esquema de Prisma y carga datos de ejemplo:

   ```bash
   npx prisma db push
   npm run prisma:seed
   ```

4. Corre el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción
- `npm run start` — sirve el build de producción
- `npm run lint` — ESLint
- `npm run prisma:seed` — carga datos de ejemplo (posts, viajes, proyectos, perfil)
