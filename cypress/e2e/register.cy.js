/**
 * - Register spec
 *   - should display register page correctly
 *   - should show alert when name is empty
 *   - should show alert when email is empty
 *   - should show alert when password is empty
 *   - should show error when email already registered
 *   - should redirect to login page when registration is successful
 */

describe('Register spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/register');
  });

  it('should display register page correctly', () => {
    cy.get('input[placeholder="Name"]').should('be.visible');
    cy.get('input[placeholder="Email"]').should('be.visible');
    cy.get('input[placeholder="Password"]').should('be.visible');
    cy.get('button')
      .contains(/^Register$/)
      .should('be.visible');
  });

  it('should show alert when name is empty', () => {
    cy.get('input[placeholder="Email"]').type('newuser@test.com');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button')
      .contains(/^Register$/)
      .click();

    // Validasi browser
    cy.get('input[placeholder="Name"]:invalid').should('exist');
  });

  it('should show alert when email is empty', () => {
    cy.get('input[placeholder="Name"]').type('New User');
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button')
      .contains(/^Register$/)
      .click();

    cy.get('input[placeholder="Email"]:invalid').should('exist');
  });

  it('should show alert when password is empty', () => {
    cy.get('input[placeholder="Name"]').type('New User');
    cy.get('input[placeholder="Email"]').type('newuser@test.com');
    cy.get('button')
      .contains(/^Register$/)
      .click();

    cy.get('input[placeholder="Password"]:invalid').should('exist');
  });

  it('should show error when email already registered', () => {
    cy.get('input[placeholder="Name"]').type('Test User');
    cy.get('input[placeholder="Email"]').type('azid@gmail.com'); // email sudah terdaftar
    cy.get('input[placeholder="Password"]').type('qazwsx');
    cy.get('button')
      .contains(/^Register$/)
      .click();

    cy.get('p.text-red-500').should('include.text', 'already');
  });

  it('should redirect to login page when registration is successful', () => {
    const uniqueEmail = `test${Date.now()}@mail.com`;

    cy.get('input[placeholder="Name"]').type('New User');
    cy.get('input[placeholder="Email"]').type(uniqueEmail);
    cy.get('input[placeholder="Password"]').type('password123');
    cy.get('button')
      .contains(/^Register$/)
      .click();

    cy.url().should('include', '/login');
    cy.get('h2').should('contain', 'Login');
  });
});
