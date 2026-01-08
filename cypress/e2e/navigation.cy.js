describe('Navegación básica', () => {
  it('Carga la home', () => {
    cy.visit('/')
    cy.contains('Home')
  })

  it('Navega a login desde home', () => {
    cy.visit('/')
    cy.get('[data-cy=go-login]').click()
    cy.contains('Login')
  })

  it('Puede entrar al dashboard', () => {
    cy.visit('/login')
    cy.get('[data-cy=email]').type('test@test.com')
    cy.get('[data-cy=password]').type('123456')
    cy.get('[data-cy=login-btn]').click()
    cy.contains('Dashboard')
  })
})