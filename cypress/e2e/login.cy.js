/**
 * - Login spec
 *   - should display login page correctly
 *   - should display alert when username is empty
 *   - should display alert when password is empty
 *   - should display alert when username and password are wrong
 *   - should display homepage when username and password are correct
 */

describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });

  it('should display login page correctly', () => {
    cy.get('input[placeholder="email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button')
      .contains(/^Login$/)
      .should('be.visible');
  });
  it('should display alert when email is empty', () => {
    cy.get('button')
      .contains(/^Login$/)
      .click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('"email" is not allowed to be empty');
    });
  });
  it('should display alert when Password is empty', () => {
    cy.get('input[placeholder="email"]').type('testuser@gmail.com');

    cy.get('button')
      .contains(/^Login$/)
      .click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('"Password" is not allowed to be empty');
    });
  });
  it('should display alert when email and Password are wrong', () => {
    cy.get('input[placeholder="email"]').type('testuser@gmail.com');

    cy.get('input[placeholder="Password"]').type('wrong_password');

    cy.get('button')
      .contains(/^Login$/)
      .click();

    cy.on('window:alert', (str) => {
      expect(str).to.equal('User email or Password is wrong');
    });
  });
  it('should display homepage when username and password are correct', () => {
    cy.get('input[placeholder="email"]').type('azid@gmail.com');

    cy.get('input[placeholder="Password"]').type('qazwsx');

    cy.get('button')
      .contains(/^Login$/)
      .click();

    cy.get('nav')
      .contains(/^FORUM APP$/)
      .should('be.visible');
    cy.get('button').contains('Logout').should('be.visible');
  });
});
