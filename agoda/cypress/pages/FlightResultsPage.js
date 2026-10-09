class FlightResultsPage {

  selectors = {
    flightCard: '[data-selenium="flight-card"], [class*="FlightCard"], [class*="flight-item"]',
    airlineFilter: '[data-selenium="airline-filter"], [class*="airline"][class*="filter"]',
    sortDropdown: '[data-selenium="sort-dropdown"], select[name*="sort"]',
    flightDetails: '[class*="flight-detail"], [class*="FlightDetail"]',
    departureTime: '[data-selenium="departure-time"], [class*="departure"][class*="time"]',
    arrivalTime: '[data-selenium="arrival-time"], [class*="arrival"][class*="time"]',
    selectButton: '[data-selenium="select-flight"], button:contains("Select"), button:contains("Choose")',
    airlineName: '[class*="airline"][class*="name"], [data-selenium="airline-name"]',
    loadingSpinner: '[class*="loading"], [class*="spinner"]',
    filterSection: '[class*="filter"], [data-selenium="filters"]',
    priceDisplay: '[class*="price"], [data-selenium="price"]'
  };

  flightData = {
    departureTime: null,
    arrivalTime: null,
    airline: null,
    price: null
  };

  waitForResults() {
    cy.log('Waiting for flight results to load');
    cy.wait(3000);

    cy.get('body').then(($body) => {
      if ($body.find('[class*="loading"], [class*="Loading"]').length > 0) {
        cy.get('[class*="loading"], [class*="Loading"]', { timeout: 30000 }).should('not.exist');
      }
    });

    cy.wait(2000);
    cy.closePopupIfExists();
  }

  filterByAirline(airline) {
    cy.log(`Filtering flights by airline: ${airline}`);

    cy.get('body').then(($body) => {

      if ($body.find(`[class*="filter"]:contains("${airline}")`).length > 0) {
        cy.get(`[class*="filter"]:contains("${airline}")`)
          .first()
          .scrollIntoView()
          .click({ force: true });
      }

      else if ($body.find(`input[type="checkbox"] + label:contains("${airline}")`).length > 0) {
        cy.get(`input[type="checkbox"] + label:contains("${airline}")`)
          .first()
          .scrollIntoView()
          .click({ force: true });
      }

      else if ($body.find(`label:contains("${airline}")`).length > 0) {
        cy.get(`label:contains("${airline}")`)
          .first()
          .scrollIntoView()
          .click({ force: true });
      }
      else {
        cy.log(`Could not find filter for ${airline}, will select from available flights`);
      }
    });

    cy.wait(2000);
  }

  sortByEarliestDeparture() {
    cy.log('Sorting flights by earliest departure time');

    cy.get('body').then(($body) => {

      const sortSelectors = [
        'select[name*="sort"]',
        '[data-selenium="sort"]',
        'button:contains("Sort")',
        '[class*="sort"]'
      ];

      for (let selector of sortSelectors) {
        if ($body.find(selector).length > 0) {
          cy.get(selector).first().click({ force: true });
          cy.wait(500);

          cy.get('body').then(($body2) => {
            if ($body2.find('option:contains("Departure")').length > 0) {
              cy.get('option:contains("Departure")').first().parent().select($body2.find('option:contains("Departure")').first().val());
            } else if ($body2.find('[role="option"]:contains("Departure")').length > 0) {
              cy.get('[role="option"]:contains("Departure")').first().click({ force: true });
            }
          });

          break;
        }
      }
    });

    cy.wait(2000);
  }

  selectEarliestFlight(preferredAirline = 'Malaysia Airlines') {
    cy.log('Selecting earliest flight');

    const flightCardSelectors = [
      '[data-selenium="flight-card"]',
      '[class*="FlightCard"]',
      '[class*="flight-item"]',
      '[class*="FlightResult"]',
      'div[class*="flight"][class*="row"]'
    ];

    const timeSelectors = [
      '[data-selenium="departure-time"]',
      '[class*="departure"][class*="time"]',
      'time',
      '[class*="time"]'
    ];

    return cy.get(flightCardSelectors.join(', '), { timeout: 15000 })
      .first()
      .scrollIntoView()
      .then(($card) => {

        const $times = $card
          .find(timeSelectors.join(', '))
          .filter((i, el) => /:\d{2}/.test(Cypress.$(el).text()));

        const departureTime = $times.length >= 1 ? $times.eq(0).text().trim() : 'Not Found';
        const arrivalTime = $times.length >= 2 ? $times.eq(1).text().trim() : 'Not Found';

        this.flightData = {
          departureTime,
          arrivalTime,
          airline: preferredAirline
        };

        cy.log(`Captured Departure Time: ${departureTime}`);
        cy.log(`Captured Arrival Time: ${arrivalTime}`);
        Cypress.env('selectedFlight', this.flightData);

        return cy.wrap($card);
      })
      .then(($card) => {

        cy.wrap($card)
          .find('button')
          .filter(':contains("Select"), :contains("Choose"), :contains("Book")')
          .first()
          .click({ force: true });

        cy.wait(3000);
        cy.closePopupIfExists();
        return cy.wrap(this.flightData);
      });
  }

  getFlightData() {
    return this.flightData;
  }

  captureFlightDetails() {
    const flightDetails = Cypress.env('selectedFlight') || this.flightData;
    cy.log('Flight Details Captured:', JSON.stringify(flightDetails));
    return cy.wrap(flightDetails);
  }
}

export default FlightResultsPage;
