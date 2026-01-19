# Práctica 10 — Reglas de validación con pruebas (Laravel ➜ Node.js/Express)

## 1) Objetivo
Implementar **reglas de validación** para la funcionalidad de **crear un estado** (`POST /statuses`) usando TDD, replicando el comportamiento típico de Laravel:

- Si `body` está vacío → responder **422** con JSON de error.
- Si `body` tiene menos de **10 caracteres** → responder **422** con JSON de error.
- Si cumple las reglas → permitir que el controlador cree el estado.

> Esta práctica se apoya en que ya existe autenticación para rutas web (por ejemplo `authWeb`) y un controlador `StatusController.store` que crea el status. Aquí solo se agrega **validación** y sus **pruebas**.

## 2) Reglas de validación (equivalencia Laravel ➜ Express)
En Laravel se haría algo como:

- `required`
- `min:10`

En Express lo implementamos como un **middleware** que valida `req.body.body` antes de llegar al controlador.

## 3) Código de la práctica (solo lo nuevo / lo que se modifica)

### 3.1 Middleware de validación
**Archivo:** `src/middleware/validations.js`

Agrega este middleware (y expórtalo):

```js
function validateCreateStatus(req, res, next) {
  const body = req.body?.body

  const errors = {}

  // required
  if (body === undefined || body === null || String(body).trim() === "") {
    errors.body = ["The body field is required."]
  }
  // min:10
  else if (String(body).length < 10) {
    errors.body = ["The body field must be at least 10 characters."]
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "The given data was invalid.",
      errors,
    })
  }

  next()
}

module.exports = {
  // ...otros exports que ya tengas
  validateCreateStatus,
}
```

**Notas importantes**
- El status code **422** representa “fallo de validación”.
- La respuesta JSON imita el estilo de Laravel: `message` + `errors`.

### 3.2 Acoplar el middleware en la ruta `POST /statuses`
**Archivo:** `src/routes/web.js`

Asegúrate de encadenar la validación **después** de `authWeb` y **antes** del controlador:

```js
const express = require("express")
const authWeb = require("../middleware/authWeb")
const StatusController = require("../controllers/StatusController")
const { validateCreateStatus } = require("../middleware/validations")

const router = express.Router()

router.get("/login", (req, res) => {
  res.status(200).send("Vista login")
})

router.post("/statuses", authWeb, validateCreateStatus, StatusController.store)

module.exports = router
```

**Por qué este orden**
- `authWeb`: si es invitado, normalmente redirige a `/login` (302).
- `validateCreateStatus`: si está autenticado pero manda datos inválidos, responde 422.
- `StatusController.store`: solo se ejecuta si todo es correcto.

## 4) Pruebas (TDD)
La idea es: **una prueba por cada regla**.

### 4.1 Prueba: `body` requerido
### 4.2 Prueba: `body` mínimo 10 caracteres

**Archivo:** `tests/feature/createStatus.test.js`

Agrega (o deja) estos casos:

```js
const request = require("supertest")
const app = require("../../src/app")
const statusStore = require("../../src/stores/statusStore")
const userStore = require("../../src/stores/userStore")

describe("Statuses - reglas de validación (Práctica 10)", () => {
  beforeEach(() => {
    if (typeof userStore.reset === "function") userStore.reset()
    if (typeof statusStore.resetStatuses === "function") statusStore.resetStatuses()
  })

  test("a status requires a body", async () => {
    const user = userStore.createUser
      ? userStore.createUser({ name: "Ana" })
      : { id: 1, name: "Ana" }

    const res = await request(app)
      .post("/statuses")
      .set("x-user-id", String(user.id))
      .send({ body: "" })

    expect(res.statusCode).toBe(422)
    expect(res.body).toHaveProperty("message")
    expect(res.body).toHaveProperty("errors")
    expect(res.body.errors).toHaveProperty("body")
  })

  test("a status body requires a minimum length", async () => {
    const user = userStore.createUser
      ? userStore.createUser({ name: "Ana" })
      : { id: 1, name: "Ana" }

    const res = await request(app)
      .post("/statuses")
      .set("x-user-id", String(user.id))
      .send({ body: "123456789" }) // 9 caracteres

    expect(res.statusCode).toBe(422)
    expect(res.body).toHaveProperty("message")
    expect(res.body).toHaveProperty("errors")
    expect(res.body.errors).toHaveProperty("body")
  })
})
```

> Si tu `authWeb` usa otro header en vez de `x-user-id`, reemplázalo en el test.

## 5) Cómo ejecutar
Instala dependencias (si aún no están):

```bash
npm install
```

Corre pruebas:

```bash
npm test
```

## 6) Resultado esperado
- `POST /statuses` con `body` vacío → **422** y JSON con `errors.body`.
- `POST /statuses` con `body` < 10 chars → **422** y JSON con `errors.body`.
- `POST /statuses` válido → el controlador crea el estado.

