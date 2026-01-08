# Laboratorio 06: Pruebas FrontEnd con Cypress (adaptación a Node.js)

Este documento adapta la **Práctica 6 (Pruebas FrontEnd con Cypress)** a un entorno **Node.js**.

> Indicaste: *“dejamos todo a un lado y arrancamos a partir de la práctica 3; acoplamos lo siguiente que está en esta práctica 6”*.  
En esta práctica nos enfocamos **solo en Cypress (E2E)** y en cómo conectarlo a una app web (tu práctica 3) o, si aún no hay UI propia, a una web externa como ejemplo.

## 1) Objetivo

- Configurar un proyecto de **Cypress E2E**.
- Crear pruebas de **navegación** y **localización de elementos** (selectors) con:
  - Tag (etiqueta HTML)
  - ID
  - Clase
  - Atributo (ej: `placeholder`)
  - Combinación etiqueta + atributo
- Ajustar viewport (ej: 1920x1080).
- Evitar correr specs de ejemplo (`excludeSpecPattern`).

## 2) Requisitos

- Node.js (LTS recomendado)
- NPM
- Visual Studio Code

Dependencias (dev):
- `cypress`
- `prettier`

## 3) Crear proyecto Cypress desde cero

### 3.1) Crear carpeta del proyecto

Crea una carpeta (ejemplo): `cypress_ui`.

### 3.2) Inicializar NPM

En terminal dentro de la carpeta:

```bash
npm init -y
```

#### Problema común en Windows (ExecutionPolicy)
Si ves error del tipo *“npm.ps1 cannot be loaded because running scripts is disabled…”*, abre PowerShell como administrador y ejecuta:

```powershell
Set-ExecutionPolicy Unrestricted
```

Luego vuelve a intentar `npm init -y`.

### 3.3) Instalar Cypress y Prettier

```bash
npm i -D cypress prettier
```

## 4) Configurar Prettier

Crea un archivo **`.prettierrc`** en la raíz del proyecto con:

```json
{
	"semi": false,
	"singleQuote": false,
	"bracketSpacing": true,
	"useTabs": true,
	"tabWidth": 4,
	"trailingComma": "es5"
}
```

## 5) Abrir Cypress por primera vez

```bash
npx cypress open
```

- Selecciona **E2E Testing**.
- Continúa con la configuración por defecto.
- Elige un navegador (Edge/Electron/Firefox).

Esto crea, por ejemplo:
- `cypress/`
- `cypress.config.js`
- `cypress/support/e2e.js`

## 6) Configuración recomendada en `cypress.config.js`

### 6.1) Excluir specs de ejemplo

Agrega en `e2e`:

- `excludeSpecPattern` para evitar ejecutar ejemplos (`1-getting-started`, `2-advanced-examples`).

### 6.2) Viewport 1920x1080

Agrega:

- `viewportWidth: 1920`
- `viewportHeight: 1080`

### 6.3) Base URL

Para no repetir la raíz en cada `cy.visit()`, define `baseUrl`.

Ejemplo (demo):

- `baseUrl: 'https://demoqa.com'`

Si lo acoplas a tu práctica 3, usa algo como:

- `baseUrl: 'http://localhost:3000'` (si tu app corre ahí)

### 6.4) Ejemplo completo

```js
const { defineConfig } = require('cypress')

module.exports = defineConfig({
	e2e: {
		baseUrl: 'https://demoqa.com',
		excludeSpecPattern: ['**/1-getting-started/*.js', '**/2-advanced-examples/*.js'],
		viewportWidth: 1920,
		viewportHeight: 1080,
		testIsolation: false,
		setupNodeEvents(on, config) {
			// listeners opcionales
		},
	},
})
```

> Nota: `testIsolation: false` aparece en la práctica para mantener estado en navegación. Úsalo solo si realmente lo necesitas.

## 7) Configuración global: evitar que falle por exceptions

En `cypress/support/e2e.js` agrega (si tu web lanza errores que no quieres que rompan el test):

```js
Cypress.on('uncaught:exception', (err, runnable) => {
	return false
})
```

## 8) Pruebas de navegación (E2E)

Crea en `cypress/e2e/`:

### 8.1) `primerTest.cy.js`

```js
describe('Primer Prueba', () => {
	it('Navegar a nuestra primer página', () => {
		cy.visit('https://www.google.com/')
	})
})
```

### 8.2) Pruebas anidadas (ejemplo)

```js
describe('Primer Prueba', () => {
	it('Navegar a Google', () => {
		cy.visit('https://www.google.com/')
	})

	it('Navegar a Youtube', () => {
		cy.visit('https://www.youtube.com/')
	})

	describe('Primera Prueba Anidada', () => {
		it('Volver a Google', () => {
			cy.visit('https://www.google.com/')
		})

		it('Ir a plataforma académica', () => {
			cy.visit('https://ucontinental.edu.pe/')
		})
	})
})
```

> Importante: Cypress tiene restricciones de seguridad con **cross-origin**. Si cambias de dominio dentro del mismo test, algunas acciones como `cy.go('back')` pueden fallar.

### 8.3) `navegacion.cy.js` (visit + reload)

Si usas `baseUrl`, ya no repites dominio:

```js
describe('Navegación', () => {
	it('Navegar a nuestra primer página', () => {
		cy.visit('/automation-practice-form')
	})

	it('Recargar página', () => {
		cy.reload()
	})

	it('Recargar página de forma forzada', () => {
		cy.reload(true)
	})
})
```

## 9) Navegar hacia atrás/adelante

### 9.1) Error típico (cross-origin)

Si haces:

```js
cy.visit('https://www.google.com/')
cy.visit('https://www.youtube.com/')
cy.go('back')
```

Puedes ver:
- `SecurityError: Permission denied to access property 'history' on cross-origin object`

### 9.2) Solución: mantener el mismo dominio

Ejemplo (mismo dominio Google):

```js
describe('Navegación historial', () => {
	it('Navegar hacia atrás', () => {
		cy.visit('https://www.google.com/')
		cy.visit('https://www.google.com/search?q=youtube')
		cy.go('back') // también puedes usar cy.go(-1)
	})

	it('Navegar hacia adelante', () => {
		cy.visit('https://www.google.com/')
		cy.visit('https://www.google.com/search?q=youtube')
		cy.go('back')
		cy.go('forward') // también puedes usar cy.go(+1)
	})
})
```

## 10) Tipos de localizadores (selectors)

Crea `cypress/e2e/tipoDeLocalizadores.cy.js`.

### 10.1) Por etiqueta (tag)

```js
describe('Tipos de localizadores', () => {
	it('Obtenerlo por medio de una etiqueta (BUTTON, INPUT, LABEL, etc.)', () => {
		cy.visit('/automation-practice-form')
		cy.get('input')
	})
})
```

### 10.2) Por atributo

```js
it('Obtenerlo por medio de un atributo', () => {
	cy.visit('/automation-practice-form')
	cy.get('[placeholder="First Name"]')
})
```

### 10.3) Etiqueta + atributo

```js
it('Obtenerlo por medio de una Etiqueta y un Atributo', () => {
	cy.visit('/automation-practice-form')
	cy.get('input[placeholder="Last Name"]')
})
```

### 10.4) Por ID

```js
it('Obtenerlo por medio de su ID', () => {
	cy.visit('/automation-practice-form')
	cy.get('#userEmail')
})
```

### 10.5) Por clase

```js
it('Obtenerlo por medio de una clase', () => {
	cy.visit('/automation-practice-form')
	cy.get('.col-md-3')
})
```

### 10.6) Por múltiples clases

```js
it('Obtenerlo por medio de varias clases', () => {
	cy.visit('/automation-practice-form')
	cy.get('.col-md-4.col-sm-6')
})
```

## 11) Scripts recomendados en `package.json`

Agrega:

```json
{
	"scripts": {
		"cypress:open": "cypress open",
		"cypress:run": "cypress run"
	}
}
```

Ejecutar:

```bash
npm run cypress:open
```

## 12) Checklist de entrega (LAB06)

- [ ] Proyecto inicializado con `npm init -y`
- [ ] Cypress instalado (`npm i -D cypress`)
- [ ] Prettier instalado y `.prettierrc` creado
- [ ] `cypress.config.js` con:
  - [ ] `excludeSpecPattern`
  - [ ] `viewportWidth` / `viewportHeight`
  - [ ] `baseUrl`
- [ ] Specs creados:
  - [ ] `primerTest.cy.js`
  - [ ] `navegacion.cy.js`
  - [ ] `tipoDeLocalizadores.cy.js`
- [ ] Pruebas ejecutadas desde UI con `npx cypress open`

## 13) Nota sobre “pasar de Laravel a Node”

Este LAB06 no depende directamente de Laravel/PHP; Cypress prueba el **FrontEnd** en el navegador.
Lo que sí se adapta a Node/Express es:

- cómo levantar tu app (ej: `http://localhost:3000`)
- definir `baseUrl` para apuntar a tu app
- mantener IDs, placeholders y nombres consistentes en tu HTML para facilitar testing

