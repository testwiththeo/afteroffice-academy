Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible').should('not.be.disabled');
});

Cypress.Commands.add('closePopupIfExists', () => {
  cy.get('body').then(($body) => {

    const popupSelectors = [
      '[data-action="a-popover-close"]',
      '.a-popover-close',
      '[aria-label="Close"]',
      'button:contains("Close")',
      '#nav-main-dismiss',
      '.a-modal-close'
    ];

    popupSelectors.forEach((selector) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).first().click({ force: true });
        cy.wait(500);
      }
    });
  });
});

Cypress.Commands.add('extractIntegerPrice', (priceText) => {
  if (!priceText) {
    return cy.wrap(0);
  }

  const cleanedPrice = priceText
    .replace(/[$€£¥₹,\s]/g, '')
    .split('.')[0];

  const intPrice = parseInt(cleanedPrice, 10);

  cy.log(`Extracted price: "${priceText}" -> ${intPrice}`);

  return cy.wrap(intPrice);
});

Cypress.Commands.add('isSponsored', ($element) => {
  const elementText = $element.text().toLowerCase();
  const elementHtml = $element.html().toLowerCase();

  const sponsoredIndicators = [
    'sponsored',
    'ad',
    'advertisement',
    'iklan',
    'gesponsert'
  ];

  const isAd = sponsoredIndicators.some(indicator =>
    elementText.includes(indicator) || elementHtml.includes(indicator)
  );

  const hasAdAttribute =
    $element.attr('data-component-type') === 'sp-sponsored-result' ||
    $element.attr('data-is-sponsored') === 'true' ||
    $element.find('[data-component-type="sp-sponsored-result"]').length > 0 ||
    $element.find('.s-label-popover-default:contains("Sponsored")').length > 0;

  return cy.wrap(isAd || hasAdAttribute);
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

Cypress.Commands.add('handleAmazonCaptcha', () => {
  cy.get('body').then(($body) => {
    if ($body.find('form[action*="validateCaptcha"]').length > 0) {
      cy.log('⚠️  CAPTCHA detected - Manual intervention may be required');

    }
  });
});
