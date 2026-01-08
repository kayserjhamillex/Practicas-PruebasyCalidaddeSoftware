# Laboratorio 02: Desarrollo de API REST con TDD (Node.js + Express)

Este proyecto implementa la práctica de **API REST** con enfoque **TDD** (Test-Driven Development) en **Node.js** usando:

- **Express** para rutas API
- **Jest** como framework de pruebas
- **Supertest** para hacer requests HTTP a la app en tests

## Objetivos

- Implementar una ruta API `GET /api/hello-world` que retorne JSON.
- Aplicar el ciclo TDD:
  - **Red:** escribir un test que falla
  - **Green:** implementar lo mínimo para que pase
  - **Refactor:** mejorar manteniendo tests verdes
- Aprender a ejecutar pruebas y filtrar por nombre.

## Requisitos

- Node.js (recomendado: v18+)
- NPM

## Instalación

```bash
mkdir lab02-api-tdd
cd lab02-api-tdd
npm init -y
npm install express
npm install --save-dev jest supertest nodemon
```

## Scripts recomendados (`package.json`)

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:filter": "jest -t"
  }
}
```

## Estructura recomendada

```text
lab02-api-tdd/
  src/
    app.js        # Express app (exportable para tests)
    server.js     # Levanta el servidor
    routes/
      api.js      # Rutas bajo /api
  tests/
    feature/
      helloWorldApi.test.js
```

## Implementación requerida

### Ruta API: Hello World

- Endpoint: `GET /api/hello-world`
- Respuesta esperada (exacta):

```json
{ "msg": "Hello, World!" }
```

> En TDD, el string debe coincidir exactamente (mayúsculas, espacios, signos, etc.).

## Ejecutar el servidor

```bash
npm run dev
```

Servidor disponible en: [http://localhost:3000](http://localhost:3000)

## Ejecutar tests

```bash
npm test
```

## Ejecutar un test específico (equivalente a `php artisan test --filter ...`)

```bash
npm run test:filter hello_world_route_should_return_status_success
```

## Ejemplo de test (Given/When/Then)

En el laboratorio original se usa:

- **Teniendo** (Given)
- **Haciendo** (When)
- **Esperando** (Then)

En Jest se replica igual dentro del test.

## Nota sobre middleware de autenticación

En el laboratorio de Laravel, una prueba fallaba por middleware (login/redirect). En Express, el equivalente es:

- Proteger una ruta con un middleware `auth`
- Ejecutar el test sin token → debe fallar (401)
- Ajustar test o ruta → debe pasar

Esto es útil para practicar TDD con casos de autorización.

---
**Curso:** Pruebas y Calidad de Software  
**Laboratorio:** 02 - API REST con TDD  
**Adaptación:** Node.js + Express + Jest/Supertest
