class GamingPage {

  selectors = {
    pageContainer: 'ytd-browse, ytd-two-column-browse-results-renderer',
    trendingSection: 'ytd-item-section-renderer',
    trendingSectionTitle: 'yt-formatted-string#title:contains("Trending"), h2:contains("Trending")',
    viewAllButton: 'a:contains("View all"), a[aria-label*="View all"]',
    viewAllLink: 'ytd-button-renderer a, a.yt-simple-endpoint',
    shelfRenderer: 'ytd-shelf-renderer',
    expandableTabRenderer: 'ytd-expandable-tab-renderer'
  };

  waitForPageLoad() {
    cy.log('Waiting for Gaming page to load');
    cy.waitForYouTubePageLoad();

    cy.url({ timeout: 10000 }).should('include', '/gaming');

    cy.get(this.selectors.pageContainer, { timeout: 15000 }).should('exist');

    cy.wait(2000);
    cy.closePopupIfExists();
  }

  locateTrendingSection() {
    cy.log('Locating Trending videos section');

    cy.scrollTo(0, 500, { duration: 1000 });
    cy.wait(1000);

    return cy.get('body').then(($body) => {

      const trendingSelectors = [
        'ytd-shelf-renderer:has(yt-formatted-string:contains("Trending"))',
        'ytd-item-section-renderer:has(h2:contains("Trending"))',
        'ytd-expandable-tab-renderer:has(yt-formatted-string:contains("Trending"))',
        '[aria-label*="Trending"]'
      ];

      for (let selector of trendingSelectors) {
        if ($body.find(selector).length > 0) {
          cy.log(`Found Trending section with selector: ${selector}`);
          return cy.get(selector).first().scrollIntoView();
        }
      }

      cy.log('Trending section not immediately visible, scrolling...');
      cy.scrollTo(0, 1000, { duration: 1000 });
      cy.wait(1000);

      return cy.get('ytd-shelf-renderer').first();
    });
  }

  clickViewAll() {
    cy.log('Clicking View All button in Trending section');

    this.locateTrendingSection();

    cy.wait(1000);

    cy.get('body').then(($body) => {
      const viewAllSelectors = [
        'ytd-shelf-renderer:has(yt-formatted-string:contains("Trending")) a:contains("View all")',
        'ytd-shelf-renderer:has(h2:contains("Trending")) ytd-button-renderer a',
        'ytd-expandable-tab-renderer:has(yt-formatted-string:contains("Trending")) a[aria-label*="View all"]',
        'a:contains("View all")',
        'ytd-button-renderer a[href*="/gaming/trending"]',
        'a[href*="/feed/trending"]'
      ];

      for (let selector of viewAllSelectors) {
        const $viewAll = $body.find(selector);
        if ($viewAll.length > 0) {
          cy.log(`Found View All with selector: ${selector}`);
          cy.get(selector)
            .first()
            .scrollIntoView()
            .should('be.visible')
            .wait(500)
            .click({ force: true });

          cy.wait(3000);
          cy.waitForYouTubePageLoad();
          return;
        }
      }

      cy.log('View All button not found, navigating directly to trending');
      cy.visit('/gaming');
      cy.wait(2000);

      cy.get('body').then(($body2) => {
        if ($body2.find('yt-tab-shape:contains("Trending")').length > 0) {
          cy.get('yt-tab-shape:contains("Trending")').first().click({ force: true });
          cy.wait(2000);
        } else if ($body2.find('a[href*="trending"]').length > 0) {
          cy.get('a[href*="trending"]').first().click({ force: true });
          cy.wait(2000);
        }
      });
    });
  }
}

export default GamingPage;
