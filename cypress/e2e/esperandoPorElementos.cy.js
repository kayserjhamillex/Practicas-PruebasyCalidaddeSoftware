describe("Esperando por elementos (Práctica 11)", () => {
    beforeEach(() => {
        // NO página local: URL pública del material
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

describe("Esperando por elementos (Deshabilitar Retry)", () => {
    beforeEach(() => {
        cy.visit("https://ucontinental.edu.pe/")
    })

    it("Deshabilitar el Retry", () => {
        // timeout: 0 => no reintenta (falla inmediatamente si no encuentra)
        cy.get(":nth-child(3) > :nth-child(1) > .card-body", { timeout: 0 })
    })
})