/**
 * - Logout spec
 *   - should redirect to login page after clicking Logout button
 */

describe('Logout spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');

    cy.get('input[placeholder="email"]').type('azid@gmail.com');
    cy.get('input[placeholder="Password"]').type('qazwsx');
    cy.get('button')
      .contains(/^Login$/)
      .click();

    cy.get('nav')
      .contains(/^FORUM APP$/)
      .should('be.visible');
  });

  it('should redirect to login page after clicking Logout button', () => {
    cy.get('button')
      .contains(/^Logout$/)
      .click();

    cy.url().should('include', '/login');

    cy.get('input[placeholder="email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
  });
});
