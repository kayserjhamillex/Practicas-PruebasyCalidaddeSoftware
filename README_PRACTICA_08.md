# Práctica 8 (Lab 08) — Pruebas para una Red Social con TDD (Node.js/Express)

## 0. Punto de partida
Esta práctica **parte de la Práctica 5** (TDD + tests) y replica el flujo que en PHP/Laravel se hace con:
- `php artisan make:test CreateStatusTest`
- `RefreshDatabase` + SQLite en memoria
- `actingAs($user)`
- `POST /statuses`
- `assertDatabaseHas('statuses', ...)`
- middleware `auth` + redirect a `login`

Aquí lo convertimos a **Node.js + Express** con:
- **Jest + Supertest** para feature tests
- **DB en memoria** (store/repository en memoria) para simular `:memory:`
- middleware `authWeb` (simula `auth` de Laravel)

> Nota: En este laboratorio no se requiere página local de frontend; el enfoque es backend + pruebas automatizadas.

## 1. Estructura sugerida

```
practica5_social_tdd/
├── src/
│   ├── app.js
│   ├── middleware/
│   │   └── authWeb.js
│   ├── stores/
│   │   └── db.js
│   ├── controllers/
│   │   └── StatusController.js
│   └── routes/
│       └── web.js
├── server.js
├── tests/
│   └── feature/
│       └── createStatus.test.js
├── package.json
└── README_PRACTICA_08.md
```

## 2. Instalación

```bash
npm i express
npm i -D jest supertest
```

En `package.json`:

```json
{
  "scripts": {
    "test": "jest --runInBand"
  }
}
```

## 3. Implementación (equivalencias Laravel → Node)

### 3.1 “DB en memoria” (equivalente a SQLite `:memory:`)
Laravel usa SQLite en memoria para tests. Aquí usamos un **store en memoria** que se puede `reset()` antes de cada prueba.

**`src/stores/db.js`**

```js
const db = {
  users: [],
  statuses: [],
  _ids: { users: 1, statuses: 1 },

  reset() {
    this.users = []
    this.statuses = []
    this._ids = { users: 1, statuses: 1 }
  },

  createUser(attrs = {}) {
    const user = {
      id: this._ids.users++,
      name: attrs.name ?? "Test User",
      email: attrs.email ?? `user${Date.now()}@test.com`,
    }
    this.users.push(user)
    return user
  },

  createStatus(attrs = {}) {
    const status = {
      id: this._ids.statuses++,
      user_id: attrs.user_id,
      body: attrs.body,
      created_at: new Date().toISOString(),
    }
    this.statuses.push(status)
    return status
  },
}

module.exports = db
```

### 3.2 Autenticación (equivalente a `actingAs` + middleware `auth`)
En Laravel:
- `actingAs($user)` autentica al usuario para el request
- `middleware('auth')` protege la ruta

En Node:
- el test envía un header `x-user-id`
- el middleware carga `req.user`

**`src/middleware/authWeb.js`**

```js
const db = require("../stores/db")

function authWeb(req, res, next) {
  const userId = req.header("x-user-id")

  if (!userId) {
    return res.status(302).set("Location", "/login").send("Redirecting to /login")
  }

  const user = db.users.find((u) => String(u.id) === String(userId))

  if (!user) {
    return res.status(302).set("Location", "/login").send("Redirecting to /login")
  }

  req.user = user
  next()
}

module.exports = authWeb
```

### 3.3 Controlador de Status (equivalente a `StatusController@store`)
En Laravel, termina evolucionando a:
- crear status con `user_id = auth()->id()`
- retornar redirect o JSON según la prueba

Aquí lo dejamos como **JSON** (el lab llega a `assertJson`).

**`src/controllers/StatusController.js`**

```js
const db = require("../stores/db")

function store(req, res) {
  // body viene del request
  const body = req.body?.body

  // en este lab asumimos usuario autenticado por middleware
  const userId = req.user.id

  const status = db.createStatus({
    user_id: userId,
    body,
  })

  // Equivalente a assertJson en Laravel
  return res.status(201).json({
    message: "El estado fue creado correctamente",
    status,
  })
}

module.exports = { store }
```

### 3.4 Rutas (equivalente a `Route::post('/statuses')->middleware('auth')`)
**`src/routes/web.js`**

```js
const express = require("express")
const authWeb = require("../middleware/authWeb")
const StatusController = require("../controllers/StatusController")

const router = express.Router()

// Ruta login mínima (para que el redirect tenga destino)
router.get("/login", (req, res) => {
  res.status(200).send("Vista login")
})

// Crear status (protegida)
router.post("/statuses", authWeb, StatusController.store)

module.exports = router
```

### 3.5 App Express
**`src/app.js`**

```js
const express = require("express")
const webRoutes = require("./routes/web")

const app = express()
app.use(express.json())

app.use(webRoutes)

module.exports = app
```

**`server.js`**

```js
const app = require("./src/app")

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

## 4. Pruebas (Feature tests con Jest + Supertest)

Equivalencias clave:
- `User::factory()->create()` → `db.createUser()`
- `actingAs($user)` → header `x-user-id: user.id`
- `assertDatabaseHas('statuses', ...)` → buscar en `db.statuses`
- `assertRedirect(route('login'))` → `302` + `Location: /login`

**`tests/feature/createStatus.test.js`**

```js
const request = require("supertest")
const app = require("../../src/app")
const db = require("../../src/stores/db")

describe("Create Status (Práctica 8) — TDD", () => {
  beforeEach(() => {
    db.reset()
  })

  test("an authenticated user can create status", async () => {
    // GIVEN: usuario autenticado
    const user = db.createUser({ name: "Ana" })

    // WHEN: POST /statuses
    const res = await request(app)
      .post("/statuses")
      .set("x-user-id", String(user.id))
      .send({ body: "Mi primer estado publicado" })

    // THEN: respuesta JSON + DB tiene registro
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty("message")
    expect(res.body.message).toBe("El estado fue creado correctamente")

    const found = db.statuses.find(
      (s) => s.body === "Mi primer estado publicado" && s.user_id === user.id
    )
    expect(found).toBeTruthy()
  })

  test("guest users can not create statuses", async () => {
    // GIVEN: sin auth
    // WHEN: POST /statuses sin header
    const res = await request(app)
      .post("/statuses")
      .send({ body: "No debería crear" })

    // THEN: redirect a /login
    expect(res.statusCode).toBe(302)
    expect(res.headers.location).toBe("/login")
  })
})
```

## 5. Ejecutar

```bash
npm test
```

## 6. Qué se logró
- Se replicó el flujo TDD del laboratorio Laravel pero en Node.js.
- Se implementó la creación de “estados” asociados a un usuario autenticado.
- Se protegió la ruta con middleware (invitados redirigen a `/login`).
- Se verificó persistencia en “DB” en memoria (equivalente a SQLite `:memory:` en pruebas).
