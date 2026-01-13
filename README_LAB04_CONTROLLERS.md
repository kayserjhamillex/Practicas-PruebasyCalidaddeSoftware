
# Laboratorio 04 – Controladores (Node.js + Express)

## Contexto
Este laboratorio es la **adaptación del Laboratorio 04 de Laravel (Controladores)** a **Node.js con Express**, partiendo de la **Práctica 2 (API REST con TDD)** ya migrada desde PHP.

Se aplica el patrón **MVC**, separando:
- **Routes**: definición de endpoints
- **Controllers**: lógica de negocio
- **Models (simulado)**: datos (en memoria)

---

## Estructura del proyecto

```
src/
 ├── controllers/
 │   ├── home.controller.js
 │   └── post.controller.js
 ├── routes/
 │   ├── web.routes.js
 │   └── api.routes.js
 ├── app.js
 └── server.js
```

---

## HomeController (Invoke en Laravel → función directa en Express)

```js
// src/controllers/home.controller.js
exports.index = (req, res) => {
  res.send('Hola desde la página principal');
};
```

```js
// src/routes/web.routes.js
const express = require('express');
const HomeController = require('../controllers/home.controller');

const router = express.Router();
router.get('/', HomeController.index);

module.exports = router;
```

---

## PostController – CRUD completo

```js
// src/controllers/post.controller.js
let posts = [];
let id = 1;

exports.index = (req, res) => {
  res.json(posts);
};

exports.create = (req, res) => {
  res.send('Aquí se mostrará el formulario para crear un post');
};

exports.store = (req, res) => {
  const post = { id: id++, title: req.body.title || 'Sin título' };
  posts.push(post);
  res.status(201).json(post);
};

exports.show = (req, res) => {
  const post = posts.find(p => p.id == req.params.post);
  res.json(post || { error: 'Post no encontrado' });
};

exports.edit = (req, res) => {
  res.send(`Formulario para editar el post ${req.params.post}`);
};

exports.update = (req, res) => {
  const post = posts.find(p => p.id == req.params.post);
  if (!post) return res.status(404).json({ error: 'No encontrado' });
  post.title = req.body.title;
  res.json(post);
};

exports.destroy = (req, res) => {
  posts = posts.filter(p => p.id != req.params.post);
  res.json({ message: 'Post eliminado' });
};
```

---

## Routes tipo Resource (equivalente a Route::resource)

```js
// src/routes/web.routes.js
const express = require('express');
const PostController = require('../controllers/post.controller');

const router = express.Router();

router.get('/posts', PostController.index);
router.get('/posts/create', PostController.create);
router.post('/posts', PostController.store);
router.get('/posts/:post', PostController.show);
router.get('/posts/:post/edit', PostController.edit);
router.put('/posts/:post', PostController.update);
router.delete('/posts/:post', PostController.destroy);

module.exports = router;
```

---

## Grupo de rutas con prefijo (similar a Route::prefix)

```js
router.use('/posts', (req, res, next) => next());
```

(En Express el prefijo se maneja normalmente al montar el router)

```js
app.use('/', webRoutes);
```

---

## Comparación Laravel vs Express

| Laravel | Express |
|-------|--------|
| Controller PHP | Controller JS |
| Route::resource | CRUD manual |
| __invoke() | función directa |
| Route::prefix | app.use('/prefijo') |

---

## Conclusión

Este laboratorio demuestra cómo **los controladores de Laravel se traducen directamente a controladores en Express**, manteniendo:
- Separación de responsabilidades
- Organización MVC
- Escalabilidad del proyecto

La migración PHP → Node.js es **conceptual**, no sintáctica.

---

**Laboratorio 04 – Controladores**
Universidad Continental
