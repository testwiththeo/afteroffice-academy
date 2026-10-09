Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible').should('not.be.disabled');
});

Cypress.Commands.add('closePopupIfExists', () => {
  cy.get('body').then(($body) => {

    const popupSelectors = [
      '[data-selenium="dialog-close-button"]',
      '.ab-close-button',
      '[aria-label="Close"]',
      '.Modal-close',
      '.IconButton--close'
    ];

    popupSelectors.forEach((selector) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).first().click({ force: true });
        cy.wait(500);
      }
    });
  });
});

Cypress.Commands.add('getTomorrowDate', () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return cy.wrap({
    date: tomorrow.getDate(),
    month: tomorrow.getMonth() + 1,
    year: tomorrow.getFullYear(),
    formatted: tomorrow.toISOString().split('T')[0]
  });
});

Cypress.Commands.add('safeFill', (selector, value) => {
  cy.get(selector)
    .should('be.visible')
    .clear()
    .type(value, { delay: 50 })
    .should('have.value', value);
});

Cypress.Commands.add('clickWithRetry', (selector, maxAttempts = 3) => {
  const click = (attempt = 1) => {
    cy.get(selector)
      .should('be.visible')
      .should('not.be.disabled')
      .click({ force: true })
      .then(() => {
        cy.log(`Click successful on attempt ${attempt}`);
      })
      .catch((err) => {
        if (attempt < maxAttempts) {
          cy.log(`Click failed on attempt ${attempt}, retrying...`);
          cy.wait(1000);
          click(attempt + 1);
        } else {
          throw err;
        }
      });
  };
  click();
});
