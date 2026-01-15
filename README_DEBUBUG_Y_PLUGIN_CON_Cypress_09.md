# Práctica 9 — Debugg y “plugin” con Cypress (Laboratorio 09)

## 1. Propósito
Esta práctica refuerza el uso de Cypress para:

- **Delimitar la búsqueda de elementos** (por texto con `contains()` y por jerarquía padre-hijo con `parents()` + `find()`).
- **Evitar repetición de selectores** “guardando” elementos (reutilizando el contenedor y buscando dentro de él).
- **Crear aserciones** con `should()` y `expect()`.
- **Usar hooks** (`before`, `beforeEach`, `after`) para no repetir `visit()` y evitar errores como `about:blank` cuando se usa `it.only`.
- **Debuggear por consola** usando un **task** configurado en `cypress.config.js` y llamado con `cy.task('log', ...)`.

> Importante: Esta práctica se realiza **según el laboratorio** contra el sitio de ejemplo:
> - `https://demoqa.com/automation-practice-form`
> 
> **No se usa ninguna página local (`localhost`).**

## 2. Requisitos
- Node.js + npm
- Cypress instalado en el proyecto

Si aún no lo tienes instalado:

```bash
npm init -y
npm i -D cypress prettier
```

## 3. Configuración principal (`cypress.config.js`)

Configura:
- `baseUrl` apuntando a `https://demoqa.com/`
- `viewport` a 1920x1080
- exclusión de specs de ejemplo (si existen)
- el “plugin” (task) para debug: `on('task', { log })`

```js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
    e2e: {
        baseUrl: "https://demoqa.com/",
        excludeSpecPattern: ["**/1-getting-started/*.js", "**/2-advanced-examples/*.js"],
        viewportWidth: 1920,
        viewportHeight: 1080,
        testIsolation: false,

        setupNodeEvents(on, config) {
            // “Plugin” (task) para imprimir valores en consola/terminal
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

## 4. Soporte E2E (opcional): evitar fallos por excepciones no controladas

En `cypress/support/e2e.js` (si lo estás usando):

```js
Cypress.on("uncaught:exception", (err, runnable) => {
    return false
})
```

> Úsalo con criterio: puede ocultar errores reales del sistema bajo prueba.

## 5. Specs de la práctica

Crea (o actualiza) estos archivos en `cypress/e2e/`.

### 5.1 `tipoDeLocalizadores.cy.js` — Delimitación de búsqueda

Incluye ejemplos del laboratorio:
- `cy.contains('Reading')`
- combinación: `cy.contains('.header-wrapper', 'Widgets')`
- padre-hijo: `parents('form').find('label')`

```js
describe("Tipos de localizadores + Delimitación de búsqueda (Lab 09)", () => {
    beforeEach(() => {
        cy.visit("/automation-practice-form")
    })

    it("Usando contains (por texto)", () => {
        cy.contains("Reading")
        cy.contains(".header-wrapper", "Widgets")
    })

    it("Usando parent/parents + find (padre-hijo)", () => {
        cy.get('input[placeholder="First Name"]')
            .parents("form")
            .find("label")
    })
})
```

### 5.2 `guardandoElementos.cy.js` — Guardar elementos (evitar repetición)

Primero se automatiza evitando repetir selectores, luego se agrega debug con `cy.task`.

```js
describe("Guardando elementos con Cypress (Lab 09)", () => {
    it("Evitar Repeticion + Debug con task(log)", () => {
        cy.visit("/automation-practice-form")

        cy.get('input[placeholder="First Name"]')
            .parents("form")
            .find("input")
            .then((inputs) => {
                // Debug: ver la cantidad real de inputs en la terminal
                cy.task("log", inputs.length)

                // Aserción esperada en el laboratorio
                expect(inputs.length).to.eq(15)
            })
    })
})
```

### 5.3 `aserciones.cy.js` — Aserciones + Hooks

Incluye:
- `should('include', 'demoqa.com')`
- `should('be.visible')` y `should('have.attr', ...)`
- automatización con `then()` + `expect()`
- `before()` para evitar repetir `visit()` y permitir `it.only`
- `after()` para visitar `/` al final

```js
describe("Aserciones con Cypress + Hooks (Lab 09)", () => {
    before(() => {
        cy.visit("/automation-practice-form")
    })

    it("Asercion: URL incluye demoqa.com", () => {
        cy.url().should("include", "demoqa.com")
    })

    it("Asercion: firstName visible y placeholder correcto", () => {
        cy.get("#firstName")
            .should("be.visible")
            .should("have.attr", "placeholder", "First Name")
    })

    it("Asercion Automatizada (expect con then)", () => {
        cy.get("#firstName").then((element) => {
            expect(element).to.be.visible
            expect(element).to.have.attr("placeholder", "First Name")
        })
    })

    after(() => {
        cy.visit("/")
    })
})
```

## 6. Ejecución

### 6.1 Abrir Cypress (modo interactivo)

```bash
npx cypress open
```

En la interfaz:
1. Selecciona **E2E Testing**
2. Elige un navegador
3. Ejecuta los specs:
   - `tipoDeLocalizadores.cy.js`
   - `guardandoElementos.cy.js`
   - `aserciones.cy.js`

### 6.2 Ver logs del “plugin” (task)

- Ejecuta `guardandoElementos.cy.js`.
- Observa la **terminal** donde lanzaste Cypress: debería aparecer algo como:
  - `Mensaje del console log del task 15`

Si no lo ves, reinicia Cypress (cerrar y volver a ejecutar `npx cypress open`) o reinicia la terminal.

## 7. Resultado esperado
- Cypress puede localizar elementos por texto (`contains`) y por estructura (padre-hijo).
- Se reduce repetición al trabajar desde el contenedor (por ejemplo, el `form`).
- Se validan condiciones con aserciones (`should`, `expect`).
- Se usa el “plugin” (task) para **debug en consola** con `cy.task('log', ...)`.
