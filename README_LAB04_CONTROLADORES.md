# Laboratorio / Práctica 04 — Controladores (Laravel ➜ Node.js + Express)

## 1. Contexto
En Laravel, los **Controladores** agrupan la lógica que responde a una ruta y normalmente trabajan junto con **Modelos** (Eloquent) y **Vistas** (Blade) bajo el patrón **MVC**.

En esta práctica se realiza la conversión conceptual a **Node.js + Express**, usando:
- `routes/` para definir rutas
- `controllers/` para lógica de aplicación
- `stores/` (o `services/` / `repositories/`) como sustituto ligero de “persistencia” (en memoria)
- **Jest + Supertest** para pruebas (la parte que faltaba se incluye completa aquí)

> Nota: se adjuntó un archivo `README_LAB04_CONTROLLERS.md`, pero **no se pudo extraer su texto**.  
> **these documents can only be used in code execution**  
> Posibles razones: MIME type incorrecto, encoding no estándar, contenido no interpretado como texto plano o formato interno no reconocido por el extractor.

---

## 2. Objetivos
- Implementar el patrón **MVC** en Express.
- Crear un **controlador** estilo Laravel (`index`, `show`, `store`, `update`, `destroy`).
- Exponer un CRUD REST mínimo.
- Escribir **tests** tipo “Feature” (Laravel) usando **Jest + Supertest**.

---

## 3. Equivalencias Laravel ➜ Express

| Laravel | Node.js + Express |
|---|---|
| `Route::get('/posts', [PostController::class,'index'])` | `router.get('/posts', PostController.index)` |
| `php artisan make:controller PostController --resource` | Crear `controllers/PostController.js` (manual) |
| `Request $request` | `req` (Express request) |
| `return response()->json(...)` | `res.status(...).json(...)` |
| `Model::create()` | `store.create()` (o DB real) |
| Feature tests (PHPUnit) | Feature/integration tests (Jest + Supertest) |

---

## 4. Estructura de carpetas

Sugerida para LAB04:

```
src/
├─ app.js
├─ server.js
├─ routes/
│  ├─ api.js
│  └─ web.js
├─ controllers/
│  └─ PostController.js
├─ middleware/
│  └─ auth.js
└─ stores/
   └─ postStore.js

tests/
└─ feature/
   └─ posts.controller.test.js
```

---

## 5. Instalación

```bash
npm init -y
npm i express
npm i -D jest supertest
```

En `package.json`:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "test": "jest --runInBand"
  }
}
```

---

## 6. Implementación (código)

### 6.1 `src/app.js`

```js
const express = require('express')

const webRoutes = require('./routes/web')
const apiRoutes = require('./routes/api')

const app = express()
app.use(express.json())

app.use('/', webRoutes)
app.use('/api', apiRoutes)

module.exports = app
```

### 6.2 `src/server.js`

```js
const app = require('./app')

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

---

## 7. Persistencia en memoria (store)

En Laravel normalmente usarías Eloquent + DB. Para este laboratorio usamos un store en memoria.

### 7.1 `src/stores/postStore.js`

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

function create({ title, body, userId }) {
  const post = { id: id++, title, body, userId }
  posts.push(post)
  return post
}

function findById(postId) {
  return posts.find(p => p.id === Number(postId)) || null
}

function update(postId, { title, body }) {
  const post = findById(postId)
  if (!post) return null
  if (title !== undefined) post.title = title
  if (body !== undefined) post.body = body
  return post
}

function remove(postId) {
  const idx = posts.findIndex(p => p.id === Number(postId))
  if (idx === -1) return false
  posts.splice(idx, 1)
  return true
}

module.exports = {
  reset,
  all,
  create,
  findById,
  update,
  remove
}
```

---

## 8. Middleware de Auth (simple)

En Laravel usarías `auth` middleware. Aquí simulamos auth con header `x-user-id`.

### 8.1 `src/middleware/auth.js`

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

## 9. Controlador (estilo resource controller)

### 9.1 `src/controllers/PostController.js`

```js
const postStore = require('../stores/postStore')

exports.index = (req, res) => {
  res.status(200).json(postStore.all())
}

exports.show = (req, res) => {
  const post = postStore.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Not found' })
  res.status(200).json(post)
}

exports.store = (req, res) => {
  const { title, body } = req.body
  if (!title) return res.status(422).json({ message: 'title is required' })

  const post = postStore.create({
    title,
    body: body || '',
    userId: req.user.id
  })

  res.status(201).json({
    message: 'Post created successfully',
    data: post
  })
}

exports.update = (req, res) => {
  const updated = postStore.update(req.params.id, {
    title: req.body.title,
    body: req.body.body
  })

  if (!updated) return res.status(404).json({ message: 'Not found' })

  res.status(200).json({
    message: 'Post updated successfully',
    data: updated
  })
}

exports.destroy = (req, res) => {
  const ok = postStore.remove(req.params.id)
  if (!ok) return res.status(404).json({ message: 'Not found' })
  res.status(204).send()
}
```

---

## 10. Rutas

### 10.1 `src/routes/web.js`

```js
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).send('Inicio (LAB04)')
})

module.exports = router
```

### 10.2 `src/routes/api.js`

```js
const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const PostController = require('../controllers/PostController')

// Resource-like routes
router.get('/posts', auth, PostController.index)
router.get('/posts/:id', auth, PostController.show)
router.post('/posts', auth, PostController.store)
router.put('/posts/:id', auth, PostController.update)
router.delete('/posts/:id', auth, PostController.destroy)

module.exports = router
```

---

## 11. TESTS — Jest + Supertest

En Laravel, los tests de controladores suelen hacerse como **Feature Tests**.
Aquí hacemos lo equivalente probando HTTP contra `app` sin levantar un servidor real.

### 11.1 `tests/feature/posts.controller.test.js`

```js
const request = require('supertest')
const app = require('../../src/app')

const postStore = require('../../src/stores/postStore')

describe('PostController (feature)', () => {
  beforeEach(() => {
    // Equivalente a RefreshDatabase en Laravel
    postStore.reset()
  })

  test('guest cannot access posts (401)', async () => {
    const res = await request(app).get('/api/posts')
    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe('Unauthorized')
  })

  test('authenticated user can create a post (201)', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('x-user-id', '1')
      .send({ title: 'Hola', body: 'Contenido' })

    expect(res.statusCode).toBe(201)
    expect(res.body.message).toBe('Post created successfully')
    expect(res.body.data.title).toBe('Hola')
    expect(res.body.data.userId).toBe(1)
  })

  test('validates title required (422)', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('x-user-id', '1')
      .send({ body: 'sin titulo' })

    expect(res.statusCode).toBe(422)
    expect(res.body.message).toBe('title is required')
  })

  test('index returns created posts (200)', async () => {
    await request(app)
      .post('/api/posts')
      .set('x-user-id', '2')
      .send({ title: 'P1', body: 'B1' })

    const res = await request(app)
      .get('/api/posts')
      .set('x-user-id', '2')

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].title).toBe('P1')
  })

  test('show returns 404 when post does not exist', async () => {
    const res = await request(app)
      .get('/api/posts/999')
      .set('x-user-id', '1')

    expect(res.statusCode).toBe(404)
    expect(res.body.message).toBe('Not found')
  })

  test('update modifies a post (200)', async () => {
    const created = await request(app)
      .post('/api/posts')
      .set('x-user-id', '1')
      .send({ title: 'Antes', body: 'B' })

    const postId = created.body.data.id

    const res = await request(app)
      .put(`/api/posts/${postId}`)
      .set('x-user-id', '1')
      .send({ title: 'Después' })

    expect(res.statusCode).toBe(200)
    expect(res.body.data.title).toBe('Después')
  })

  test('destroy deletes a post (204)', async () => {
    const created = await request(app)
      .post('/api/posts')
      .set('x-user-id', '1')
      .send({ title: 'Borrar', body: '' })

    const postId = created.body.data.id

    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('x-user-id', '1')

    expect(res.statusCode).toBe(204)

    // Confirm deletion
    const res2 = await request(app)
      .get(`/api/posts/${postId}`)
      .set('x-user-id', '1')

    expect(res2.statusCode).toBe(404)
  })
})
```

---

## 12. Ejecución

### 12.1 Correr servidor

```bash
npm start
```

### 12.2 Ejecutar pruebas

```bash
npm test
```

---

## 13. Evidencias sugeridas
- Captura del árbol de carpetas.
- Captura de `npm test` pasando.
- Captura de al menos 1 request de creación (`POST /api/posts`) en Postman/Insomnia (opcional).

---

## 14. Conclusiones
- Los controladores en Express cumplen el mismo rol que en Laravel: encapsular lógica de endpoints.
- Separar `routes/` y `controllers/` mantiene el proyecto escalable.
- Con Jest + Supertest podemos replicar pruebas feature de Laravel sin una DB real.
- El store en memoria facilita TDD y pruebas reproducibles para laboratorio.
