class VideoPage {

  selectors = {
    videoPlayer: 'video, #movie_player',
    videoTitle: 'h1.ytd-watch-metadata yt-formatted-string, h1 yt-formatted-string, #title h1',
    channelName: 'ytd-channel-name a, #channel-name a, #owner-name a',
    channelLink: 'ytd-video-owner-renderer a',
    videoContainer: 'ytd-watch-flexy, ytd-watch-metadata'
  };

  waitForPageLoad() {
    cy.log('Waiting for Video page to load');
    cy.waitForYouTubePageLoad();

    cy.url({ timeout: 15000 }).should('include', '/watch');

    cy.get('video, #movie_player', { timeout: 15000 }).should('exist');

    cy.wait(3000);
    cy.closePopupIfExists();
  }

  getVideoTitle() {
    cy.log('Getting video title from video page');

    return cy.get('body').then(($body) => {
      const titleSelectors = [
        'h1.ytd-watch-metadata yt-formatted-string',
        'h1 yt-formatted-string',
        'h1.title yt-formatted-string',
        'ytd-watch-metadata h1',
        '#title h1'
      ];

      for (let selector of titleSelectors) {
        const $title = $body.find(selector);
        if ($title.length > 0) {
          const title = $title.first().text().trim();
          if (title && title !== '') {
            cy.log(`Video Title on Video Page: ${title}`);
            return cy.wrap(title);
          }
        }
      }

      const fallbackTitle = $body.find('h1').first().text().trim();
      cy.log(`Video Title (fallback): ${fallbackTitle}`);
      return cy.wrap(fallbackTitle);
    });
  }

  getChannelName() {
    cy.log('Getting channel name from video page');

    return cy.get('body').then(($body) => {
      const channelSelectors = [
        'ytd-channel-name a',
        '#channel-name a',
        'ytd-video-owner-renderer a',
        '#owner-name a',
        'ytd-channel-name yt-formatted-string'
      ];

      for (let selector of channelSelectors) {
        const $channel = $body.find(selector);
        if ($channel.length > 0) {
          const channelName = $channel.first().text().trim();
          if (channelName && channelName !== '') {
            cy.log(`Channel Name on Video Page: ${channelName}`);
            return cy.wrap(channelName);
          }
        }
      }

      const fallbackChannel = $body.find('a[href*="/@"]').first().text().trim();
      cy.log(`Channel Name (fallback): ${fallbackChannel}`);
      return cy.wrap(fallbackChannel);
    });
  }

  verifyVideoTitle() {
    cy.log('Verifying Video Title matches Trending page');

    const expectedVideo = Cypress.env('selectedVideo');
    const expectedTitle = expectedVideo.title;

    cy.log(`Expected Title: ${expectedTitle}`);

    return this.getVideoTitle().then((actualTitle) => {
      cy.log(`Actual Title: ${actualTitle}`);

      const normalizeTitle = (title) => {
        return title.replace(/\s+/g, ' ').trim().toLowerCase();
      };

      const normalizedExpected = normalizeTitle(expectedTitle);
      const normalizedActual = normalizeTitle(actualTitle);

      cy.log(`Normalized Expected: ${normalizedExpected}`);
      cy.log(`Normalized Actual: ${normalizedActual}`);

      const titlesMatch = normalizedActual === normalizedExpected;

      expect(titlesMatch,
        `Video title on video page should match trending page.\nExpected: "${expectedTitle}"\nActual: "${actualTitle}"`
      ).to.be.true;

      return cy.wrap({ expected: expectedTitle, actual: actualTitle, match: true });
    });
  }

  verifyChannelName() {
    cy.log('Verifying Channel Name matches Trending page');

    const expectedVideo = Cypress.env('selectedVideo');
    const expectedChannel = expectedVideo.channelName;

    cy.log(`Expected Channel: ${expectedChannel}`);

    return this.getChannelName().then((actualChannel) => {
      cy.log(`Actual Channel: ${actualChannel}`);

      const normalizeChannel = (channel) => {
        return channel.replace(/\s+/g, ' ').trim().toLowerCase();
      };

      const normalizedExpected = normalizeChannel(expectedChannel);
      const normalizedActual = normalizeChannel(actualChannel);

      cy.log(`Normalized Expected: ${normalizedExpected}`);
      cy.log(`Normalized Actual: ${normalizedActual}`);

      const channelsMatch = normalizedActual === normalizedExpected;

      expect(channelsMatch,
        `Channel name on video page should match trending page.\nExpected: "${expectedChannel}"\nActual: "${actualChannel}"`
      ).to.be.true;

      return cy.wrap({ expected: expectedChannel, actual: actualChannel, match: true });
    });
  }

  verifyVideoDetails() {
    cy.log('=== VIDEO PAGE VERIFICATION ===');

    this.verifyVideoTitle();

    this.verifyChannelName();

    cy.log('=== ALL VERIFICATIONS COMPLETED ===');
  }

  verifyVideoPlayerExists() {
    cy.log('Verifying video player exists');

    cy.get('video, #movie_player').should('exist').should('be.visible');
    cy.log('✓ Video player is visible');
  }
}

export default VideoPage;
