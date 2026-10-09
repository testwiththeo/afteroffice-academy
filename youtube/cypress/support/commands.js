Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible').should('exist');
});

Cypress.Commands.add('closePopupIfExists', () => {
  cy.get('body').then(($body) => {

    const popupSelectors = [
      'tp-yt-paper-dialog button[aria-label*="No"]',
      'tp-yt-paper-dialog button[aria-label*="Dismiss"]',
      'ytd-popup-container button[aria-label*="Close"]',
      '[aria-label="Close"]',
      '.ytd-popup-container button',
      'yt-button-renderer[aria-label*="No thanks"]'
    ];

    popupSelectors.forEach((selector) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).first().click({ force: true });
        cy.wait(500);
      }
    });
  });
});

Cypress.Commands.add('handleYouTubeConsent', () => {
  cy.get('body', { timeout: 5000 }).then(($body) => {

    const consentSelectors = [
      'button[aria-label*="Accept"]',
      'button[aria-label*="Reject"]',
      'ytd-consent-bump-lightbox button',
      '[aria-label*="I agree"]',
      'ytd-button-renderer[aria-label*="Accept"]'
    ];

    for (let selector of consentSelectors) {
      if ($body.find(selector).length > 0) {
        cy.log('Consent dialog found, accepting...');
        cy.get(selector).first().click({ force: true });
        cy.wait(2000);
        break;
      }
    }
  });
});

Cypress.Commands.add('scrollToElement', (selector) => {
  cy.get(selector).scrollIntoView({ duration: 1000 });
  cy.wait(500);
});

Cypress.Commands.add('safeClick', (selector) => {
  cy.get(selector)
    .should('be.visible')
    .should('exist')
    .scrollIntoView()
    .wait(500)
    .click({ force: true });
});

Cypress.Commands.add('waitForYouTubePageLoad', () => {
  cy.wait(2000);

  cy.get('ytd-app', { timeout: 15000 }).should('exist');

  cy.get('body').then(($body) => {
    if ($body.find('tp-yt-paper-spinner').length > 0) {
      cy.get('tp-yt-paper-spinner', { timeout: 10000 }).should('not.be.visible');
    }
  });

  cy.wait(1000);
});

Cypress.Commands.add('getCleanText', (selector) => {
  return cy.get(selector).then(($el) => {
    const text = $el.text().trim().replace(/\s+/g, ' ');
    return cy.wrap(text);
  });
});

Cypress.Commands.add('openSidebarIfClosed', () => {
  cy.get('body').then(($body) => {

    const $sidebar = $body.find('ytd-guide-renderer');

    if ($sidebar.length > 0) {
      const sidebarClass = $sidebar.attr('class') || '';

      if (sidebarClass.includes('mini')) {
        cy.log('Sidebar is in mini mode, expanding...');
        cy.get('button#guide-button, button[aria-label*="Guide"]')
          .first()
          .click({ force: true });
        cy.wait(1000);
      }
    }
  });
});

Cypress.Commands.add('clickWithRetry', (selector, maxAttempts = 3) => {
  const click = (attempt = 1) => {
    cy.get(selector)
      .should('be.visible')
      .should('exist')
      .scrollIntoView()
      .wait(300)
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

Cypress.Commands.add('waitForNavigation', (urlPattern) => {
  if (urlPattern) {
    cy.url({ timeout: 15000 }).should('include', urlPattern);
  }
  cy.waitForYouTubePageLoad();
});
