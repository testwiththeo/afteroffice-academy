import HomePage from '../pages/HomePage';
import SearchResultsPage from '../pages/SearchResultsPage';
import ProductDetailPage from '../pages/ProductDetailPage';

describe('Amazon Product Search & Details E2E Test', () => {

  const homePage = new HomePage();
  const searchResultsPage = new SearchResultsPage();
  const productDetailPage = new ProductDetailPage();

  const testData = {
    searchKeyword: Cypress.env('testData')?.searchKeyword || 'chair'
  };

  before(() => {

    Cypress.env('selectedProduct', null);

    cy.viewport(1920, 1080);
  });

  it('Should search for product, capture details, and verify on detail page', () => {

    cy.log('=== STEP 1: NAVIGATE TO AMAZON ===');
    cy.log('Viewport: 1920x1080');

    homePage.visit();

    cy.log('=== STEP 2: SEARCH FOR PRODUCT ===');

    homePage.searchProduct(testData.searchKeyword);

    cy.log('=== STEP 3: SORT BY PRICE (HIGH TO LOW) ===');

    searchResultsPage.waitForResults();
    searchResultsPage.sortByPriceHighToLow();

    cy.log('=== STEP 4: SELECT RIGHTMOST NON-SPONSORED PRODUCT FROM FIRST ROW ===');

    searchResultsPage.selectRightmostNonSponsoredProduct().then((productData) => {
      cy.log('✓ Product selected and details captured:');
      cy.log(`  Product Name: ${productData.title}`);
      cy.log(`  Product Price (raw): ${productData.price}`);
      cy.log(`  Product Price (integer): ${productData.priceInteger}`);
    });

    cy.log('=== STEP 5: PRODUCT DETAIL PAGE VERIFICATION ===');

    productDetailPage.waitForPageLoad();

    productDetailPage.verifyProductTitle();

    productDetailPage.verifyProductPrice();

    productDetailPage.verifyAddToCartButtonExists();

    cy.log('=== ✓ TEST COMPLETED SUCCESSFULLY ===');
    cy.log('All verifications passed:');
    cy.log('  ✓ Product title matches between pages');
    cy.log('  ✓ Product price (integer) matches between pages');
    cy.log('  ✓ Non-sponsored product was selected');
  });

  after(() => {

    cy.log('=== TEST SUMMARY ===');
    cy.log(`Search Keyword: ${testData.searchKeyword}`);
    cy.log('Sort Order: Price: High to Low');
    cy.log('Selection: Rightmost non-sponsored product from first row');

    cy.then(() => {
      const product = Cypress.env('selectedProduct');

      if (product) {
        cy.log('=== SELECTED PRODUCT DETAILS ===');
        cy.log(`Product Name: ${product.title}`);
        cy.log(`Product Price: ${product.price}`);
        cy.log(`Product Price (Integer): ${product.priceInteger}`);
        cy.log(`Product URL: ${product.url}`);
      }
    });
  });
});
