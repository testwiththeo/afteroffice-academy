class FlightSearchPage {

  selectors = {
    flightTab: '[data-selenium="flightTab"], a[href*="flights"]',
    originInput: '#textInput, [data-selenium="origin-input"], input[placeholder*="From"], input[name="origin"]',
    destinationInput: '[data-selenium="destination-input"], input[placeholder*="To"], input[name="destination"]',
    dateInput: '[data-selenium="departureDate"], input[placeholder*="Departure"]',
    searchButton: '[data-selenium="searchButton"], button[type="submit"], button:contains("Search")',
    locationSuggestion: '.Suggestion, [data-selenium="suggestion"], [class*="suggestion"]',
    datePickerDay: '.DayPicker-Day, [class*="Day"]:not([class*="disabled"])',
    calendarMonth: '.DayPicker-Month, [class*="Month"]',
    oneWayTrip: '[data-selenium="flightSearchType"] input[value="OneWay"], label:contains("One-way")',
    loadingOverlay: '.loading, [class*="Loading"], [class*="spinner"]'
  };

  visit() {
    cy.visit('/flights');
    cy.wait(2000);
    cy.closePopupIfExists();
  }

  setOrigin(origin) {
    cy.log(`Setting origin to: ${origin}`);

    cy.get('body').then(($body) => {

      if ($body.find('[data-selenium="origin-input"]').length) {
        cy.get('[data-selenium="origin-input"]').clear().type(origin, { delay: 100 });
      }

      else if ($body.find('input[placeholder*="From"]').length) {
        cy.get('input[placeholder*="From"]').first().clear().type(origin, { delay: 100 });
      }

      else {
        cy.get('input[name="origin"], input[aria-label*="origin"], input[aria-label*="From"]')
          .first()
          .clear()
          .type(origin, { delay: 100 });
      }
    });

    cy.wait(1500);
    this.selectFromSuggestions(origin);
  }

  setDestination(destination) {
    cy.log(`Setting destination to: ${destination}`);

    cy.get('body').then(($body) => {

      if ($body.find('[data-selenium="destination-input"]').length) {
        cy.get('[data-selenium="destination-input"]').clear().type(destination, { delay: 100 });
      }

      else if ($body.find('input[placeholder*="To"]').length) {
        cy.get('input[placeholder*="To"]').first().clear().type(destination, { delay: 100 });
      }

      else {
        cy.get('input[name="destination"], input[aria-label*="destination"], input[aria-label*="To"]')
          .first()
          .clear()
          .type(destination, { delay: 100 });
      }
    });

    cy.wait(1500);
    this.selectFromSuggestions(destination);
  }

  selectFromSuggestions(text) {
    cy.get('body').then(($body) => {
      const suggestionSelectors = [
        `[data-selenium="suggestion"]:contains("${text}")`,
        `.Suggestion:contains("${text}")`,
        `[class*="suggestion"]:contains("${text}")`,
        `li:contains("${text}")`,
        `[role="option"]:contains("${text}")`
      ];

      for (let selector of suggestionSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click({ force: true });
          cy.wait(500);
          return;
        }
      }

      cy.log('No suggestion dropdown found, pressing Enter');
      cy.focused().type('{enter}');
    });
  }

  selectDepartureDate() {
    cy.log('Selecting departure date: Tomorrow');

    cy.get('body').then(($body) => {
      const dateInputSelectors = [
        '[data-selenium="departureDate"]',
        'input[placeholder*="Departure"]',
        'input[placeholder*="Check-in"]',
        '[aria-label*="Departure"]'
      ];

      for (let selector of dateInputSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click({ force: true });
          cy.wait(1000);
          break;
        }
      }
    });

    cy.getTomorrowDate().then((tomorrow) => {
      cy.log(`Tomorrow's date: ${tomorrow.formatted}`);

      cy.get('body').then(($body) => {

        const dayNumber = tomorrow.date;

        if ($body.find(`[aria-label*="${tomorrow.formatted}"]`).length) {
          cy.get(`[aria-label*="${tomorrow.formatted}"]`).first().click({ force: true });
        }

        else {
          cy.get('[class*="Day"]:not([class*="disabled"])').each(($day) => {
            const dayText = $day.text().trim();
            if (dayText === dayNumber.toString()) {

              cy.wrap($day).click({ force: true });
              return false;
            }
          });
        }
      });
    });

    cy.wait(1000);
  }

  clickSearch() {
    cy.log('Clicking search button');

    cy.get('body').then(($body) => {
      const searchButtonSelectors = [
        '[data-selenium="searchButton"]',
        'button[type="submit"]',
        'button:contains("Search")',
        'button[class*="search"]'
      ];

      for (let selector of searchButtonSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().scrollIntoView().click({ force: true });
          break;
        }
      }
    });

    cy.wait(3000);
    cy.closePopupIfExists();
  }

  searchFlight(origin, destination) {
    this.setOrigin(origin);
    this.setDestination(destination);
    this.selectDepartureDate();
    this.clickSearch();
  }
}

export default FlightSearchPage;
