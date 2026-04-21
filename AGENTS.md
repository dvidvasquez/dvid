<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Convenciones del Proyecto

## Arquitectura General

- Usar `src/app` (App Router) con Server Components por defecto.
- Mantener `src/app/page.tsx` limpio: solo orquesta datos y renderiza componentes.
- Evitar mezclar acceso a datos directamente en componentes de presentación.

## Organización de Carpetas

- `src/components/commons/<Componente>/`:
  - `<Componente>.tsx`
  - `<Componente>.module.scss`
  - `index.ts` (barrel export)
- `src/services/`: lógica de negocio y agregación de datos (ej: feeds).
- `src/utils/`: funciones puras reutilizables.
- `src/utils/tests/`: pruebas unitarias por utilidad (1 función = 1 test file).
- `src/styles/`: tokens globales y variables de diseño.

## Componentes

- Cada componente debe ser atómico y con responsabilidad única.
- Co-localizar estilos en el mismo folder del componente usando SCSS Modules.
- Exportar cada componente desde su `index.ts` para imports cortos.
- Preferir imports tipo `@/components/commons/FeedList`.

## Estilos

- Los estilos de componente van en `*.module.scss`.
- Usar design tokens definidos en `src/styles/theme.css`:
  - Colores de marca (`--brand-*`)
  - Radius (`--radius-*`)
  - Sombras (`--shadow-*`)
- Evitar hardcodear colores/radius/sombras en componentes si existe token.

## Servicios y Datos

- Los servicios viven en `src/services` y encapsulan queries a Prisma.
- Normalizar datos en servicios antes de entregarlos a la UI.
- Los feeds globales deben salir ordenados por `createdAt` descendente.

## Utilidades y Pruebas

- Toda función utilitaria reutilizable debe ir en `src/utils/<fn>.ts`.
- Cada utilidad debe tener prueba en `src/utils/tests/<fn>.test.ts`.
- Las utilidades deben ser puras (sin efectos secundarios).

## Prisma y Base de Datos

- Cliente Prisma centralizado en `src/lib/db.ts`.
- Para Prisma 7, usar adapter PostgreSQL (`@prisma/adapter-pg`) según configuración actual del proyecto.
- Evitar instanciar PrismaClient en múltiples lugares fuera de `src/lib/db.ts` (excepto scripts controlados como seed).

## Criterios de Calidad

- Ejecutar `npm run lint` después de cambios relevantes.
- Mantener tipado estricto en TypeScript.
- Preferir refactors incrementales, legibles y consistentes con esta guía.
