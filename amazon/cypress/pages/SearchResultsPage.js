class SearchResultsPage {

  selectors = {
    sortDropdown: '#s-result-sort-select, .s-sort-by-dropdown select',
    productGrid: '[data-component-type="s-search-result"]',
    productItem: '[data-component-type="s-search-result"]',
    productTitle: 'h2 a span, .a-size-base-plus, .a-size-medium',
    productPrice: '.a-price .a-offscreen, .a-price-whole',
    productLink: 'h2 a, .a-link-normal.s-no-outline',
    sponsoredLabel: '.s-label-popover-default, [data-component-type="sp-sponsored-result"]',
    resultsContainer: '.s-main-slot, #search',
    noResultsMessage: '.s-no-results, .s-no-outline'
  };

  productData = {
    title: null,
    price: null,
    priceInteger: null,
    url: null
  };

  waitForResults() {
    cy.log('Waiting for search results to load');
    cy.wait(2000);

    cy.get(this.selectors.resultsContainer, { timeout: 15000 })
      .should('be.visible');

    cy.wait(1000);
    cy.closePopupIfExists();
  }

  sortByPriceHighToLow() {
    cy.log('Sorting by Price: High to Low');

    cy.get('body').then(($body) => {
      if ($body.find(this.selectors.sortDropdown).length > 0) {
        cy.get(this.selectors.sortDropdown)
          .should('be.visible')
          .select('price-desc-rank', { force: true });

        cy.wait(3000);
        cy.closePopupIfExists();
      } else {
        cy.log('Sort dropdown not found, trying alternative approach');

        cy.get('body').then(($body2) => {
          if ($body2.find('a:contains("Price: High to Low")').length > 0) {
            cy.get('a:contains("Price: High to Low")').first().click({ force: true });
            cy.wait(3000);
          } else if ($body2.find('a:contains("Harga Termahal")').length > 0) {
            cy.get('a:contains("Harga Termahal")').first().click({ force: true });
            cy.wait(3000);
          } else {
            cy.log('⚠️  Could not find price sort option, continuing with default sort');
          }
        });
      }
    });
  }

  getFirstRowProducts() {
    cy.log('Getting products from first row');

    return cy.get(this.selectors.productItem).then(($products) => {
      if ($products.length === 0) {
        throw new Error('No products found in search results');
      }

      cy.log(`Total products found: ${$products.length}`);

      const firstRowCount = Math.min(5, $products.length);
      const firstRowProducts = $products.slice(0, firstRowCount);

      cy.log(`First row contains approximately ${firstRowCount} products`);

      return cy.wrap(firstRowProducts);
    });
  }

  selectRightmostNonSponsoredProduct() {
    cy.log('Selecting rightmost non-sponsored product from first row');

    return this.getFirstRowProducts().then(($firstRowProducts) => {
      const productsArray = Array.from($firstRowProducts);
      let selectedProduct = null;
      let selectedPosition = -1;

      for (let i = productsArray.length - 1; i >= 0; i--) {
        const $product = Cypress.$(productsArray[i]);

        const productText = $product.text().toLowerCase();
        const isSponsored =
          productText.includes('sponsored') ||
          $product.attr('data-component-type') === 'sp-sponsored-result' ||
          $product.find('[data-component-type="sp-sponsored-result"]').length > 0 ||
          $product.find('.s-label-popover-default').text().toLowerCase().includes('sponsored');

        cy.log(`Product ${i + 1}: ${isSponsored ? 'SPONSORED (skipping)' : 'NOT SPONSORED'}`);

        if (!isSponsored) {
          selectedProduct = $product;
          selectedPosition = i + 1;
          break;
        }
      }

      if (!selectedProduct) {
        throw new Error('No non-sponsored products found in first row');
      }

      cy.log(`✓ Selected product at position ${selectedPosition} (rightmost non-sponsored)`);

      const titleSelectors = ['h2 a span', 'h2 span', '.a-size-base-plus', '.a-size-medium'];
      let productTitle = 'Title Not Found';
      for (let selector of titleSelectors) {
        const $title = selectedProduct.find(selector).first();
        if ($title.length > 0 && $title.text().trim() !== '') {
          productTitle = $title.text().trim();
          break;
        }
      }

      const priceSelectors = [
        '.a-price .a-offscreen',
        '.a-price-whole',
        '.a-price span[aria-hidden="true"]'
      ];
      let productPrice = 'Price Not Found';
      for (let selector of priceSelectors) {
        const $price = selectedProduct.find(selector).first();
        if ($price.length > 0 && $price.text().trim() !== '') {
          productPrice = $price.text().trim();
          break;
        }
      }

      const priceInteger = parseInt(productPrice.replace(/[$€£¥₹,\s]/g, '').split('.')[0], 10) || 0;

      const $link = selectedProduct.find('h2 a, a.a-link-normal').first();
      const productUrl = $link.attr('href') || null;

      this.productData = {
        title: productTitle,
        price: productPrice,
        priceInteger: priceInteger,
        url: productUrl
      };

      cy.log(`Product Title: ${productTitle}`);
      cy.log(`Raw Price: ${productPrice}`);
      cy.log(`Integer Price: ${priceInteger}`);
      cy.log(`Product URL: ${productUrl}`);

      Cypress.env('selectedProduct', this.productData);

      cy.wrap($link).click({ force: true });
      cy.wait(3000);

      return cy.wrap(this.productData);
    });
  }

  getProductData() {
    return this.productData;
  }
}

export default SearchResultsPage;
