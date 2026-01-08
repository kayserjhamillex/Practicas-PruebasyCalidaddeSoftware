const { defineConfig } = require("cypress");

module.exports = defineConfig(
  {
    e2e: {
      baseUrl: 'http://localhost:3000',
      excludeSpecPattern: ['**/1-getting-started/*.js', '**/2-advanced-examples/*.js'],
      supportFile: false,
      viewportWidth: 1920,
      viewportHeight: 1080,
      testIsolation: false,
      setupNodeEvents(on, config) {
        // listeners opcionales
      },
    },
  }
);
