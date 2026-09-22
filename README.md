# Club Nonna

Programa de visitas de Los Pastes de Nonna. Es un producto aparte de la landing.

## Local

1. Node `>= 22.12.0` (`nvm use`).
2. Copia `.env.example` a `.env.local`.
3. En Supabase, pega `supabase/schema.sql` en el SQL Editor.
4. Llena `PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STAFF_PIN` y `LOYALTY_SECRET`.
5. `npm install` y `npm run dev`.

Sin llaves, las tres pantallas se ven y avisan que todavía no está conectado.

- `/` y `/lealtad`: registro
- `/lealtad/[code]`: tarjeta con QR
- `/scan`: caja

## Despliegue

Proyecto propio en Vercel. Subdominio sugerido: `club.lospastesdenona.com`.
No uses Vercel Postgres. Las variables de entorno son las mismas del `.env.example`.
