/**
 * - Leaderboard spec
 *   - should display leaderboard page correctly
 *   - should render list of leaderboard items
 *   - should display user name and score correctly
 */

describe('Leaderboard spec', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/login');

    cy.get('input[placeholder="email"]').type('azid@gmail.com');
    cy.get('input[placeholder="Password"]').type('qazwsx');
    cy.get('button')
      .contains(/^Login$/)
      .click();

    cy.url().should('eq', 'http://localhost:5173/');

    cy.visit('http://localhost:5173/leaderboards');
  });

  it('should display leaderboard page correctly', () => {
    cy.get('h1').should('contain', 'Klasmen Pengguna Aktif');
    cy.get('span').contains('Pengguna').should('be.visible');
    cy.get('span').contains('Skor').should('be.visible');
  });

  it('should render list of leaderboard items', () => {
    cy.get('[data-testid="leaderboard-item"]').should('exist');
    cy.get('[data-testid="leaderboard-item"]').should('have.length.greaterThan', 0);
  });

  it('should display user name and score correctly', () => {
    cy.get('[data-testid="leaderboard-item"]').each(($el) => {
      cy.wrap($el).within(() => {
        cy.get('span').first().should('not.be.empty');
        cy.get('span')
          .last()
          .invoke('text')
          .should((text) => {
            const trimmed = text.trim();
            expect(trimmed).to.match(/^[0-9]+$/);
          });
      });
    });
  });
});
