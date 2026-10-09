# Tugas 2 After Office - Cypress (API Testing)

E2E API testing untuk [Restful Booker](https://restful-booker.herokuapp.com/apidoc/index.html) menggunakan Cypress.

## Skenario Test

| Step | API | Method | Endpoint | Expect Status Code |
|------|-----|--------|----------|-------------------|
| 1 | Auth (create token) | POST | `/auth` | 200 |
| 2 | CreateBooking | POST | `/booking` | 200 |
| 3 | GetBooking | GET | `/booking/{id}` | 200 |
| 4 | DeleteBooking | DELETE | `/booking/{id}` | 201 |

### Detail Expectation

1. **Auth** — mendapatkan token dari credentials (disimpan di file `.env`), token dipakai untuk delete booking.
2. **CreateBooking** — membuat booking baru dari data di `cypress/fixtures/booking.json`, response berisi `bookingId`, dan isi `booking` di response **harus sama** dengan body yang dikirim.
3. **GetBooking** — memakai `bookingId` dari response CreateBooking (step 2), isi body **harus sama** dengan body saat createBooking.
4. **DeleteBooking** — memakai `bookingId` (step 2) + token (step 1), status code `201 Created`.

## Struktur Project

```
task-02/
├── cypress/
│   ├── e2e/
│   │   └── booking-api.cy.js        # 4 step test (auth -> create -> get -> delete)
│   ├── fixtures/
│   │   └── booking.json             # data booking (terpisah sesuai ketentuan)
│   └── support/
│       ├── api/
│       │   └── booker-api.js        # service layer (semua request API)
│       └── e2e.js
├── .env                             # credentials user (tidak di-commit)
├── .env.example                     # template .env
├── .github/workflows/e2e.yml        # GitHub Actions CI
├── cypress.config.js                # config + load .env via dotenv
├── package.json
└── README.md
```

## Setup

```bash
cd task-02
npm install
cp .env.example .env
```

Isi `.env` dengan credentials (default Restful Booker: `admin` / `password123`):

```
BOOKER_BASE_URL=https://restful-booker.herokuapp.com
BOOKER_USERNAME=admin
BOOKER_PASSWORD=password123
```

> File `.env` sengaja tidak di-commit (ada di `.gitignore`). Credentials di-load via `dotenv` ke `Cypress.env()`.

## Menjalankan Test

```bash
# jalankan test + generate report HTML & video
npm run test:report

# atau terpisah
npm test
npm run report:merge && npm run report:generate
```

> Catatan: Restful Booker hosted di Render dan bisa "tidur" — request pertama kadang lambat karena service bangun. `responseTimeout` sudah diset 30 detik + retry 2x di run mode.

## Hasil Dokumentasi

- **Video (bawaan Cypress):** `cypress/videos/booking-api.cy.js.mp4`
- **Report HTML:** `cypress/reports/html/index.html`

## Chaining Antar Step

`bookingId` (dari step 2) dan `token` (dari step 1) dishare antar test via module-level variable di spec file, jadi urutan eksekusi step 1 → 4 membentuk satu alur utuh.
