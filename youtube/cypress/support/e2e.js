import './commands';
import 'cypress-mochawesome-reporter/register';

Cypress.on('uncaught:exception', (err, runnable) => {

  console.log('Uncaught exception:', err.message);
  return false;
});

beforeEach(() => {
  const viewport = Cypress.env('viewport') || { width: 1920, height: 1080 };
  cy.viewport(viewport.width, viewport.height);
});

before(() => {
  cy.log('Test Environment:', Cypress.env('baseUrl') || Cypress.config('baseUrl'));
  cy.log('Browser:', Cypress.browser.name);
  cy.log('Viewport:', `${Cypress.config('viewportWidth')}x${Cypress.config('viewportHeight')}`);
});
