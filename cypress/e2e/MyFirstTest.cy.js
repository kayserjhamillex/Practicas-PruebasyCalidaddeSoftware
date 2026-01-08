// Describe: conjunto de pruebas
describe('My First Test', function () {

  // Caso positivo
  it('Verify Title-Positive Test', function () {
    cy.visit('https://opensource-demo.orangehrmlive.com/')
    cy.title().should('eq', 'OrangeHRM')
  })


  // Caso negativo
  it('Verify Title-Positive Test', function () {
    cy.visit('https://wallhaven.cc/')
    cy.title().should('eq', 'Awesome Wallpapers - wallhaven.cc')
  })

  // Caso negativo
  it('Verify Title-Negative Test', function () {
    cy.visit('https://opensource-demo.orangehrmlive.com/')
    cy.title().should('eq', 'OrangeHRMwasaaaa')
  })

})