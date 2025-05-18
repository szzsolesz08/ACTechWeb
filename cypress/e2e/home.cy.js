describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  it('should load the home page with correct title', () => {
    cy.get('h1').should('have.text', 'Vite + React')
  })

  it('should have a working counter button', () => {
    cy.get('button').contains('count is 0')
    cy.get('button').click()
    cy.get('button').contains('count is 1')
  })
})
