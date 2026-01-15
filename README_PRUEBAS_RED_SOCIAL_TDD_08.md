# Laboratorio / Práctica 08 — Pruebas para una Red Social con TDD (Laravel ➜ Node.js + Express)

## 0. Contexto académico

**Base:** "L08 Pruebas para una Red Social con TDD" (Laravel/PHP) adaptado a **Node.js + Express**.

**Punto de partida:** Esta práctica se construye sobre la **Práctica 05** (pruebas unitarias + feature con TDD), aplicando el ciclo **RED → GREEN → REFACTOR** para desarrollar funcionalidad de una red social básica.

**Objetivo principal:** Implementar TDD para que un **usuario autenticado pueda crear posts (estados)**, validando:
- Solo usuarios autenticados pueden publicar.
- El post se guarda correctamente en la base de datos.
- El post está asociado al usuario que lo creó.
- Se retorna un mensaje de éxito.
- Los invitados (guests) no pueden publicar y son redirigidos a `/login`.

---

## 1. Propósito / Objetivo

- Aplicar el ciclo **TDD (Red → Green → Refactor)** completo.
- Crear funcionalidad guiada por pruebas (test-first).
- Validar autenticación y autorización mediante middleware.
- Implementar CRUD básico para "estados" (posts) en una red social.
- Documentar cada paso del ciclo TDD (errores → soluciones → refactor).

---

## 2. Tecnologías

- **Node.js** + **Express**
- **Jest** (runner + assertions)
- **Supertest** (requests HTTP)
- Store en memoria (simulando base de datos)

---

## 3. Equivalencias Laravel ➜ Express

| Laravel (PHP) | Node.js + Express |
|---|---|
| `RefreshDatabase` | `repositoryStore.reset()` / `postStore.reset()` |
| `auth()` | `req.user` (desde middleware `auth`) |
| `actingAs($user)` | Header `x-user-id` |
| `assertDatabaseHas('posts', [...])` | `expect(postStore.findById(...))` |
| `assertRedirect(...)` | `expect(res.statusCode).toBe(302)` |
| `assertJson(...)` | `expect(res.body).toEqual(...)` |
| Middleware `auth` | `middleware/auth.js` |
| Factory | `User.factory().create()` → `{ id: 1, name: '...' }` |

---

## 4. Estructura del proyecto (Práctica 05 → Práctica 08)

Partiendo de Práctica 05, agregamos:

```
src/
├─ controllers/
│  └─ PostController.js       (nuevo para LAB08)
├─ stores/
│  └─ postStore.js             (nuevo para LAB08)
├─ middleware/
│  └─ auth.js                  (ya existente desde LAB05)
├─ routes/
│  ├─ api.js
│  └─ web.js
├─ app.js
└─ server.js

tests/
└─ feature/
   └─ createPost.test.js       (nuevo para LAB08)
```

---

## 5. Instalación

```bash
npm install
```

Si aún no tienes las dependencias:

```bash
npm i express
npm i -D jest supertest
```

---

## 6. Configuración de scripts (package.json)

```json
{
  "scripts": {
    "start": "node src/server.js",
    "test": "jest --runInBand"
  }
}
```

---

## 7. Ciclo TDD — RED → GREEN → REFACTOR

### 7.1 PASO 1: RED (Escribir una prueba que falle)

Creamos el archivo de prueba **antes** de escribir el código de producción.

#### `tests/feature/createPost.test.js`

```js
const request = require('supertest')
const app = require('../../src/app')

const postStore = require('../../src/stores/postStore')

describe('Create Post (Red Social)', () => {
  beforeEach(() => {
    postStore.reset()
  })

  /** @test */
  test('an_authenticated_user_can_create_status', async () => {
    // GIVEN: un usuario autenticado
    const user = { id: 1, name: 'Juan' }

    // WHEN: hace un POST request a /api/posts
    const res = await request(app)
      .post('/api/posts')
      .set('x-user-id', user.id)
      .send({ body: 'Mi primer estado publicado' })

    // THEN: veo un nuevo estado en la base de datos
    expect(res.statusCode).toBe(201)
    expect(res.body.message).toBe('El estado fue creado correctamente')

    // Verificar que el post existe en el store
    const posts = postStore.all()
    expect(posts).toHaveLength(1)
    expect(posts[0].body).toBe('Mi primer estado publicado')
    expect(posts[0].userId).toBe(1)
  })

  /** @test */
  test('guests_users_can_not_create_statuses', async () => {
    // GIVEN: un usuario NO autenticado (guest)

    // WHEN: intenta hacer POST sin header x-user-id
    const res = await request(app)
      .post('/api/posts')
      .send({ body: 'Intento de publicación' })

    // THEN: es redirigido a /login (302) o recibe 401
    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe('Unauthorized')
  })
})
```

**Ejecutar:**

```bash
npm test
```

**Resultado esperado:** ❌ FAIL (ruta no existe, controlador no existe, etc.)

---

### 7.2 PASO 2: GREEN (Escribir el código mínimo para pasar la prueba)

#### 7.2.1 Crear el store para posts

**`src/stores/postStore.js`**

```js
let posts = []
let id = 1

function reset() {
  posts = []
  id = 1
}

function all() {
  return posts
}

function create({ body, userId }) {
  const post = { id: id++, body, userId }
  posts.push(post)
  return post
}

function findById(postId) {
  return posts.find(p => p.id === Number(postId)) || null
}

module.exports = {
  reset,
  all,
  create,
  findById
}
```

---

#### 7.2.2 Crear el controlador

**`src/controllers/PostController.js`**

```js
const postStore = require('../stores/postStore')

exports.store = (req, res) => {
  const { body } = req.body

  if (!body) {
    return res.status(422).json({ message: 'body is required' })
  }

  const post = postStore.create({
    body,
    userId: req.user.id
  })

  res.status(201).json({
    message: 'El estado fue creado correctamente',
    data: post
  })
}
```

---

#### 7.2.3 Actualizar rutas

**`src/routes/api.js`**

```js
const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const PostController = require('../controllers/PostController')

// Ruta protegida para crear posts
router.post('/posts', auth, PostController.store)

module.exports = router
```

---

#### 7.2.4 Middleware de autenticación (ya existente desde LAB05)

**`src/middleware/auth.js`**

```js
module.exports = function auth(req, res, next) {
  const userId = req.header('x-user-id')

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.user = { id: Number(userId) }
  next()
}
```

---

#### 7.2.5 Ruta de login (para redirección de guests)

**`src/routes/web.js`**

```js
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send('Inicio')
})

router.get('/login', (req, res) => {
  res.status(200).send('Vista login')
})

module.exports = router
```

---

**Ejecutar:**

```bash
npm test
```

**Resultado esperado:** ✅ PASS (todos los tests pasan)

---

### 7.3 PASO 3: REFACTOR (Mejorar el código sin romper las pruebas)

Posibles mejoras:

1. **Validación más robusta** (usar `express-validator` o similar).
2. **Separar lógica de negocio** del controlador (crear un servicio `PostService`).
3. **Agregar más tests** (validar body vacío, posts duplicados, etc.).
4. **Implementar paginación** en `GET /api/posts`.

Ejemplo de refactor para validación:

**`src/controllers/PostController.js` (refactorizado)**

```js
const postStore = require('../stores/postStore')

exports.store = (req, res) => {
  const { body } = req.body

  // Validación mejorada
  if (!body || body.trim() === '') {
    return res.status(422).json({ 
      message: 'El contenido del estado no puede estar vacío' 
    })
  }

  const post = postStore.create({
    body: body.trim(),
    userId: req.user.id
  })

  res.status(201).json({
    message: 'El estado fue creado correctamente',
    data: post
  })
}
```

**Ejecutar nuevamente:**

```bash
npm test
```

**Resultado esperado:** ✅ PASS (las pruebas siguen pasando después del refactor)

---

## 8. Pruebas adicionales sugeridas

### 8.1 Validar que el body no puede estar vacío

**`tests/feature/createPost.test.js`** (agregar)

```js
/** @test */
test('validates_body_is_required', async () => {
  const res = await request(app)
    .post('/api/posts')
    .set('x-user-id', '1')
    .send({})

  expect(res.statusCode).toBe(422)
  expect(res.body.message).toContain('body')
})

/** @test */
test('validates_body_cannot_be_empty_string', async () => {
  const res = await request(app)
    .post('/api/posts')
    .set('x-user-id', '1')
    .send({ body: '   ' })

  expect(res.statusCode).toBe(422)
})
```

---

## 9. Ejecución

### 9.1 Levantar servidor

```bash
npm start
```

### 9.2 Ejecutar pruebas

```bash
npm test
```

---

## 10. Documentación de escenarios de prueba (tabla de casos)

| # | Caso de prueba | GIVEN | WHEN | THEN | Resultado esperado |
|---|---|---|---|---|---|
| 1 | Usuario autenticado crea estado | Usuario con `x-user-id: 1` | POST `/api/posts` con `body: "Hola"` | Estado guardado en DB con `userId: 1` | ✅ 201 + mensaje éxito |
| 2 | Guest intenta crear estado | Sin header `x-user-id` | POST `/api/posts` | Rechazado | ❌ 401 Unauthorized |
| 3 | Body vacío | Usuario autenticado | POST `/api/posts` con `body: ""` | Validación falla | ❌ 422 |
| 4 | Body solo espacios | Usuario autenticado | POST `/api/posts` con `body: "   "` | Validación falla | ❌ 422 |

---

## 11. Evidencias sugeridas

- Captura de la estructura del proyecto (carpetas `src/` y `tests/`).
- Captura de ejecución de `npm test` con todos los tests en verde (PASS).
- Captura de al menos 1 test fallando durante el ciclo RED (opcional pero recomendado).
- Captura de request en Postman/Insomnia (opcional).

---

## 12. Conclusiones

- **TDD** permite construir funcionalidad de forma incremental y segura.
- El ciclo **RED → GREEN → REFACTOR** garantiza que el código esté siempre respaldado por pruebas.
- Separar **unit tests** (lógica pura) de **feature tests** (HTTP) facilita el mantenimiento.
- Un store en memoria + `reset()` simula `RefreshDatabase` de Laravel para laboratorios.
- Middleware de autenticación replica el comportamiento de `auth()` en Laravel.

---

## 13. Preguntas de reflexión (metacognición)

1. ¿Qué aprendí sobre TDD en esta práctica?
2. ¿Cómo puedo aplicar el ciclo RED-GREEN-REFACTOR en proyectos reales?
3. ¿Qué ventajas tiene escribir las pruebas antes que el código?
4. ¿Qué desafíos encontré al adaptar Laravel a Node.js?

---

## 14. Próximos pasos

- Implementar **edición** y **eliminación** de posts (con TDD).
- Agregar **relaciones** (un usuario tiene muchos posts).
- Implementar **likes** y **comentarios** (con TDD).
- Migrar el store en memoria a una **base de datos real** (PostgreSQL, MongoDB, etc.).
