describe("Tipos de localizadores + Delimitación de búsqueda (Lab 09)", () => {
	beforeEach(() => {
		// con baseUrl demoqa.com/
		cy.visit("/automation-practice-form")
	})
	it("Usando contains (por texto)", () => {
		// busca texto visible en la UI
		cy.contains("Reading") // checkbox label
		// combinación clase + contenido
		cy.contains(".header-wrapper", "Widgets")
	})
	it("Usando parent/parents + find (padre-hijo)", () => {
		// cuando no hay identificadores claros, se navega por jerarquía
		cy.get('input[placeholder="First Name"]')
			.parents("form")
			.find("label") // encuentra labels dentro del form
	})
})