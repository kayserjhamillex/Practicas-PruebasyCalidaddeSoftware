# Laboratorio 01: Introducción a Rutas con Express.js

Este proyecto implementa en **Node.js** con **Express** la práctica de **rutas** vista originalmente en PHP/Laravel (archivo `routes/web.php`).

## Objetivos

- Comprender el concepto de **rutas** y su relación con URLs.
- Implementar rutas con distintos **métodos HTTP** (GET/POST/PUT/DELETE).
- Usar **parámetros** en rutas (incluyendo opcionales).
- Aplicar **validaciones** con expresiones regulares (middleware).
- Definir el set de rutas necesarias para un **CRUD** (Posts).

## Requisitos

- Node.js (recomendado: v18+)
- NPM
- Visual Studio Code
- Postman o Thunder Client (para probar POST/PUT/DELETE)

## Instalación

```bash
mkdir lab01-rutas-express
cd lab01-rutas-express
npm init -y
npm install express
npm install --save-dev nodemon
```

## Scripts recomendados (`package.json`)

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

## Ejecutar el servidor

```bash
npm run dev
```

Servidor disponible en: [http://localhost:8000](http://localhost:8000)

> Si tu puerto es diferente, revisa la constante `PORT` en `app.js`.

## Rutas implementadas

### 1) Rutas básicas

- `GET /` → `Hola desde la página de inicio`
- `GET /contacto` → `Hola desde la página de contacto`

### 2) Ruta con múltiples métodos (equivalente a `Route::match`)

- `GET /contacto`
- `POST /contacto`

### 3) Rutas con parámetros

- `GET /cursos/:curso` → muestra el valor del parámetro `curso`.
- `GET /cursos/:curso/:categoria?` → segundo parámetro opcional.

**Importante (TOP-DOWN):**

Las rutas se evalúan de **arriba hacia abajo**. Por eso, rutas estáticas como:

- `GET /cursos/informacion`

Deben declararse **antes** que rutas dinámicas como:

- `GET /cursos/:curso`

para evitar que `informacion` sea interpretado como un parámetro.

### 4) Validaciones con expresiones regulares (middleware)

Se incluyen middlewares equivalentes a:

- `whereAlpha` (solo letras)
- `whereNumber` (solo números)
- `whereIn` (valor dentro de una lista)

Ejemplos:

- `GET /cursos-alpha/:curso` (solo letras)
- `GET /cursos-id/:id` (solo números)
- `GET /cursos-validos/:curso` (solo lista permitida)

### 5) Rutas necesarias para CRUD (Posts)

- `GET /posts` (Index)
- `GET /posts/create` (Create form)
- `POST /posts` (Store)
- `GET /posts/:post` (Show)
- `GET /posts/:post/edit` (Edit form)
- `PUT /posts/:post` (Update)
- `DELETE /posts/:post` (Delete)

## Pruebas rápidas (manual)

- Abre en el navegador: [http://localhost:8000](http://localhost:8000)
- Prueba `GET /contacto`: [http://localhost:8000/contacto](http://localhost:8000/contacto)
- Prueba parámetros:
  - [http://localhost:8000/cursos/Calidad_software](http://localhost:8000/cursos/Calidad_software)
  - [http://localhost:8000/cursos/Calidad_software/Ingenieria_sistemas](http://localhost:8000/cursos/Calidad_software/Ingenieria_sistemas)

## Notas

- Express no trae “Route List” como `php artisan route:list`, pero puedes:
  - mantener rutas en archivos separados (ej. `routes/web.js`)
  - usar logging middleware para ver cada request
  - (opcional) instalar paquetes de tooling si tu curso lo permite

---
**Curso:** Pruebas y Calidad de Software  
**Laboratorio:** 01 - Rutas  
**Adaptación:** Node.js + Express
