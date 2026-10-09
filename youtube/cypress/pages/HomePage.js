class HomePage {

  selectors = {
    ytdApp: 'ytd-app',
    guideButton: 'button#guide-button, button[aria-label*="Guide"]',
    sidebar: 'ytd-guide-renderer',
    sidebarItem: 'ytd-guide-entry-renderer',
    gamingMenuItem: 'a[title="Gaming"], ytd-guide-entry-renderer:has(yt-formatted-string:contains("Gaming"))',
    consentDialog: 'ytd-consent-bump-lightbox',
    acceptButton: 'button[aria-label*="Accept"], button[aria-label*="I agree"]'
  };

  visit() {
    cy.visit('/');
    cy.waitForYouTubePageLoad();
    cy.handleYouTubeConsent();
    cy.closePopupIfExists();
  }

  expandSidebar() {
    cy.log('Ensuring sidebar is expanded');
    cy.openSidebarIfClosed();
  }

  clickGaming(category = 'Gaming') {
    cy.log(`Clicking ${category} option in sidebar`);

    this.expandSidebar();

    cy.wait(1000);

    cy.get('body').then(($body) => {
      const gamingSelectors = [
        `a[title="${category}"]`,
        `ytd-guide-entry-renderer a[href*="/${category.toLowerCase()}"]`,
        `ytd-guide-entry-renderer:contains("${category}") a`,
        `yt-formatted-string:contains("${category}")`,
        `#endpoint[title="${category}"]`
      ];

      for (let selector of gamingSelectors) {
        const $gaming = $body.find(selector);
        if ($gaming.length > 0) {
          cy.log(`Found ${category} with selector: ${selector}`);
          cy.get(selector)
            .first()
            .scrollIntoView()
            .should('be.visible')
            .wait(500)
            .click({ force: true });

          cy.wait(3000);
          cy.waitForNavigation(category.toLowerCase());
          return;
        }
      }

      cy.log(`${category} not found in sidebar, navigating directly`);
      cy.visit(`/${category.toLowerCase()}`);
      cy.waitForYouTubePageLoad();
    });
  }
}

export default HomePage;
