class PaymentPage {

  selectors = {
    totalPrice: '[class*="total"][class*="price"], [data-selenium="total-price"], [class*="TotalPrice"]',
    passengerName: '[class*="passenger"][class*="name"], [data-selenium="passenger-name"]',
    flightDetails: '[class*="flight"][class*="detail"], [data-selenium="flight-details"]',
    departureTime: '[class*="departure"][class*="time"], [data-selenium="departure-time"]',
    arrivalTime: '[class*="arrival"][class*="time"], [data-selenium="arrival-time"]',
    bookingSummary: '[class*="booking"][class*="summary"], [class*="BookingSummary"]',
    paymentButton: 'button:contains("Pay"), button:contains("Complete"), button[type="submit"]'
  };

  waitForPageLoad() {
    cy.log('Waiting for Payment page to load');
    cy.wait(3000);
    cy.closePopupIfExists();

    cy.get('body', { timeout: 15000 }).should('be.visible');
    cy.wait(2000);
  }

  verifyTotalPrice() {
    cy.log('Verifying Total Price on Payment page');

    const expectedPrice = Cypress.env('passengerPagePrice');
    cy.log(`Expected Total Price: ${expectedPrice}`);

    return cy.get('body').then(($body) => {
      const priceSelectors = [
        '[class*="total"][class*="price"]',
        '[data-selenium="total-price"]',
        '[class*="TotalPrice"]',
        '[class*="total"][class*="amount"]',
        'span:contains("Total") ~ span',
        'div:contains("Total"):not(:contains("Subtotal"))'
      ];

      let actualPrice = 'Not Found';

      for (let selector of priceSelectors) {
        const $price = $body.find(selector);
        if ($price.length > 0) {
          actualPrice = $price.first().text().trim();
          if (actualPrice && actualPrice !== '') {
            break;
          }
        }
      }

      if (actualPrice === 'Not Found') {
        const $priceWithCurrency = $body.find('*').filter(function() {
          const text = $(this).text();
          return /[$€£¥SGD]\s*[0-9,]+/.test(text) || /[0-9,]+\s*[$€£¥SGD]/.test(text);
        });

        if ($priceWithCurrency.length > 0) {
          actualPrice = $priceWithCurrency.first().text().trim();
        }
      }

      cy.log(`Actual Total Price on Payment page: ${actualPrice}`);

      const normalizePrice = (price) => {
        return price.replace(/[^0-9.]/g, '');
      };

      const normalizedExpected = normalizePrice(expectedPrice);
      const normalizedActual = normalizePrice(actualPrice);

      cy.log(`Normalized Expected: ${normalizedExpected}`);
      cy.log(`Normalized Actual: ${normalizedActual}`);

      expect(normalizedActual).to.equal(normalizedExpected,
        `Total price on Payment page (${actualPrice}) should match Passenger Details page (${expectedPrice})`);

      return cy.wrap({ expected: expectedPrice, actual: actualPrice, match: true });
    });
  }

  verifyPassengerDetails() {
    cy.log('Verifying Passenger Details on Payment page');

    const expectedPassenger = Cypress.env('passengerDetails');
    cy.log('Expected Passenger Details:', JSON.stringify(expectedPassenger));

    return cy.get('body').then(($body) => {
      let verificationResults = {
        firstName: false,
        lastName: false,
        email: false
      };

      const firstNameFound = $body.text().includes(expectedPassenger.firstName);
      verificationResults.firstName = firstNameFound;
      cy.log(`First Name (${expectedPassenger.firstName}) found: ${firstNameFound}`);

      const lastNameFound = $body.text().includes(expectedPassenger.lastName);
      verificationResults.lastName = lastNameFound;
      cy.log(`Last Name (${expectedPassenger.lastName}) found: ${lastNameFound}`);

      const emailFound = $body.text().includes(expectedPassenger.email);
      verificationResults.email = emailFound;
      cy.log(`Email (${expectedPassenger.email}) found: ${emailFound}`);

      expect(verificationResults.firstName,
        `Passenger first name "${expectedPassenger.firstName}" should be visible on Payment page`).to.be.true;

      expect(verificationResults.lastName,
        `Passenger last name "${expectedPassenger.lastName}" should be visible on Payment page`).to.be.true;

      if (!verificationResults.email) {
        cy.log('Warning: Email not found on payment page (might not be displayed)');
      }

      return cy.wrap(verificationResults);
    });
  }

  verifyFlightTimes() {
    cy.log('Verifying Flight Times on Payment page');

    const expectedFlight = Cypress.env('selectedFlight');
    cy.log('Expected Flight Details:', JSON.stringify(expectedFlight));

    return cy.get('body').then(($body) => {
      let verificationResults = {
        departureTime: false,
        arrivalTime: false
      };

      if (expectedFlight.departureTime !== 'Not Found') {
        const departureFound = $body.text().includes(expectedFlight.departureTime);
        verificationResults.departureTime = departureFound;
        cy.log(`Departure Time (${expectedFlight.departureTime}) found: ${departureFound}`);

        expect(verificationResults.departureTime,
          `Departure time "${expectedFlight.departureTime}" should be visible on Payment page`).to.be.true;
      } else {
        cy.log('Warning: Departure time was not captured from flight selection');
      }

      if (expectedFlight.arrivalTime !== 'Not Found') {
        const arrivalFound = $body.text().includes(expectedFlight.arrivalTime);
        verificationResults.arrivalTime = arrivalFound;
        cy.log(`Arrival Time (${expectedFlight.arrivalTime}) found: ${arrivalFound}`);

        expect(verificationResults.arrivalTime,
          `Arrival time "${expectedFlight.arrivalTime}" should be visible on Payment page`).to.be.true;
      } else {
        cy.log('Warning: Arrival time was not captured from flight selection');
      }

      return cy.wrap(verificationResults);
    });
  }

  verifyPaymentPageWithoutPaying() {
    cy.log('=== PAYMENT PAGE VERIFICATION (NOT PAYING) ===');

    this.verifyTotalPrice();

    this.verifyPassengerDetails();

    this.verifyFlightTimes();

    cy.log('=== ALL VERIFICATIONS COMPLETED ===');
    cy.log('⚠️  IMPORTANT: Payment NOT submitted (as per requirements)');
  }

  verifyPaymentButtonExists() {
    cy.log('Verifying payment button exists (NOT clicking)');

    cy.get('body').then(($body) => {
      const paymentButtonSelectors = [
        'button:contains("Pay")',
        'button:contains("Complete")',
        'button:contains("Confirm")',
        'button[type="submit"]'
      ];

      let buttonFound = false;
      for (let selector of paymentButtonSelectors) {
        if ($body.find(selector).length > 0) {
          buttonFound = true;
          cy.log(`✓ Payment button found: ${selector}`);
          break;
        }
      }

      expect(buttonFound, 'Payment button should exist on the page').to.be.true;
    });
  }
}

export default PaymentPage;
