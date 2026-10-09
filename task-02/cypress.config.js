const { defineConfig } = require('cypress');
const dotenv = require('dotenv');

dotenv.config();

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    reportPageTitle: 'Task 02 - Restful Booker API Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: false,
    html: true,
    json: true
  },
  e2e: {
    baseUrl: process.env.BOOKER_BASE_URL || 'https://restful-booker.herokuapp.com',
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    responseTimeout: 30000,
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    trashAssetsBeforeRuns: true,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      bookerUsername: process.env.BOOKER_USERNAME || 'admin',
      bookerPassword: process.env.BOOKER_PASSWORD || 'password123'
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);

      return config;
    }
  },
});
