class HomePage {

  selectors = {
    searchBox: '#twotabsearchtextbox, input[type="text"][name="field-keywords"]',
    searchButton: '#nav-search-submit-button, input[type="submit"][value="Go"]',
    searchForm: '#nav-search-bar-form, form[action*="/s"]',
    captchaForm: 'form[action*="validateCaptcha"]'
  };

  visit() {
    cy.visit('/');
    cy.wait(2000);
    cy.closePopupIfExists();
    cy.handleAmazonCaptcha();
  }

  searchProduct(keyword) {
    cy.log(`Searching for: ${keyword}`);

    cy.get(this.selectors.searchBox, { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type(keyword, { delay: 100 });

    cy.wait(500);

    cy.get(this.selectors.searchButton)
      .should('be.visible')
      .click();

    cy.wait(3000);
    cy.closePopupIfExists();
  }
}

export default HomePage;
