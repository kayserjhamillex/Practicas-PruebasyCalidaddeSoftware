describe("Aserciones con Cypress + Hooks (Lab 09)", () => {
	before(() => {
		// visitar una vez al inicio del bloque
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
		// según el PDF: redirigir al final a la interfaz principal
		cy.visit("/")
	})
})