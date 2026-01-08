# Laboratorio 04: Manejo de Controladores (Laravel → Node.js + Express)

Este documento adapta la **Práctica/Laboratorio 04 (Controladores en Laravel)** a un proyecto en **Node.js con Express (v5.2.1)**, integrándolo con lo ya trabajado en **Práctica 2 (API + TDD)** y **Práctica 1 (rutas)**.

## 1) Objetivo

- Aplicar el patrón **MVC** en Express separando:
  - **Rutas** (definición de endpoints)
  - **Controladores** (lógica por endpoint)
  - *(Opcional más adelante)* Modelos/servicios para la lógica de datos

- Implementar un **CRUD** de `posts` usando **controladores**, similar a Laravel.

## 2) Requisitos

- Node.js (recomendado LTS)
- NPM
- Dependencias del proyecto:
  - `express` (v5.2.1)
  - `jest` + `supertest` para tests
  - `nodemon` para desarrollo

## 3) Instalación y ejecución

En la carpeta del proyecto:

```bash
npm install
```

Ejecutar en desarrollo:

```bash
npm run dev
```

Ejecutar tests:

```bash
npm test
```

Ejecutar un test específico (por nombre):

```bash
npm run test:filter "PostController"
```

## 4) Estructura del proyecto (MVC en Express)

Se recomienda la siguiente estructura:

```text
proyecto/
├── package.json
├── src/
│   ├── server.js
│   ├── app.js
│   ├── controllers/
│   │   ├── HomeController.js
│   │   └── PostController.js
│   ├── middleware/
│   │   └── validations.js
│   └── routes/
│       ├── web.js
│       └── api.js
└── tests/
    └── feature/
        ├── helloWorldApi.test.js
        ├── webRoutes.test.js
        └── postController.test.js
```

## 5) Controladores (equivalencias con Laravel)

### 5.1) HomeController (equivalente a `__invoke` / dashboard)

En Laravel se puede usar un controlador invokable cuando solo existe `index`. En Express esto se representa con un controlador con un método `index` (o directamente una función).

**Archivo:** `src/controllers/HomeController.js`

- Método: `index(req, res)`
- Respuesta: `"Hola desde la página principal"`

### 5.2) PostController (CRUD)

En Laravel se crea un controlador con:

```bash
php artisan make:controller PostController
```

y luego se implementan los métodos:

- `index`
- `create`
- `store`
- `show($post)`
- `edit($post)`
- `update($post)`
- `destroy($post)`

En Express la equivalencia es un archivo como:

**Archivo:** `src/controllers/PostController.js`

Con métodos:

- `index(req, res)`
- `create(req, res)`
- `store(req, res)`
- `show(req, res)` (lee `req.params.post`)
- `edit(req, res)`
- `update(req, res)`
- `destroy(req, res)`

## 6) Rutas con Controladores

### 6.1) Ruta principal usando HomeController

**Laravel:**

```php
Route::get('/', [HomeController::class, 'index']);
```

**Express:**

- `GET /` → `HomeController.index`

### 6.2) Route Resource (Laravel) → rutas agrupadas (Express)

**Laravel (resource):**

```php
Route::resource('posts', PostController::class);
```

En Express, **no existe** un `Route::resource` nativo, pero se logra con rutas equivalentes.

En el PDF se muestra además:
- Cambiar prefijo a español: `articulos`
- Cambiar el nombre de parámetro a inglés: `{post}`
- Cambiar verbos `create/edit` a `crear/editar`

**Express (equivalente recomendado en este laboratorio):**

Prefijo: `/articulos`

- `GET /articulos` → `PostController.index`
- `GET /articulos/crear` → `PostController.create`
- `POST /articulos` → `PostController.store`
- `GET /articulos/:post` → `PostController.show`
- `GET /articulos/:post/editar` → `PostController.edit`
- `PUT /articulos/:post` → `PostController.update`
- `DELETE /articulos/:post` → `PostController.destroy`

> Nota Express 5.2.1: evita rutas con parámetros opcionales tipo `/:categoria?` si te generan error. Define rutas explícitas.

## 7) Nombres de rutas (Laravel `->name()`)

Laravel permite:

```php
->name('posts.index')
```

Express no requiere nombres, pero puedes documentarlas (o usar constantes) como:

- `posts.index` → `GET /articulos`
- `posts.create` → `GET /articulos/crear`
- `posts.store` → `POST /articulos`
- `posts.show` → `GET /articulos/:post`
- `posts.edit` → `GET /articulos/:post/editar`
- `posts.update` → `PUT /articulos/:post`
- `posts.destroy` → `DELETE /articulos/:post`

## 8) Pruebas (TDD básico para Controladores)

Se agrega un archivo de pruebas para validar que las rutas web del CRUD están conectadas correctamente al controlador.

**Archivo:** `tests/feature/postController.test.js`

Pruebas incluidas (ejemplos):

- `GET /articulos` devuelve 200
- `GET /articulos/crear` devuelve 200
- `POST /articulos` devuelve 200
- `GET /articulos/123` contiene `123`
- `GET /articulos/123/editar` contiene `editar`
- `PUT /articulos/123` devuelve 200
- `DELETE /articulos/123` devuelve 200

## 9) Checklist de entrega

- [ ] Carpeta `src/controllers/` creada
- [ ] `HomeController.js` creado y usado en `GET /`
- [ ] `PostController.js` creado con métodos CRUD
- [ ] Rutas `/articulos` conectadas a `PostController`
- [ ] Tests ejecutan sin error con `npm test`

## 10) Referencia rápida (Laravel vs Express)

| Concepto | Laravel | Express |
|---|---|---|
| Crear controlador | `php artisan make:controller XController` | Crear archivo en `src/controllers/XController.js` |
| Route resource | `Route::resource('posts', XController::class)` | Definir rutas explícitas en `router` |
| Invokable | `__invoke()` | Función handler / método único |
| Prefix/Group | `Route::prefix()->group()` | `router` modular + prefijos con `app.use('/x', router)` |
| Nombres de rutas | `->name('posts.index')` | Documentación / constantes (opcional) |

