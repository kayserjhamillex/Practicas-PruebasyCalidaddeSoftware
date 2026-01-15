describe("Guardando elementos con Cypress (Lab 09)", () => {
    // esto si o si fallara
	it("Evitar Repeticion", () => {
		cy.visit("/automation-practice-form")
		// Guardamos el contenedor raíz (form) para no repetir selectores
		const form = cy.get('input[placeholder="First Name"]').parents("form")
		// Dentro del form, guardamos colecciones
		const inputs = form.find("input")
		const divs = form.find("div")
		const labels = form.find("label")
		// Aserción clave del laboratorio (en su ejemplo esperan 15 inputs)
		inputs.should("have.length", 15)
		// (opcional) puedes assertar también otros conteos si deseas
		// divs.should("have.length", 70)
		// labels.should("have.length", 16)
	})
    it("Evitar Repeticion + Debug con task(log)", () => {
		cy.visit("/automation-practice-form")
		cy.get('input[placeholder="First Name"]')
			.parents("form")
			.find("input")
			.then((inputs) => {
				// Debug: mostrar en consola de VS Code
				cy.task("log", inputs.length)
				// Aserción esperada del laboratorio
				expect(inputs.length).to.eq(15)
			})
	})
    



})