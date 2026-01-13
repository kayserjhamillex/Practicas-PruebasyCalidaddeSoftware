# Práctica 03 — Introducción al Uso de Cypress

> Basado en **Laboratorio 03: Introducción al Uso de Cypress** (archivo `L03 Introducción al uso de Cypress.pdf`).

## 1. Objetivo

- Comprender qué es **Cypress** y sus características principales.
- Instalar y configurar Cypress en un proyecto Node.js.
- Crear y ejecutar pruebas **E2E (End-to-End)** básicas.
- Validar el título de una página web con casos de prueba positivos y negativos.

## 2. ¿Qué es Cypress?

**Cypress** es un framework de pruebas de extremo a extremo (E2E) diseñado para realizar pruebas automatizadas en aplicaciones web modernas.

### 2.1 Características principales

- **Facilidad de uso**: sintaxis intuitiva y basada en comandos encadenados.
- **Ejecución en tiempo real**: proporciona una actualización visual en la interfaz de usuario.
- **Aserciones y visualizaciones**: ofrece una amplia forma de verificar el estado de los elementos.
- **Control de tiempo y eventos**: manipula el tiempo en la aplicación durante las pruebas.

### 2.2 Comparación con otros frameworks

| Características | Cypress | Jest | Selenium |
|---|---|---|---|
| Comunicación punto a punto (e2e) | ✅ | ❌ | ✅ |
| Simulación de interacción del usuario con el sistema | ✅ | ❌ | ✅ |
| Interacción con el navegador | ✅ | ❌ | ✅ |
| Pruebas unitarias | ❌ | ✅ | ❌ |
| Interacción con el DOM | ✅ | ❌ | ✅ |

## 3. Requisitos previos

- **Node.js** instalado (versión 18+ recomendada).
- **npm** (viene con Node.js).
- Editor de código (recomendado: **Visual Studio Code**).

## 4. Instalación de Cypress

### 4.1 Crear carpeta del proyecto

```bash
mkdir cypress
cd cypress
```

### 4.2 Inicializar npm

```bash
npm init -y
```

Esto creará el archivo `package.json`.

### 4.3 Instalar Cypress

```bash
npm install cypress --save-dev
```

Esto instalará Cypress como dependencia de desarrollo.

## 5. Configuración de Cypress

### 5.1 Agregar script en `package.json`

Edita `package.json` y agrega:

```json
{
  "scripts": {
    "cy:open": "cypress open"
  }
}
```

### 5.2 Abrir Cypress por primera vez

```bash
npm run cy:open
```

O también:

```bash
npx cypress open
```

### 5.3 Configuración inicial

1. **Permitir acceso**: tu equipo pedirá validar y permitir acceso para hacer uso de la IDE Cypress. Elige **"Continue"**.
2. **Elegir tipo de prueba**: verás dos opciones:
   - **E2E Testing** (elegir esta)
   - Component Testing
3. **Configuración de archivos**: Cypress creará automáticamente:
   - `cypress.config.js`
   - `cypress/support/e2e.js`
   - `cypress/support/commands.js`
   - `cypress/fixtures/example.json`
4. **Elegir navegador**: elige tu navegador preferido (Chrome, Firefox, Edge, Electron).

### 5.4 Estructura de carpetas generada

```
cypress/
├── e2e/
├── fixtures/
└── support/
cypress.config.js
package.json
```

## 6. Creación de la primera prueba

### 6.1 Eliminar ejemplos

Elimina los archivos de ejemplo que están dentro de `cypress/e2e/`.

### 6.2 Crear archivo de prueba

Crea el archivo `cypress/e2e/MyFirstTest.cy.js`:

```javascript
// Describe: conjunto de pruebas
describe('My First Test', function () {
  // Caso positivo
  it('Verify Title-Positive Test', function () {
    cy.visit('https://opensource-demo.orangehrmlive.com/')
    cy.title().should('eq', 'OrangeHRM')
  })

  // Caso negativo
  it('Verify Title-Negative Test', function () {
    cy.visit('https://opensource-demo.orangehrmlive.com/')
    cy.title().should('eq', 'OrangeHRMwasaaaa')
  })
})
```

### 6.3 Explicación del código

- **`describe()`**: agrupa un conjunto de pruebas relacionadas.
- **`it()`**: define un caso de prueba específico.
- **`cy.visit()`**: visita una URL.
- **`cy.title()`**: obtiene el título de la página.
- **`.should('eq', 'valor')`**: verifica que el título sea igual al valor esperado.

### 6.4 Estructura alternativa con `function()`

Puedes usar `function()` en lugar de arrow functions `() =>`:

```javascript
describe('My First Test', function () {
  it('Test1', function () {
    cy.visit('https://opensource-demo.orangehrmlive.com/')
    cy.title().should('eq', 'OrangeHRM')
  })
})
```

## 7. Ejecución de pruebas

### 7.1 Modo interactivo (con interfaz gráfica)

```bash
npx cypress open
```

Luego selecciona el archivo `MyFirstTest.cy.js` para ejecutarlo.

### 7.2 Modo consola (headless)

```bash
npx cypress run
```

Esto ejecutará todas las pruebas en modo headless (sin interfaz gráfica).

### 7.3 Ejecutar un archivo específico

```bash
npx cypress run --spec cypress/e2e/MyFirstTest.cy.js
```

### 7.4 Ejecutar en un navegador específico

```bash
npx cypress run --spec cypress/e2e/MyFirstTest.cy.js --browser firefox
```

Navegadores disponibles: `chrome`, `firefox`, `edge`, `electron`.

### 7.5 Ejecutar con interfaz gráfica (headed)

```bash
npx cypress run --spec cypress/e2e/MyFirstTest.cy.js --browser firefox --headed
```

## 8. Resultados esperados

### 8.1 Caso positivo

- **Test**: `Verify Title-Positive Test`
- **Resultado**: ✅ **PASS**
- **Razón**: el título de la página es `OrangeHRM`, que coincide con el valor esperado.

### 8.2 Caso negativo

- **Test**: `Verify Title-Negative Test`
- **Resultado**: ❌ **FAIL**
- **Razón**: el título de la página es `OrangeHRM`, pero se esperaba `OrangeHRMwasaaaa`.

### 8.3 Interpretación

- La prueba positiva tuvo resultado **positivo** ✅.
- La prueba negativa tuvo resultado **negativo** ❌.
- Esto implica que **negativo con negativo = positivo** ✅.
- Ambas pruebas indican que la aplicación cumple el requisito del título de la página web.

## 9. Código completo de `MyFirstTest.cy.js`

```javascript
// Describe: conjunto de pruebas
describe('My First Test', function () {
  // Caso positivo
  it('Verify Title-Positive Test', function () {
    cy.visit('https://opensource-demo.orangehrmlive.com/')
    cy.title().should('eq', 'OrangeHRM')
  })

  // Caso negativo
  it('Verify Title-Negative Test', function () {
    cy.visit('https://opensource-demo.orangehrmlive.com/')
    cy.title().should('eq', 'OrangeHRMwasaaaa')
  })
})
```

## 10. Comandos útiles de Cypress

| Comando | Descripción |
|---|---|
| `cy.visit(url)` | Visita una URL |
| `cy.title()` | Obtiene el título de la página |
| `cy.get(selector)` | Obtiene un elemento del DOM |
| `cy.click()` | Hace clic en un elemento |
| `cy.type(texto)` | Escribe texto en un input |
| `.should('eq', valor)` | Verifica que el valor sea igual |
| `.should('contain', texto)` | Verifica que contenga un texto |

## 11. Evidencias sugeridas (entrega)

- Captura de la estructura de carpetas del proyecto.
- Captura de la ejecución en modo interactivo (`npx cypress open`).
- Captura de la ejecución en modo consola (`npx cypress run`).
- Captura del resultado de las pruebas (1 passing, 1 failing).
- Captura del navegador mostrando la página de OrangeHRM.

## 12. Conclusiones

- **Cypress** es una herramienta poderosa para pruebas E2E en aplicaciones web.
- La sintaxis es intuitiva y fácil de aprender.
- Permite ejecutar pruebas en múltiples navegadores.
- Las pruebas positivas y negativas ayudan a validar el comportamiento esperado de la aplicación.
- La ejecución en modo interactivo facilita el debugging.
- La ejecución en modo consola es ideal para CI/CD.

## 13. Próximos pasos

- Aprender a interactuar con elementos del DOM (`cy.get()`, `cy.click()`, `cy.type()`).
- Crear pruebas más complejas (login, formularios, navegación).
- Integrar Cypress con CI/CD (GitHub Actions, GitLab CI, etc.).
- Explorar comandos personalizados (`commands.js`).
- Usar fixtures para datos de prueba.
