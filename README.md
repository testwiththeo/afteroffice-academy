# Final Project Bootcamp Cypress AfterOffice Batch #1

Buatlah E2E automation untuk flow:

---

## 1. Pesan Tiket Flight — agoda.com

- Penerbangan dari **Jakarta** ke **Singapura**
- Pilih penerbangan **paling awal** untuk **besok** (seandainya sekarang tanggal 25 May, pesan untuk 26 May), menggunakan **Malaysia Airlines**
- Masukkan data penumpang pada halaman **Passenger Detail**
- Expect **total price**, **data passenger** sudah sama seperti saat di halaman passenger detail
- Expect **departure time** dan **arrival time** sama seperti yang dipilih saat memilih penerbangan
- Expect datanya dilakukan di page memilih pembayaran (**gak perlu bayar**)

## 2. Cari Barang — amazon.com

- Gunakan viewport **1920x1080**
- Search item **'chair'**
- Urutkan berdasarkan **Harga termahal**
- Pilih item **paling kanan** dari barisan pertama yang **bukan iklan**
- Expect **nama barang** dan **harga** sama seperti yang muncul di search page (untuk harga, tidak perlu expect sampai sen (seperti $100.xx), cukup sampai **digit satuan** saja)

## 3. Search Video — youtube.com

- Pilih menu **Gaming** pada sidebar, untuk mengakses halaman gaming
- Masuk ke halaman video trending, dengan klik **'View All'** pada bagian Trending videos
- Pilih video trending **no.3**
- Di halaman video, expect **title** dan **youtube channel**-nya sama seperti yang di page trending

---

## Ketentuan dalam Pengumpulan Final Project

- Mengumpulkan tugas, **berjalan sampai sukses**, dan menyertakan dokumentasi dalam bentuk **video** (bawaan Cypress)
- Memberikan hasil dokumentasi dalam bentuk **HTML**
- Menggunakan **POM** (Page Object Model)
- Menggunakan **environment variable**
- Dokumen dikumpulkan menggunakan **git** (tambahkan **GitHub Action (CI/CD)** — opsional)

---

## Implementasi di Repository Ini

| Ketentuan | Lokasi |
|-----------|--------|
| Flow agoda.com | `agoda/` |
| Flow amazon.com | `amazon/` |
| Flow youtube.com | `youtube/` |
| POM | `cypress/pages/` di masing-masing folder |
| Environment variable | `cypress.env.json` + `Cypress.env()` |
| Video dokumentasi (bawaan Cypress) | `cypress/videos/` (auto-record, `video: true`) |
| Dokumentasi HTML | `cypress/reports/html/index.html` (mochawesome reporter) |
| GitHub Action (CI/CD) | `.github/workflows/e2e.yml` di masing-masing folder |

## Cara Menjalankan

```bash
# masuk ke folder suite yang dijalankan
cd agoda    # atau: cd amazon, cd youtube

# install dependencies
npm install

# jalankan test + generate report HTML & video
npm run test:report
```

## Melihat Hasil Dokumentasi

- **Video (bawaan Cypress):** buka file `.mp4` di `cypress/videos/`
- **Report HTML:** buka `cypress/reports/html/index.html` di browser

```bash
open cypress/reports/html/index.html    # Mac
xdg-open cypress/reports/html/index.html  # Linux
start cypress/reports/html/index.html   # Windows
```
