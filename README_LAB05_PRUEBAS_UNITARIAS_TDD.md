# Laboratorio 05: Pruebas Unitarias con TDD (Laravel → Node.js + Express)

Este documento adapta la **Práctica/Laboratorio 05 (Pruebas unitarias con TDD)** de **PHP/Laravel (PHPUnit)** a un proyecto en **Node.js + Express (v5.2.1)** usando **Jest + Supertest**.

Además, este LAB05 queda **acoplado a la Práctica 4 (Controladores)**, reutilizando el enfoque MVC (rutas → controladores → “modelo/store”).

## 1) Objetivo

- Diferenciar y aplicar:
  - **Pruebas Unitarias** (unit)
  - **Pruebas de Integración/Feature** (feature)

- Implementar el ciclo **TDD**:
  1. **Red** (test falla)
  2. **Green** (mínimo código para pasar)
  3. **Refactor** (mejorar sin romper)

- Probar:
  - Relaciones tipo **hasMany / belongsTo** (simuladas)
  - Persistencia de pruebas equivalente a `sqlite :memory:` en Laravel (simulada con store en memoria)
  - **Protección de rutas**: usuario invitado (guest) debe **redirigir a `/login`**
  - Flujos CRUD: **store** y **update** con asserts de “registro creado/actualizado”

## 2) Equivalencias Laravel ↔ Node.js

| Concepto | Laravel (LAB05) | Node.js + Express |
|---|---|---|
| Framework de testing | PHPUnit | Jest |
| Feature tests | `tests/Feature` | `tests/feature` (convención) |
| Unit tests | `tests/Unit` | `tests/unit` (convención) |
| DB de pruebas | `sqlite :memory:` en `phpunit.xml` | Store en memoria con `reset()` antes de cada test |
| `RefreshDatabase` | Reset automático por test | `beforeEach(() => store.reset())` |
| `assertRedirect('login')` | Redirect a login | `expect(res.status).toBe(302)` + `expect(res.headers.location).toBe('/login')` |
| `assertDatabaseHas(...)` | Consulta a DB | `store.existsMatching(...)` (simulación) |
| Auth (guest vs logged) | Middleware Laravel | Middleware Express (ej: header `x-user-id`) |

## 3) Requisitos

- Node.js (recomendado LTS)
- NPM

Dependencias típicas:
- `express`
- `jest`
- `supertest`
- `nodemon` (dev)

## 4) Estructura recomendada (acoplada a Práctica 4)

```text
proyecto/
├── package.json
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/
│   │   ├── web.js
│   │   └── api.js
│   ├── controllers/
│   │   ├── PostController.js
│   │   └── RepositoryController.js
│   ├── middleware/
│   │   ├── validations.js
│   │   └── authWeb.js
│   └── stores/
│       └── repositoryStore.js
└── tests/
    ├── unit/
    │   └── models/
    │       └── userRepositoryRelation.test.js
    └── feature/
        ├── repositoryAuth.test.js
        └── repositoryCrud.test.js
```

## 5) Conceptos clave del LAB05 aplicados en Express

### 5.1) Unit vs Feature

- **Unit:** prueban lógica aislada (sin servidor HTTP). Ej: relación simulada “User hasMany Repositories”.
- **Feature:** prueban flujo real de la app (HTTP request → middleware → controller → response).

### 5.2) “Base de datos” de pruebas en memoria

En Laravel se configura en `phpunit.xml`:

- `DB_CONNECTION=sqlite`
- `DB_DATABASE=:memory:`

En Node (para laboratorio) usaremos un **store en memoria** con funciones:

- `reset()` (equivalente a refrescar DB)
- `create()` / `update()`
- `existsMatching()` (equivalente a `assertDatabaseHas`)

> Si más adelante usas una DB real (SQLite/PostgreSQL), puedes cambiar el store por un repositorio real sin cambiar todos los tests.

### 5.3) Protección de rutas (guest → login)

En el LAB05, si un usuario no está autenticado e intenta acceder a un recurso protegido, debe ser redirigido a **login**.

En Express se resuelve con un middleware:

- Si no hay usuario autenticado → `res.redirect(302, '/login')`

## 6) Implementación (Node.js + Express)

### 6.1) Store en memoria (simulación de DB)

**Archivo:** `src/stores/repositoryStore.js`

- Contiene un arreglo en memoria
- Tiene `reset()` para limpiar estado antes de cada test

### 6.2) Middleware de autenticación web

**Archivo:** `src/middleware/authWeb.js`

- Lee header `x-user-id` (simple para laboratorio)
- Si no existe → redirect a `/login`

### 6.3) RepositoryController (acoplado a Práctica 4)

**Archivo:** `src/controllers/RepositoryController.js`

Incluye:
- `index` (listar)
- `store` (crear) + redirect
- `update` (actualizar) + redirect

### 6.4) Rutas web

**Archivo:** `src/routes/web.js`

Agregar:
- `GET /login`
- `GET /repositories` protegido
- `POST /repositories` protegido
- `PUT /repositories/:id` protegido

## 7) Pruebas (TDD)

### 7.1) Feature: protección de rutas

**Archivo:** `tests/feature/repositoryAuth.test.js`

Escenarios (similar a la diapositiva del LAB05):
- Guest intenta:
  - `GET /repositories` → redirect `/login`
  - `POST /repositories` → redirect `/login`
  - `PUT /repositories/:id` → redirect `/login`

### 7.2) Feature: store y update (equivalente a assertDatabaseHas)

**Archivo:** `tests/feature/repositoryCrud.test.js`

- `beforeEach` llama `repositoryStore.reset()`
- `store`:
  - Actuar como usuario (`x-user-id`)
  - Hacer POST
  - Verificar redirect
  - Verificar existencia con `existsMatching`
- `update`:
  - Crear registro base
  - Hacer PUT
  - Verificar redirect
  - Verificar datos actualizados

### 7.3) Unit: relaciones simuladas (hasMany / belongsTo)

**Archivo:** `tests/unit/models/userRepositoryRelation.test.js`

- `hasMany`: filtrar repos por `userId`
- `belongsTo`: repo contiene `userId`

## 8) Comandos útiles

Instalar dependencias:

```bash
npm install
```

Levantar servidor (dev):

```bash
npm run dev
```

Ejecutar todos los tests:

```bash
npm test
```

Ejecutar tests filtrando por texto:

```bash
npm run test:filter "repository"
```

## 9) Checklist de entrega (LAB05)

- [ ] Carpeta `tests/unit` creada con al menos 1 test unitario
- [ ] Carpeta `tests/feature` creada con tests de rutas protegidas
- [ ] Middleware de auth implementado (guest → `/login`)
- [ ] `repositoryStore.reset()` usado como equivalente a `RefreshDatabase`
- [ ] Tests pasan (`npm test`)

## 10) Notas (compatibilidad Express 5)

- Express 5 usa un `path-to-regexp` más estricto. Si trabajas con rutas opcionales y te dan error, prefiere rutas explícitas en vez de `/:param?`.

