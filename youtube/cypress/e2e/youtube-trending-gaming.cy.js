import HomePage from '../pages/HomePage';
import GamingPage from '../pages/GamingPage';
import TrendingPage from '../pages/TrendingPage';
import VideoPage from '../pages/VideoPage';

describe('YouTube Trending Gaming Video E2E Test', () => {

  const homePage = new HomePage();
  const gamingPage = new GamingPage();
  const trendingPage = new TrendingPage();
  const videoPage = new VideoPage();

  const testData = {
    category: Cypress.env('testData')?.category || 'Gaming',
    videoPosition: Cypress.env('testData')?.videoPosition || 3
  };

  before(() => {

    Cypress.env('selectedVideo', null);
  });

  it('Should navigate to gaming trending, select 3rd video, and verify details', () => {

    cy.log('=== STEP 1: NAVIGATE TO YOUTUBE ===');

    homePage.visit();

    cy.log(`=== STEP 2: CLICK ${testData.category.toUpperCase()} OPTION ===`);

    homePage.clickGaming(testData.category);

    cy.log('=== STEP 3: LOCATE TRENDING VIDEOS SECTION ===');

    gamingPage.waitForPageLoad();
    gamingPage.locateTrendingSection();

    cy.log('=== STEP 4: CLICK VIEW ALL ===');

    gamingPage.clickViewAll();

    cy.log('=== STEP 5: SELECT 3RD VIDEO ===');

    trendingPage.waitForPageLoad();

    trendingPage.selectThirdVideo().then((videoData) => {
      cy.log('✓ Video #3 selected and details captured:');
      cy.log(`  Video Title: ${videoData.title}`);
      cy.log(`  Channel Name: ${videoData.channelName}`);
    });

    cy.log('=== STEP 6: VIDEO PAGE VERIFICATION ===');

    videoPage.waitForPageLoad();

    videoPage.verifyVideoPlayerExists();

    videoPage.verifyVideoTitle();

    videoPage.verifyChannelName();

    cy.log('=== ✓ TEST COMPLETED SUCCESSFULLY ===');
    cy.log('All verifications passed:');
    cy.log('  ✓ Video title matches between pages');
    cy.log('  ✓ Channel name matches between pages');
    cy.log('  ✓ 3rd video from trending list was selected');
  });

  after(() => {

    cy.log('=== TEST SUMMARY ===');
    cy.log('Flow: YouTube Home → Gaming → Trending → Video #3');

    cy.then(() => {
      const video = Cypress.env('selectedVideo');

      if (video) {
        cy.log('=== SELECTED VIDEO DETAILS ===');
        cy.log(`Video Title: ${video.title}`);
        cy.log(`Channel Name: ${video.channelName}`);
        cy.log(`Video URL: ${video.url}`);
      }
    });
  });
});
