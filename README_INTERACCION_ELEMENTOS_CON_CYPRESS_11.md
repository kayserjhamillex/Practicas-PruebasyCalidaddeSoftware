# Práctica 11 — Interacción con elementos en Cypress (acoplada a Práctica 9)

## 1. Objetivo
En esta práctica se amplía lo realizado en la **Práctica 9** (localizadores, aserciones, hooks, debug con `cy.task`) para incorporar lo indicado en el material de **Práctica 11**:

- **Tipos de espera** en Cypress:
  - `cy.wait(ms)` (espera fija)
  - `cy.get(selector, { timeout: ms })` (espera implícita con timeout)
  - espera + aserción: `cy.get(...).should('be.visible')`
  - deshabilitar “retry” con `timeout: 0`
- **Modos de ejecución**:
  - UI: `cypress open`
  - Headless: `cypress run`
  - Headless con navegador específico (ej. Firefox)
  - ejecutar solo **un spec** (un archivo)
- (Opcional) **Video** en ejecución headless: `video: true`
- (Opcional) forzar navegador por spec con `describe(..., { browser: 'edge' })` o excluir con `{ browser: '!edge' }`

> Restricción solicitada: **no se usa localhost**. Se trabaja con URLs públicas del material:
> - `https://ucontinental.edu.pe/` (para pruebas de espera)
> - `https://demoqa.com/automation-practice-form` (para localizadores/aserciones de Práctica 9)

## 2. Archivos que se agregan/actualizan

- `cypress.config.js` (baseUrl, tasks, video, viewport)
- `cypress/e2e/esperandoPorElementos.cy.js` (nuevo)
- `package.json` (scripts de ejecución)

## 3. Configuración (`cypress.config.js`)

### 3.1 Base URL
Para esta práctica usaremos **DemoQA** como `baseUrl` (porque la práctica 9 trabaja allí).
Cuando necesitemos ir a la web de la universidad, usaremos `cy.visit('https://ucontinental.edu.pe/')` completo.

### 3.2 Agregar `video: true` y el task `log`

```js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
    e2e: {
        baseUrl: "https://demoqa.com/",
        excludeSpecPattern: ["**/1-getting-started/*.js", "**/2-advanced-examples/*.js"],
        viewportWidth: 1920,
        viewportHeight: 1080,
        testIsolation: false,

        // Habilitar videos en headless (cambie a false si no desea videos)
        video: true,

        setupNodeEvents(on, config) {
            // "Plugin" (task) para imprimir valores en consola/terminal
            on("task", {
                log(message) {
                    console.log("Mensaje del console log del task", message)
                    return null
                },
            })

            return config
        },
    },
})
```

## 4. Spec principal de la práctica: `esperandoPorElementos.cy.js`

Cree el archivo:

`cypress/e2e/esperandoPorElementos.cy.js`

Incluye los casos del material:

1) **Espera fija** `cy.wait(5000)`
2) **Buscar elemento con timeout** `cy.get(selector, { timeout: 6000 })`
3) **Timeout + aserción** `.should('be.visible')`
4) **Deshabilitar retry** usando `timeout: 0`

```js
describe("Esperando por elementos (Práctica 11)", () => {
    beforeEach(() => {
        cy.visit("https://ucontinental.edu.pe/")
    })

    // Prueba No Funcional - Tiempo de ejecución
    it("Esperar por un tiempo definido", () => {
        cy.wait(5000)
    })

    // Prueba para buscar un elemento con tiempo de espera
    it("Buscar elemento con timeout", () => {
        cy.get(".swiper-button-next", { timeout: 6000 })
    })

    // Prueba para buscar un elemento y aserción con tiempo de espera
    it("Buscar elemento con timeout y verificar visibilidad", () => {
        cy.get(".swiper-button-next", { timeout: 6000 }).should("be.visible")
    })
})

// Si se desea deshabilitar el retry, se hace con timeout: 0
// (se deja en un describe separado para evidenciar el caso)
describe("Esperando por elementos (Deshabilitar Retry)", () => {
    beforeEach(() => {
        cy.visit("https://ucontinental.edu.pe/")
    })

    it("Deshabilitar el Retry", () => {
        // timeout: 0 = no reintenta, falla inmediatamente si no encuentra
        cy.get(":nth-child(3) > :nth-child(1) > .card-body", { timeout: 0 })
    })
})
```

> Nota: Los selectores `.swiper-button-next` y `:nth-child(3) > :nth-child(1) > .card-body` provienen del material.

## 5. Scripts de ejecución (`package.json`)

Agregar scripts como en el material:

```json
{
    "scripts": {
        "test:ui": "cypress open",
        "test:headlees": "cypress run",
        "test:headlees:firefox": "cypress run --browser firefox",
        "test:headless:solo": "cypress run --browser firefox --spec cypress/e2e/navegacion.cy.js"
    }
}
```

> Nota: En el material aparece `headlees` (con error tipográfico). Puedes mantenerlo para coincidir con la guía del curso o corregirlo a `headless`.

## 6. Modos de ejecución

### 6.1 UI (Interactivo)

```bash
npm run test:ui
```

### 6.2 Headless (Consola)

```bash
npm run test:headlees
```

### 6.3 Headless en Firefox

```bash
npm run test:headlees:firefox
```

### 6.4 Ejecutar solo un spec (un archivo)

```bash
npm run test:headless:solo
```

## 7. (Opcional) Forzar/Excluir navegador a nivel de spec

Ejemplo (según el material): ejecutar un spec solo en Edge:

```js
describe("Navegacion", { browser: "edge" }, () => {
    it("Navegar a nuestra primer página", () => {
        cy.visit("https://www.google.com/")
    })
})
```

Ejemplo: ejecutar en todos menos en Edge:

```js
describe("Navegacion", { browser: "!edge" }, () => {
    it("Navegar a nuestra primer página", () => {
        cy.visit("https://www.google.com/")
    })
})
```

## 8. Resultado esperado
- El proyecto incluye una prueba **no funcional** por tiempos de espera.
- Se entiende la diferencia entre espera fija y espera con `timeout`.
- Se ejecutan pruebas tanto en UI como en modo headless.
- En headless se generan videos si `video: true`.
