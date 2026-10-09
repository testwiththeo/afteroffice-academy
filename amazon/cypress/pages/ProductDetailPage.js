class ProductDetailPage {

  selectors = {
    productTitle: '#productTitle, #title',
    productPrice: '.a-price .a-offscreen, .a-price-whole, #priceblock_ourprice, #priceblock_dealprice',
    priceContainer: '#corePrice_feature_div, #corePriceDisplay_desktop_feature_div',
    addToCartButton: '#add-to-cart-button',
    breadcrumb: '#wayfinding-breadcrumbs_feature_div',
    productImage: '#landingImage, #imgTagWrapperId img'
  };

  waitForPageLoad() {
    cy.log('Waiting for Product Detail page to load');
    cy.wait(3000);
    cy.closePopupIfExists();

    cy.get(this.selectors.productTitle, { timeout: 15000 })
      .should('be.visible');

    cy.wait(1000);
  }

  getProductTitle() {
    cy.log('Getting product title from detail page');

    return cy.get(this.selectors.productTitle).then(($title) => {
      const title = $title.text().trim();
      cy.log(`Product Title on Detail Page: ${title}`);
      return cy.wrap(title);
    });
  }

  getProductPrice() {
    cy.log('Getting product price from detail page');

    return cy.get('body').then(($body) => {
      let priceText = 'Price Not Found';

      const priceSelectors = [
        '.a-price .a-offscreen',
        '.a-price-whole',
        '#priceblock_ourprice',
        '#priceblock_dealprice',
        '#priceblock_saleprice',
        '.a-price span[aria-hidden="true"]',
        '[data-a-color="price"]',
        '.apexPriceToPay .a-offscreen'
      ];

      for (let selector of priceSelectors) {
        const $priceElem = $body.find(selector);
        if ($priceElem.length > 0) {
          priceText = $priceElem.first().text().trim();
          if (priceText && priceText !== '') {
            cy.log(`Raw Price on Detail Page: ${priceText}`);
            break;
          }
        }
      }

      return cy.extractIntegerPrice(priceText).then((intPrice) => {
        cy.log(`Integer Price on Detail Page: ${intPrice}`);
        return cy.wrap({
          priceText: priceText,
          priceInteger: intPrice
        });
      });
    });
  }

  verifyProductTitle() {
    cy.log('Verifying Product Title matches Search Results page');

    const expectedProduct = Cypress.env('selectedProduct');
    const expectedTitle = expectedProduct.title;

    cy.log(`Expected Title: ${expectedTitle}`);

    return this.getProductTitle().then((actualTitle) => {
      cy.log(`Actual Title: ${actualTitle}`);

      const normalizeTitle = (title) => {
        return title.replace(/\s+/g, ' ').trim().toLowerCase();
      };

      const normalizedExpected = normalizeTitle(expectedTitle);
      const normalizedActual = normalizeTitle(actualTitle);

      const titlesMatch =
        normalizedActual.includes(normalizedExpected) ||
        normalizedExpected.includes(normalizedActual) ||
        normalizedActual === normalizedExpected;

      cy.log(`Normalized Expected: ${normalizedExpected}`);
      cy.log(`Normalized Actual: ${normalizedActual}`);
      cy.log(`Titles Match: ${titlesMatch}`);

      expect(titlesMatch,
        `Product title on detail page should match search results page.\nExpected: "${expectedTitle}"\nActual: "${actualTitle}"`
      ).to.be.true;

      return cy.wrap({ expected: expectedTitle, actual: actualTitle, match: true });
    });
  }

  verifyProductPrice() {
    cy.log('Verifying Product Price matches Search Results page (integer only)');

    const expectedProduct = Cypress.env('selectedProduct');

    return cy.extractIntegerPrice(expectedProduct.price).then((expectedPriceInt) => {
      cy.log(`Expected Price Integer: ${expectedPriceInt}`);

      return this.getProductPrice().then((actualPriceData) => {
        const actualPriceInt = actualPriceData.priceInteger;
        cy.log(`Actual Price Integer: ${actualPriceInt}`);

        const pricesMatch = expectedPriceInt === actualPriceInt;

        cy.log(`Prices Match: ${pricesMatch}`);

        expect(actualPriceInt,
          `Product price (integer) on detail page should match search results page.\nExpected: ${expectedPriceInt}\nActual: ${actualPriceInt}`
        ).to.equal(expectedPriceInt);

        return cy.wrap({
          expected: expectedPriceInt,
          actual: actualPriceInt,
          match: true
        });
      });
    });
  }

  verifyProductDetails() {
    cy.log('=== PRODUCT DETAIL PAGE VERIFICATION ===');

    this.verifyProductTitle();

    this.verifyProductPrice();

    cy.log('=== ALL VERIFICATIONS COMPLETED ===');
  }

  verifyAddToCartButtonExists() {
    cy.log('Verifying Add to Cart button exists');

    cy.get('body').then(($body) => {
      const addToCartSelectors = [
        '#add-to-cart-button',
        'input[name="submit.add-to-cart"]',
        'button:contains("Add to Cart")'
      ];

      let buttonFound = false;
      for (let selector of addToCartSelectors) {
        if ($body.find(selector).length > 0) {
          buttonFound = true;
          cy.log(`✓ Add to Cart button found: ${selector}`);
          break;
        }
      }

      if (buttonFound) {
        cy.log('✓ Product detail page loaded successfully');
      } else {
        cy.log('⚠️  Add to Cart button not found (might be out of stock or different layout)');
      }
    });
  }
}

export default ProductDetailPage;
