describe('Uso de selectores', () => {
  it('Localiza inputs y botones con data-cy', () => {
    cy.visit('/login')
    cy.get('[data-cy=email]').should('exist')
    cy.get('[data-cy=password]').should('exist')
    cy.get('[data-cy=login-btn]').should('be.visible')
  })
})