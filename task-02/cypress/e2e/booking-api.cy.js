import BookerApi from '../support/api/booker-api';

const bookerApi = new BookerApi();

let bookingData;
let authToken;
let bookingId;

before(() => {
  cy.fixture('booking').then((data) => {
    bookingData = data;
  });
});

describe('Tugas 2 - Restful Booker API Testing', () => {

  it('Step 1 - Auth: mendapatkan token', () => {
    bookerApi.createToken().then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('token');
      expect(response.body.token).to.be.a('string').and.not.empty;

      authToken = response.body.token;
      cy.log('Token berhasil didapatkan');
    });
  });

  it('Step 2 - CreateBooking: membuat booking baru', () => {
    bookerApi.createBooking(bookingData).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('bookingid');
      expect(response.body.bookingid).to.be.a('number');

      expect(response.body.booking).to.deep.equal(bookingData);

      bookingId = response.body.bookingid;
      cy.log(`Booking berhasil dibuat dengan bookingId: ${bookingId}`);
    });
  });

  it('Step 3 - GetBooking: memastikan data booking sudah dibuat', () => {
    bookerApi.getBooking(bookingId).then((response) => {
      expect(response.status).to.eq(200);

      expect(response.body).to.deep.equal(bookingData);

      cy.log('Data booking sesuai dengan yang dikirim saat createBooking');
    });
  });

  it('Step 4 - DeleteBooking: menghapus data booking', () => {
    bookerApi.deleteBooking(bookingId, authToken).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.eq('Created');

      cy.log(`Booking ${bookingId} berhasil dihapus`);
    });
  });

});
