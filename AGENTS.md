# AGENTS.md — Prueba Técnica Full Stack

## Stack
- **Backend:** Node.js + Express + TypeScript + TypeORM + PostgreSQL + Zod
- **Frontend:** Vue 3 + Vite + Pinia + Axios
- **Infra:** Docker Compose (PostgreSQL, pgAdmin, Backend, Frontend)

## Comandos (backend-assis/)
```sh
npm run dev        # tsx watch src/index.ts (dev con hot-reload)
npm run build      # tsc
npm run start      # node dist/index.js
npm run typecheck  # tsc --noEmit
```

## Arquitectura Backend (N-Tier en backend-assis/src/)
```
config/       → env.ts (dotenv), database.ts (TypeORM DataSource)
entities/     → Product.ts, ProductHistory.ts (decoradores TypeORM)
schemas/      → product.schema.ts (Zod: validación de entrada)
middlewares/  → validate.middleware.ts, error-handler.ts, async-handler.ts
services/     → product.service.ts (CRUD + historial con transacciones)
controllers/  → product.controller.ts (response envelope uniforme)
routes/       → product.routes.ts (definiciones de endpoints)
utils/        → response.ts (sendSuccess/sendError helper)
```

## Endpoints API (base: `/api/products`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Listar productos (paginación, búsqueda, orden) |
| GET | `/:id` | Obtener producto por ID |
| POST | `/` | Crear producto |
| PUT | `/:id` | Actualizar producto |
| DELETE | `/:id` | Eliminar producto |
| PATCH | `/:id/status` | Cambiar estado activo/inactivo |
| GET | `/:id/history` | Obtener historial de cambios |

## Response Envelope
Todos los endpoints responden con:
```json
{ "statusCode": 200, "message": "...", "data": ..., "status": "success" }
```
Errores: `{ "statusCode": 400, "message": "...", "data": null, "status": "error" }`

## Base de Datos
- `db/init.sql` se ejecuta automáticamente en el primer arranque de PostgreSQL via Docker.
- Tablas: `products` (UUID PK, CHECK precio>0, CHECK stock>=0) y `product_history` (FK CASCADE).
- Operaciones de escritura usan transacciones TypeORM (QueryRunner).

## Docker Compose (raíz)
```sh
docker compose up --build
```
Servicios: `postgres_db` (5432), `pgadmin` (5050), `backend` (3000), `frontend` (5173)

## Convenciones
- Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- Las validaciones Zod corren en middleware antes del controlador (fail-fast).
- Zod v4: usar `.issues` (no `.errors`) para acceder a errores de validación.
- Express v5: `req.params.id` es `string | string[]` — hacer cast `as string`.
