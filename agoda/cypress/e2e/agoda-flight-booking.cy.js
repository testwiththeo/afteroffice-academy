import FlightSearchPage from '../pages/FlightSearchPage';
import FlightResultsPage from '../pages/FlightResultsPage';
import PassengerDetailsPage from '../pages/PassengerDetailsPage';
import PaymentPage from '../pages/PaymentPage';

describe('Agoda Flight Booking E2E Test', () => {

  const flightSearchPage = new FlightSearchPage();
  const flightResultsPage = new FlightResultsPage();
  const passengerDetailsPage = new PassengerDetailsPage();
  const paymentPage = new PaymentPage();

  const testData = {
    origin: Cypress.env('testData')?.origin || 'Jakarta',
    destination: Cypress.env('testData')?.destination || 'Singapore',
    airline: Cypress.env('testData')?.airline || 'Malaysia Airlines'
  };

  const passengerData = Cypress.env('testData')?.passenger || {};

  before(() => {

    Cypress.env('selectedFlight', null);
    Cypress.env('passengerPagePrice', null);
    Cypress.env('passengerDetails', null);
  });

  it('Should complete flight booking flow from search to payment page verification', () => {

    cy.log('=== STEP 1: FLIGHT SEARCH ===');

    flightSearchPage.visit();
    flightSearchPage.searchFlight(testData.origin, testData.destination);

    cy.log('=== STEP 2: FLIGHT SELECTION ===');

    flightResultsPage.waitForResults();

    flightResultsPage.filterByAirline(testData.airline);

    flightResultsPage.sortByEarliestDeparture();

    flightResultsPage.selectEarliestFlight(testData.airline).then((flightData) => {
      cy.log('✓ Flight selected successfully');
      cy.log(`  Departure Time: ${flightData.departureTime}`);
      cy.log(`  Arrival Time: ${flightData.arrivalTime}`);
    });

    cy.log('=== STEP 3: PASSENGER DETAILS ===');

    passengerDetailsPage.waitForPageLoad();

    if (Object.keys(passengerData).length > 0) {
      Object.assign(passengerDetailsPage.passengerData, passengerData);
    }

    passengerDetailsPage.fillPassengerDetails();

    passengerDetailsPage.captureTotalPrice().then((price) => {
      cy.log(`✓ Total Price captured: ${price}`);
    });

    const enteredPassenger = passengerDetailsPage.getPassengerData();
    cy.log('✓ Passenger details entered:');
    cy.log(`  Name: ${enteredPassenger.title} ${enteredPassenger.firstName} ${enteredPassenger.lastName}`);
    cy.log(`  Email: ${enteredPassenger.email}`);
    cy.log(`  Phone: ${enteredPassenger.phone}`);

    passengerDetailsPage.clickContinue();

    cy.log('=== STEP 4: PAYMENT PAGE VERIFICATION ===');

    paymentPage.waitForPageLoad();

    paymentPage.verifyPaymentPageWithoutPaying();

    paymentPage.verifyPaymentButtonExists();

    cy.log('=== ✓ TEST COMPLETED SUCCESSFULLY ===');
    cy.log('All verifications passed:');
    cy.log('  ✓ Total price matches between pages');
    cy.log('  ✓ Passenger details are correct');
    cy.log('  ✓ Flight times are verified');
    cy.log('  ⚠️  Payment NOT submitted (as required)');
  });

  after(() => {

    cy.log('=== TEST SUMMARY ===');
    cy.log(`Origin: ${testData.origin}`);
    cy.log(`Destination: ${testData.destination}`);
    cy.log(`Airline: ${testData.airline}`);

    cy.then(() => {
      const flight = Cypress.env('selectedFlight');
      const price = Cypress.env('passengerPagePrice');
      const passenger = Cypress.env('passengerDetails');

      if (flight) {
        cy.log(`Flight Departure: ${flight.departureTime}`);
        cy.log(`Flight Arrival: ${flight.arrivalTime}`);
      }

      if (price) {
        cy.log(`Total Price: ${price}`);
      }

      if (passenger) {
        cy.log(`Passenger: ${passenger.firstName} ${passenger.lastName}`);
      }
    });
  });
});
