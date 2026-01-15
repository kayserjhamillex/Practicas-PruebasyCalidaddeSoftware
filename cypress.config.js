const { defineConfig } = require("cypress")

module.exports = defineConfig({
    e2e: {
        baseUrl: "https://demoqa.com/",
        excludeSpecPattern: ["**/1-getting-started/*.js", "**/2-advanced-examples/*.js"],
        viewportWidth: 1920,
        viewportHeight: 1080,
        testIsolation: false,

        // Video en headless (cambia a false si no lo quieres)
        video: true,

        setupNodeEvents(on, config) {
            // "Plugin" (task) para debug en consola/terminal
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