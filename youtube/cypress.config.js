const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: true,
    reportPageTitle: 'YouTube Trending Gaming E2E Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    overwrite: false,
    html: true,
    json: true
  },
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://www.youtube.com',
    viewportWidth: 1920,
    viewportHeight: 1080,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    trashAssetsBeforeRuns: true,
    chromeWebSecurity: false,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 1,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {

    },
    setupNodeEvents(on, config) {

      require('cypress-mochawesome-reporter/plugin')(on);

      return config;
    }
  },
});
