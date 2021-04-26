function enterPin() {
  cy.contains('Please enter your pin')
    .as('pinpad')
    .siblings()
    .contains('9')
    .click();

  cy.get('@pinpad')
    .siblings()
    .contains('4')
    .click();
}

describe('KPoS', function () {
  before(function () {
    cy.exec('cd ../back-end && php artisan migrate:fresh --seed --env testing')
      .its('stdout')
      .should('contain', 'Database seeding completed successfully');
  });

  beforeEach(function () {
    cy.visit('localhost:8080');
  });

  it('should show number of active seats on table', function () {
    cy.contains('4')
      .should('not.contain', 'Seats:')
      .click();

    enterPin();

    cy.contains('Back').click();

    cy.contains('4')
      .should('not.contain', 'Seats:')
      .click();

    enterPin();

    cy.contains('Cheese Squares').click();
    cy.contains('Send').click();
    cy.contains('Back').click();

    cy.contains('4')
      .should('contain', 'Seats: 1')
      .click();

    enterPin();

    cy.get('[aria-label="Add seat"]').click();
    cy.contains('Cheese Squares').click();
    cy.contains('Send').click();
    cy.contains('Back').click();

    cy.contains('4')
      .should('contain', 'Seats: 2')
      .click();

    enterPin();

    cy.get('[aria-label="Add seat"]').click();
    cy.contains('Send').click();
    cy.contains('Back').click();

    cy.contains('4')
      .should('contain', 'Seats: 3');
  });

  it('should be able to void ordered items, and close table', function () {
    cy.contains('5')
      .click();

    enterPin();

    cy.contains('Cheese Squares').click();
    cy.contains('Send').click();
    cy.get('[aria-label="Show options"]')
      .click();

    cy.contains('Void')
      .click();

    cy.get('[aria-label="Show options"]').should('not.exist');

    cy.contains('Send').click();
    cy.contains('Back').click();

    cy.contains('5')
      .click();

    enterPin();

    cy.get('[aria-label="Show options"]').should('not.exist');

    cy.contains('Close Table').click();
    cy.contains('5')
      .should('not.contain', 'Seats:');
  });
});
