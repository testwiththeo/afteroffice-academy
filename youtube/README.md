# YouTube Trending Gaming Video E2E Test Automation

[![Cypress Tests](https://img.shields.io/badge/tests-Cypress-17202C?logo=cypress)](https://www.cypress.io/)
[![Page Object Model](https://img.shields.io/badge/pattern-POM-blue)](#)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions)]()

## 📋 Overview

This project contains an End-to-End (E2E) automated test suite for YouTube.com trending gaming video flow using **Cypress** framework with **Page Object Model (POM)** design pattern. Includes automated HTML reporting, video recording, and CI/CD integration.

## 🎯 Test Scenario

### 1. Navigation
- Navigate to **YouTube.com** homepage
- Click **"Gaming"** in the sidebar navigation

### 2. Trending Section
- Locate the **"Trending videos"** section on the Gaming page
- Click **"View All"** to open the full Trending videos page

### 3. Video Selection
- Select the **3rd video (No. 3)** in the trending list
- **Capture & Store**: Video Title and Channel Name

### 4. Video Page Verification
- Open the 3rd video
- **Verify**:
  - ✓ Video Title matches Trending page
  - ✓ Channel Name matches Trending page

## 📁 Project Structure

```
youtube/
├── .github/
│   └── workflows/
│       └── e2e.yml                          # GitHub Actions CI/CD workflow
├── cypress/
│   ├── e2e/
│   │   └── youtube-trending-gaming.cy.js   # Main E2E test spec
│   ├── pages/                               # Page Object Model classes
│   │   ├── HomePage.js                     # YouTube home page POM
│   │   ├── GamingPage.js                   # Gaming page POM
│   │   ├── TrendingPage.js                 # Trending videos page POM
│   │   └── VideoPage.js                    # Video page POM
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
cd youtube
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
  "baseUrl": "https://www.youtube.com",
  "viewport": { "width": 1920, "height": 1080 },
  "testData": {
    "category": "Gaming",
    "trendingSection": "Trending",
    "videoPosition": 3
  },
  "enableVideoRecording": true,
  "enableScreenshots": true
}
```

### Accessing Config Dynamically in Tests

```javascript
const baseUrl = Cypress.env('baseUrl');
const videoPosition = Cypress.env('testData').videoPosition;
```

### Key Settings (`cypress.config.js`)

- **Base URL**: Configurable via `CYPRESS_BASE_URL` env var
- **Video Recording**: Enabled (`video: true`)
- **HTML Reporter**: cypress-mochawesome-reporter
- **Retry**: 2 attempts in run mode
- **Memory Management**: Enabled (for video-heavy pages)

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

Videos are automatically recorded for every test run (MP4, compressed) — including video playback on watched pages:

```bash
# View video
open cypress/videos/youtube-trending-gaming.cy.js.mp4
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
- ✅ Manual trigger + daily schedule (4 AM UTC)
- ✅ Tests on Chrome, Firefox, Edge (matrix strategy)
- ✅ Generates HTML reports
- ✅ Uploads artifacts (reports, screenshots, videos) — 30-day retention

### Triggering CI/CD

**Automatic:**
```bash
git push origin main
```

**Manual:** GitHub → Actions → "YouTube E2E Tests" → Run workflow

### Viewing Results

1. Repository → **Actions** tab → workflow run
2. Download artifacts: `youtube-cypress-results-{browser}`, `youtube-html-report-{browser}`

## 🎨 Page Object Model (POM) Architecture

### Page Object Classes

#### 1. HomePage
```javascript
visit()               // Navigate to YouTube.com
expandSidebar()       // Expand collapsed sidebar
clickGaming()         // Click Gaming in sidebar
```

#### 2. GamingPage
```javascript
waitForPageLoad()           // Wait for Gaming page
locateTrendingSection()     // Find Trending section
clickViewAll()              // Open full trending page
```

#### 3. TrendingPage
```javascript
waitForPageLoad()      // Wait for trending page
getVideoItems()        // Get all video items
selectThirdVideo()     // Select 3rd video, capture data
```

#### 4. VideoPage
```javascript
waitForPageLoad()        // Wait for video page
verifyVideoTitle()       // Verify title match
verifyChannelName()      // Verify channel match
verifyVideoPlayerExists() // Confirm player visible
```

## 🛠️ Custom Cypress Commands

- `cy.handleYouTubeConsent()` - Handle consent/cookie dialogs
- `cy.waitForYouTubePageLoad()` - Wait for full page load
- `cy.openSidebarIfClosed()` - Expand sidebar if in mini mode
- `cy.getCleanText(selector)` - Extract normalized text
- `cy.safeClick(selector)` - Click with overlay handling
- `cy.waitForNavigation(urlPattern)` - Wait for navigation

## 🐛 Debugging & Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Gaming section not found | Test falls back to direct `/gaming` navigation |
| Trending section missing | Scroll more; YouTube may relocate it |
| Title/channel mismatch | Check text normalization logic |
| Consent dialog blocks test | Handled automatically by `cy.handleYouTubeConsent()` |
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
✅ Dynamic sidebar & consent handling  

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
