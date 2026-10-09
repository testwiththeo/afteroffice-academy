# Amazon Product Search & Details E2E Test Automation

[![Cypress Tests](https://img.shields.io/badge/tests-Cypress-17202C?logo=cypress)](https://www.cypress.io/)
[![Page Object Model](https://img.shields.io/badge/pattern-POM-blue)](#)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions)]()

## 📋 Overview

This project contains an End-to-End (E2E) automated test suite for Amazon.com product search & details flow using **Cypress** framework with **Page Object Model (POM)** design pattern. Includes automated HTML reporting, video recording, and CI/CD integration.

## 🎯 Test Scenario

### 1. Viewport & Setup
- Set browser viewport to **1920x1080**
- Navigate to **Amazon.com**

### 2. Search & Filter
- Search for keyword: **"chair"**
- Sort results by **Price: High to Low**

### 3. Product Selection
- Locate the **first row** of search results
- Select the **rightmost item** that is **NOT sponsored/ad**
- **Capture & Store**: Product Name and Price (integer only, e.g., $100 ignoring cents)

### 4. Product Detail Page Verification
- **Verify**:
  - ✓ Product Name matches stored title
  - ✓ Product Price (integer) matches stored price

## 📁 Project Structure

```
amazon/
├── .github/
│   └── workflows/
│       └── e2e.yml                          # GitHub Actions CI/CD workflow
├── cypress/
│   ├── e2e/
│   │   └── amazon-product-search.cy.js     # Main E2E test spec
│   ├── pages/                               # Page Object Model classes
│   │   ├── HomePage.js                     # Amazon home page POM
│   │   ├── SearchResultsPage.js            # Search results page POM
│   │   └── ProductDetailPage.js            # Product detail page POM
│   ├── support/
│   │   ├── commands.js                      # Custom Cypress commands
│   │   └── e2e.js                           # Global configuration
│   ├── fixtures/                            # Test data fixtures
│   ├── reports/                             # HTML reports (auto-generated)
│   ├── screenshots/                         # Screenshots on failure
│   └── videos/                              # Video recordings
├── cypress.config.js                        # Cypress configuration
├── cypress.env.json                         # Environment variables
├── package.json                             # Project dependencies
├── .gitignore                              # Git ignore rules
└── README.md                                # This file
```

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Step 1: Navigate to Project Folder

```bash
cd amazon
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs Cypress, cypress-mochawesome-reporter, and all dependencies.

### Step 3: Verify Installation

```bash
npx cypress verify
```

## ⚙️ Configuration

### Environment Variables (`cypress.env.json`)

```json
{
  "baseUrl": "https://www.amazon.com",
  "viewport": { "width": 1920, "height": 1080 },
  "testData": {
    "searchKeyword": "chair",
    "sortOrder": "price-desc-rank"
  },
  "enableVideoRecording": true,
  "enableScreenshots": true
}
```

### Accessing Config Dynamically in Tests

```javascript
const baseUrl = Cypress.env('baseUrl');
const keyword = Cypress.env('testData').searchKeyword;
```

### Key Settings (`cypress.config.js`)

- **Base URL**: Configurable via `CYPRESS_BASE_URL` env var
- **Video Recording**: Enabled (`video: true`)
- **HTML Reporter**: cypress-mochawesome-reporter
- **Retry**: 2 attempts in run mode
- **Viewport**: 1920x1080

## 🏃 Running the Tests

### Interactive Mode (Cypress Test Runner)

```bash
npm run cy:open
```

### Headless Mode (Command Line)

```bash
# Run all tests
npm test

# Run with Chrome browser
npm run test:chrome

# Run in headed mode (visible browser)
npm run test:headed

# Run with HTML report generation
npm run test:report
```

### CI/CD Mode

```bash
npm run ci:test
```

## 📊 HTML Reports & Video Recordings

### Accessing HTML Reports

```bash
# Run tests and generate report
npm run test:report
```

**View the report:**

1. Navigate to: `cypress/reports/html/`
2. Open `index.html` in your browser
3. Report includes: pass/fail stats, charts, screenshots, stack traces

**Direct access:**
```bash
open cypress/reports/html/index.html      # Mac
xdg-open cypress/reports/html/index.html  # Linux
start cypress/reports/html/index.html     # Windows
```

### Video Recordings

**Location:** `cypress/videos/`

Videos are automatically recorded for every test run (MP4, compressed):

```bash
# View video
open cypress/videos/amazon-product-search.cy.js.mp4
```

### Screenshots (on Failure)

**Location:** `cypress/screenshots/`

### Cleaning Artifacts

```bash
npm run clean:reports
```

## 🔄 CI/CD Integration (GitHub Actions)

### Workflow File: `.github/workflows/e2e.yml`

The workflow:
- ✅ Runs on push/PR to `main`, `master`, `develop`
- ✅ Manual trigger + daily schedule (3 AM UTC)
- ✅ Tests on Chrome, Firefox, Edge (matrix strategy)
- ✅ Generates HTML reports
- ✅ Uploads artifacts (reports, screenshots, videos) — 30-day retention

### Triggering CI/CD

**Automatic:**
```bash
git push origin main
```

**Manual:** GitHub → Actions → "Amazon E2E Tests" → Run workflow

### Viewing Results

1. Repository → **Actions** tab → workflow run
2. Download artifacts: `amazon-cypress-results-{browser}`, `amazon-html-report-{browser}`

## 🎨 Page Object Model (POM) Architecture

### Page Object Classes

#### 1. HomePage
```javascript
visit()                    // Navigate to Amazon.com
searchProduct(keyword)     // Search for product
```

#### 2. SearchResultsPage
```javascript
waitForResults()                          // Wait for results
sortByPriceHighToLow()                    // Sort by price
getFirstRowProducts()                     // Get first row items
selectRightmostNonSponsoredProduct()      // Skip ads, select product
```

#### 3. ProductDetailPage
```javascript
waitForPageLoad()          // Wait for detail page
verifyProductTitle()       // Verify title match
verifyProductPrice()       // Verify price (integer) match
```

## 🛠️ Custom Cypress Commands

- `cy.extractIntegerPrice(priceText)` - Extract integer price ("$1,234.56" → 1234)
- `cy.isSponsored($element)` - Detect sponsored/ad products
- `cy.handleAmazonCaptcha()` - CAPTCHA detection
- `cy.closePopupIfExists()` - Close popups/overlays
- `cy.waitForElement(selector, timeout)` - Smart element waiting

## 🐛 Debugging & Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| CAPTCHA appears | Use residential proxy, reduce frequency, add delays |
| Sponsored not detected | Update detection logic in SearchResultsPage |
| Price mismatch | Check personalized pricing; ensure integer comparison |
| Reports missing | Run `npm run report:merge && npm run report:generate` |

### Debug Tips

```bash
DEBUG=cypress:* npm test          # Debug output
npm run test:debug                # Interactive debug
```

## 🔒 Best Practices Implemented

✅ Page Object Model (POM) design pattern  
✅ Environment-based configuration (`Cypress.env()`)  
✅ Automated HTML reporting  
✅ Video recording for all tests  
✅ Screenshot capture on failure  
✅ CI/CD integration (GitHub Actions)  
✅ Multi-browser testing  
✅ Retry mechanism for flaky tests  

## 📄 License

ISC

---

**Author**: Senior Software QA Automation Engineer  
**Framework**: Cypress v13.6.0  
**Design Pattern**: Page Object Model (POM)  
**Reporting**: cypress-mochawesome-reporter  
**CI/CD**: GitHub Actions  
**Last Updated**: 2026-10-08

---

## ⭐ Quick Start Commands

```bash
# Setup
npm install

# Run tests with report
npm run test:report

# View HTML report
open cypress/reports/html/index.html

# View videos
open cypress/videos/

# Clean artifacts
npm run clean:reports
```
