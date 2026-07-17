# Prueba Técnica Full Stack — AssisPrex

Sistema de gestión de productos con CRUD completo, control de stock, historial de cambios y estados activo/inactivo.

---

## Arquitectura del Proyecto

### Visión General

```
┌──────────────────────────────────────────────────────────────┐
│                      Docker Compose                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │PostgreSQL│  │  pgAdmin │  │ Backend  │  │ Frontend │    │
│  │ :5432    │  │ :5050    │  │ :3000    │  │ :5173    │    │
│  └────┬─────┘  └──────────┘  └────┬─────┘  └────┬─────┘    │
│       │                            │              │         │
│       └────── init.sql ────────────┘              │         │
│                                      API REST     │         │
│                                       ◄──────────►│         │
└──────────────────────────────────────────────────────────────┘
```

---

### Backend — Arquitectura en Capas (N-Tier)

Se eligió **N-Tier** porque el alcance del reto (CRUD de 2 días) no requiere la complejidad de una arquitectura hexagonal. Las capas están separadas por responsabilidad y la dependencia fluye de arriba hacia abajo: **Routes → Controllers → Services → Entities**. Cada capa solo conoce a la inmediatamente inferior.

```
backend-assis/
├── db/init.sql                  → Inicialización automática de PostgreSQL
└── src/
    ├── config/                  → Variables de entorno + DataSource TypeORM
    ├── entities/                → Modelos TypeORM (Product, ProductHistory)
    ├── schemas/                 → Validación Zod (fail-fast antes del controlador)
    ├── middlewares/             → Error handler, async handler, validate
    ├── services/                → Lógica de negocio con transacciones
    ├── controllers/             → Extrae req, llama al servicio, responde HTTP
    ├── routes/                  → Definición de endpoints (solo mapeo HTTP)
    └── utils/                   → Helpers response envelope
```

#### Regla de dependencia

```
Routes → Controllers → Services → Entities
  │                        │
  │                   Zod Schemas
  │                   (validan entrada)
  │
Middlewares (error handler, async handler)
```

---

### Frontend — Arquitectura Hexagonal (Puertos y Adaptadores)

Se eligió **Arquitectura Hexagonal** para aislar completamente la lógica de negocio del framework (Vue) y del cliente HTTP (Axios). Así, si en el futuro se cambia Vue por React o Axios por Fetch, solo se toca la capa de infraestructura; el dominio y los casos de uso permanecen intactos.

```
frontend-assis/
└── src/
    ├── core/                       → CAPA INTERNA (dominio puro, sin frameworks)
    │   ├── domain/
    │   │   ├── entities/           → Modelos TypeScript (Product, ProductHistory)
    │   │   └── ports/              → Interfaces (contratos): ProductRepository
    │   └── application/
    │       └── use-cases/          → Lógica de negocio: ProductUseCases
    │
    ├── infrastructure/             → CAPA EXTERNA (adaptadores tecnológicos)
    │   ├── http/                   → Axios instance + interceptores de error
    │   └── adapters/               → AxiosProductRepository (implementa el puerto)
    │
    └── presentation/               → CAPA EXTERNA (UI — Vue, Pinia, Router)
        ├── assets/styles/          → global.css (variables corporativas + BEM)
        ├── components/             → UI (layout, products, AppDataTable genérico)
        ├── composables/            → Lógica reactiva reutilizable
        ├── config/                 → Mapeo declarativo de columnas y formularios
        ├── stores/                 → Pinia (orquestador: inyecta adaptador al caso de uso)
        ├── router/                 → Vue Router
        └── views/                  → Vistas (products)
```

#### Regla de dependencia (Ley de Dependencias)

```
core/ (dominio)  ←  infrastructure/ (adaptadores)  ←  presentation/ (UI)
     ↑ no sabe nada de Vue/Axios        ↑ implementa puertos
```

El **core** nunca importa Vue, Axios ni nada externo. Solo TypeScript puro.

#### Flujo de datos

```
Vista (ProductsView)
  ↓ llama acción
Pinia Store (productStore)
  ↓ instancia caso de uso inyectando adaptador
ProductUseCases (core/application)
  ↓ opera sobre la interfaz (puerto), no sobre Axios
ProductRepository (core/domain/ports) ← interfaz
  ↓ implementación concreta
AxiosProductRepository (infrastructure/adapters)
  ↓ llama HTTP
API REST (Backend)
```

---

## Principios SOLID Aplicados

### Backend (N-Tier)

| Principio | Aplicación |
|-----------|-----------|
| **SRP** | Cada capa tiene una responsabilidad única: rutas solo enrutan, controladores solo responden HTTP, servicios solo tienen lógica de negocio |
| **OCP** | Los servicios aceptan DTOs genéricos; agregar un nuevo campo no requiere modificar la estructura base |
| **LSP** | Los repositorios de TypeORM pueden sustituirse por mocks en pruebas sin alterar los servicios |
| **ISP** | Schemas Zod pequeños y específicos por operación (create, update, status, query) |
| **DIP** | Los servicios dependen de abstracciones (DataMapper de TypeORM), no de implementaciones concretas de BD |

### Frontend (Hexagonal)

| Principio | Aplicación |
|-----------|-----------|
| **SRP** | Cada caso de uso hace exactamente una cosa; los componentes Vue solo renderizan; las stores solo orquestan |
| **OCP** | Las entidades de dominio son cerradas a modificación pero abiertas a extensión (nuevos campos no rompen el core) |
| **LSP** | Cualquier adaptador (`AxiosProductRepository` o un `MockProductRepository`) puede sustituir al puerto `ProductRepository` sin romper el sistema |
| **ISP** | Interfaces pequeñas en `ports/` (un método por operación, no un monstruo CRUD gigante) |
| **DIP** | **Crítico**: Los casos de uso (`ProductUseCases`) nunca importan Axios. Dependen exclusivamente de la interfaz `ProductRepository`. Pinia inyecta la implementación concreta |

---

## Cumplimiento de Requisitos

| Criterio | Pts | Estado |
|----------|-----|--------|
| Vue 3 + Vite + Pinia (arquitectura frontend y manejo de estado) | 20 | ✅ |
| Backend — Express (diseño de la API) | 20 | ✅ |
| PostgreSQL y calidad del script SQL | 15 | ✅ |
| CRUD completo y funcional (incluye historial de cambios) | 15 | ✅ |
| Arquitectura general del proyecto | 10 | ✅ |
| Calidad del código (TypeScript strict, SOLID) | 10 | ✅ |
| Git y documentación (README) | 5 | ✅ |
| Buenas prácticas (errores, validaciones, organización) | 5 | ✅ |
| **Total** | **100** | **✅** |

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Vue 3 + Vite + Pinia + Vue Router + Ant Design Vue 4 + Axios + TypeScript |
| **Backend** | Node.js + Express 5 + TypeScript + TypeORM + PostgreSQL + Zod 4 |
| **Infraestructura** | Docker Compose (PostgreSQL 15, pgAdmin 4, Backend, Frontend) |

---

## API Endpoints

Base: `http://localhost:3000/api/products`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Listar productos (paginación, búsqueda, orden) |
| `GET` | `/:id` | Obtener producto por ID |
| `POST` | `/` | Crear producto |
| `PUT` | `/:id` | Actualizar producto |
| `DELETE` | `/:id` | Eliminar producto |
| `PATCH` | `/:id/status` | Cambiar estado activo/inactivo |
| `GET` | `/:id/history` | Obtener historial de cambios |

### Response Envelope

```json
{ "statusCode": 200, "message": "...", "data": {}, "status": "success" }
```

Errores: `{ "statusCode": 400, "message": "...", "data": null, "status": "error" }`

---

## Base de Datos

### Tabla `products`

| Columna | Tipo | Restricción |
|---------|------|-------------|
| id | UUID | PK, default uuid_generate_v4() |
| nombre_producto | VARCHAR(100) | NOT NULL |
| descripcion_producto | TEXT | nullable |
| precio_producto | DECIMAL(10,2) | NOT NULL, CHECK > 0 |
| stock_producto | INTEGER | NOT NULL, DEFAULT 0, CHECK >= 0 |
| estado_producto | BOOLEAN | NOT NULL, DEFAULT true |
| fecha_creacion | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

### Tabla `product_history`

| Columna | Tipo | Restricción |
|---------|------|-------------|
| id | UUID | PK |
| product_id | UUID | FK → products(id) ON DELETE CASCADE |
| action | VARCHAR(20) | NOT NULL (CREATE, UPDATE, DELETE, STATUS_CHANGE) |
| description | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() |

---

## Instalación y Ejecución

### Requisitos

- **Docker Desktop** (recomendado) o **Node.js >= 18** + **PostgreSQL**
- **npm** >= 9

### Todo con Docker (recomendado — único comando)

```bash
# 1. Clonar
git clone <repo-url>
cd prueba-tec-assis-fullstack

# 2. Copiar variables de entorno
cp .env.example .env
cp backend-assis/.env.example backend-assis/.env
cp frontend-assis/.env.example frontend-assis/.env

# 3. Iniciar todo
docker compose up --build
```

Acceso:
| Servicio | URL |
|----------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend** | http://localhost:3000 |
| **pgAdmin** | http://localhost:5050 |
| **PostgreSQL** | localhost:5432 |

### Desarrollo local

```bash
# Solo base de datos en Docker
docker compose up postgres_db -d

# Backend (terminal 1)
cd backend-assis
npm install
npm run dev

# Frontend (terminal 2)
cd frontend-assis
npm install
npm run dev
```

---

## Variables de Entorno

| Archivo | Propósito |
|---------|-----------|
| `.env` (raíz) | Credenciales PostgreSQL y pgAdmin para Docker Compose |
| `backend-assis/.env` | Conexión a BD y puerto del backend |
| `frontend-assis/.env` | URL base de la API (`VITE_API_BASE_URL`) |

> Copiar `.env.example → .env` en cada carpeta antes de ejecutar.

---

## Notas Técnicas

- **Express v5**: `req.params.id` es `string | string[]` — hacer cast `as string`.
- **Zod v4**: Usar `.issues` (no `.errors`) para errores de validación.
- **Transacciones**: Las operaciones de escritura usan `QueryRunner` de TypeORM.
- **Historial**: Se registra automáticamente en CREATE, UPDATE, DELETE y STATUS_CHANGE.
- **init.sql**: Se monta en `docker-entrypoint-initdb.d` para inicializar la BD al primer arranque.
- **Proxy Vite**: En Docker, `/api` se proxy a `http://backend:3000` por red interna. En local, Axios usa `VITE_API_BASE_URL=http://localhost:3000/api`.

---

## Acceso a pgAdmin

1. Abrir `http://localhost:5050`
2. Email/password del archivo `.env` (raíz)
3. Registrar servidor con host `postgres_db` y credenciales de `POSTGRES_USER`/`POSTGRES_PASSWORD`
