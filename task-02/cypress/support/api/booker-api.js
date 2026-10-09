class BookerApi {
  createToken() {
    return cy.request({
      method: 'POST',
      url: '/auth',
      body: {
        username: Cypress.env('bookerUsername'),
        password: Cypress.env('bookerPassword')
      }
    });
  }

  createBooking(bookingData) {
    return cy.request({
      method: 'POST',
      url: '/booking',
      body: bookingData
    });
  }

  getBooking(bookingId) {
    return cy.request({
      method: 'GET',
      url: `/booking/${bookingId}`,
      headers: {
        Accept: 'application/json'
      }
    });
  }

  deleteBooking(bookingId, token) {
    return cy.request({
      method: 'DELETE',
      url: `/booking/${bookingId}`,
      headers: {
        Cookie: `token=${token}`
      }
    });
  }
}

export default BookerApi;
