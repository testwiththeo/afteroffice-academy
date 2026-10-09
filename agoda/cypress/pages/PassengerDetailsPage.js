class PassengerDetailsPage {

  selectors = {
    titleDropdown: 'select[name*="title"], [name*="Title"], [data-selenium="title-dropdown"]',
    firstNameInput: 'input[name*="firstName"], input[name*="FirstName"], [placeholder*="First name"]',
    lastNameInput: 'input[name*="lastName"], input[name*="LastName"], [placeholder*="Last name"]',
    emailInput: 'input[type="email"], input[name*="email"], [placeholder*="Email"]',
    phoneInput: 'input[type="tel"], input[name*="phone"], [placeholder*="Phone"]',
    dobDayInput: 'input[name*="day"], select[name*="day"], [placeholder*="Day"]',
    dobMonthInput: 'input[name*="month"], select[name*="month"], [placeholder*="Month"]',
    dobYearInput: 'input[name*="year"], select[name*="year"], [placeholder*="Year"]',
    nationalityDropdown: 'select[name*="nationality"], [name*="Nationality"]',
    continueButton: 'button:contains("Continue"), button:contains("Next"), button[type="submit"]',
    totalPrice: '[class*="total"][class*="price"], [data-selenium="total-price"], [class*="TotalPrice"]',
    priceSection: '[class*="price"], [data-selenium="price"]'
  };

  passengerData = {
    title: 'Mr',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@test.com',
    phone: '+6512345678',
    dobDay: '15',
    dobMonth: '06',
    dobYear: '1990',
    nationality: 'Singapore'
  };

  totalPrice = null;

  waitForPageLoad() {
    cy.log('Waiting for Passenger Details page to load');
    cy.wait(3000);
    cy.closePopupIfExists();

    cy.get('input, select', { timeout: 15000 }).should('have.length.greaterThan', 0);
    cy.wait(1000);
  }

  fillTitle() {
    cy.log(`Filling title: ${this.passengerData.title}`);

    cy.get('body').then(($body) => {
      const titleSelectors = [
        'select[name*="title"]',
        'select[name*="Title"]',
        '[data-selenium="title"]',
        'select[id*="title"]'
      ];

      for (let selector of titleSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().select(this.passengerData.title, { force: true });
          return;
        }
      }

      if ($body.find(`label:contains("${this.passengerData.title}")`).length > 0) {
        cy.get(`label:contains("${this.passengerData.title}")`).first().click({ force: true });
      }
    });

    cy.wait(500);
  }

  fillFirstName() {
    cy.log(`Filling first name: ${this.passengerData.firstName}`);

    cy.get('body').then(($body) => {
      const firstNameSelectors = [
        'input[name*="firstName"]',
        'input[name*="FirstName"]',
        'input[placeholder*="First name"]',
        'input[placeholder*="Given name"]',
        'input[id*="firstName"]'
      ];

      for (let selector of firstNameSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector)
            .first()
            .scrollIntoView()
            .clear({ force: true })
            .type(this.passengerData.firstName, { force: true, delay: 50 });
          return;
        }
      }
    });

    cy.wait(500);
  }

  fillLastName() {
    cy.log(`Filling last name: ${this.passengerData.lastName}`);

    cy.get('body').then(($body) => {
      const lastNameSelectors = [
        'input[name*="lastName"]',
        'input[name*="LastName"]',
        'input[placeholder*="Last name"]',
        'input[placeholder*="Surname"]',
        'input[id*="lastName"]'
      ];

      for (let selector of lastNameSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector)
            .first()
            .scrollIntoView()
            .clear({ force: true })
            .type(this.passengerData.lastName, { force: true, delay: 50 });
          return;
        }
      }
    });

    cy.wait(500);
  }

  fillEmail() {
    cy.log(`Filling email: ${this.passengerData.email}`);

    cy.get('body').then(($body) => {
      const emailSelectors = [
        'input[type="email"]',
        'input[name*="email"]',
        'input[placeholder*="Email"]',
        'input[id*="email"]'
      ];

      for (let selector of emailSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector)
            .first()
            .scrollIntoView()
            .clear({ force: true })
            .type(this.passengerData.email, { force: true, delay: 50 });
          return;
        }
      }
    });

    cy.wait(500);
  }

  fillPhone() {
    cy.log(`Filling phone: ${this.passengerData.phone}`);

    cy.get('body').then(($body) => {
      const phoneSelectors = [
        'input[type="tel"]',
        'input[name*="phone"]',
        'input[name*="Phone"]',
        'input[placeholder*="Phone"]',
        'input[id*="phone"]'
      ];

      for (let selector of phoneSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector)
            .first()
            .scrollIntoView()
            .clear({ force: true })
            .type(this.passengerData.phone, { force: true, delay: 50 });
          return;
        }
      }
    });

    cy.wait(500);
  }

  fillDateOfBirth() {
    cy.log(`Filling date of birth: ${this.passengerData.dobDay}/${this.passengerData.dobMonth}/${this.passengerData.dobYear}`);

    cy.get('body').then(($body) => {

      if ($body.find('select[name*="day"]').length > 0) {
        cy.get('select[name*="day"]').first().select(this.passengerData.dobDay, { force: true });
      } else if ($body.find('input[name*="day"]').length > 0) {
        cy.get('input[name*="day"]').first().type(this.passengerData.dobDay, { force: true });
      }

      if ($body.find('select[name*="month"]').length > 0) {
        cy.get('select[name*="month"]').first().select(this.passengerData.dobMonth, { force: true });
      } else if ($body.find('input[name*="month"]').length > 0) {
        cy.get('input[name*="month"]').first().type(this.passengerData.dobMonth, { force: true });
      }

      if ($body.find('select[name*="year"]').length > 0) {
        cy.get('select[name*="year"]').first().select(this.passengerData.dobYear, { force: true });
      } else if ($body.find('input[name*="year"]').length > 0) {
        cy.get('input[name*="year"]').first().type(this.passengerData.dobYear, { force: true });
      }
    });

    cy.wait(500);
  }

  captureTotalPrice() {
    cy.log('Capturing total price from Passenger Details page');

    return cy.get('body').then(($body) => {
      const priceSelectors = [
        '[class*="total"][class*="price"]',
        '[data-selenium="total-price"]',
        '[class*="TotalPrice"]',
        '[class*="total"][class*="amount"]',
        'span:contains("Total") ~ span',
        'div:contains("Total"):not(:contains("Subtotal"))'
      ];

      let capturedPrice = 'Not Found';

      for (let selector of priceSelectors) {
        const $price = $body.find(selector);
        if ($price.length > 0) {
          capturedPrice = $price.first().text().trim();
          if (capturedPrice && capturedPrice !== '') {
            break;
          }
        }
      }

      if (capturedPrice === 'Not Found') {
        const $priceWithCurrency = $body.find('*').filter(function() {
          const text = $(this).text();
          return /[$€£¥SGD]\s*[0-9,]+/.test(text) || /[0-9,]+\s*[$€£¥SGD]/.test(text);
        });

        if ($priceWithCurrency.length > 0) {
          capturedPrice = $priceWithCurrency.first().text().trim();
        }
      }

      this.totalPrice = capturedPrice;
      cy.log(`Captured Total Price: ${capturedPrice}`);

      Cypress.env('passengerPagePrice', capturedPrice);
      Cypress.env('passengerDetails', this.passengerData);

      return cy.wrap(capturedPrice);
    });
  }

  fillPassengerDetails() {
    cy.log('Filling all passenger details');

    this.fillTitle();
    this.fillFirstName();
    this.fillLastName();
    this.fillEmail();
    this.fillPhone();
    this.fillDateOfBirth();

    cy.wait(1000);
  }

  clickContinue() {
    cy.log('Clicking Continue button');

    cy.get('body').then(($body) => {
      const continueButtonSelectors = [
        'button:contains("Continue")',
        'button:contains("Next")',
        'button:contains("Proceed")',
        'button[type="submit"]',
        'button:contains("Payment")'
      ];

      for (let selector of continueButtonSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().scrollIntoView().click({ force: true });
          break;
        }
      }
    });

    cy.wait(3000);
    cy.closePopupIfExists();
  }

  getPassengerData() {
    return this.passengerData;
  }

  getTotalPrice() {
    return this.totalPrice;
  }
}

export default PassengerDetailsPage;
