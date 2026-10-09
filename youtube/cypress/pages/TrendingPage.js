class TrendingPage {

  selectors = {
    videoRenderer: 'ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer',
    videoTitle: '#video-title, yt-formatted-string#video-title',
    channelName: 'ytd-channel-name a, #channel-name a, #text.ytd-channel-name',
    videoLink: 'a#video-title-link, a#thumbnail',
    videoContainer: 'ytd-item-section-renderer #contents'
  };

  videoData = {
    title: null,
    channelName: null,
    url: null
  };

  waitForPageLoad() {
    cy.log('Waiting for Trending videos page to load');
    cy.waitForYouTubePageLoad();

    cy.get('ytd-browse, ytd-two-column-browse-results-renderer', { timeout: 15000 }).should('exist');

    cy.wait(2000);
    cy.closePopupIfExists();
  }

  getVideoItems() {
    cy.log('Getting all video items from trending list');

    cy.scrollTo(0, 300, { duration: 1000 });
    cy.wait(1000);

    return cy.get('body').then(($body) => {
      const videoSelectors = [
        'ytd-video-renderer',
        'ytd-grid-video-renderer',
        'ytd-rich-item-renderer'
      ];

      for (let selector of videoSelectors) {
        const $videos = $body.find(selector);
        if ($videos.length >= 3) {
          cy.log(`Found ${$videos.length} videos with selector: ${selector}`);
          return cy.get(selector);
        }
      }

      cy.log('Using first available video selector');
      return cy.get('ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer');
    });
  }

  selectThirdVideo() {
    cy.log('Selecting the 3rd video from trending list');

    return this.getVideoItems().then(($videos) => {
      if ($videos.length < 3) {
        throw new Error(`Not enough videos found. Expected at least 3, found ${$videos.length}`);
      }

      cy.log(`Total videos found: ${$videos.length}`);
      cy.log('Selecting video #3 (index 2)');

      const $thirdVideo = $videos.eq(2);

      cy.wrap($thirdVideo).scrollIntoView({ duration: 1000 });
      cy.wait(1000);

      const titleSelectors = [
        '#video-title',
        'yt-formatted-string#video-title',
        'a#video-title',
        'h3 a'
      ];
      let videoTitle = 'Title Not Found';
      for (let selector of titleSelectors) {
        const $title = $thirdVideo.find(selector).first();
        if ($title.length > 0 && $title.text().trim() !== '') {
          videoTitle = $title.text().trim().replace(/\s+/g, ' ');
          break;
        }
      }

      const channelSelectors = [
        'ytd-channel-name a',
        '#channel-name a',
        '#text.ytd-channel-name',
        'yt-formatted-string.ytd-channel-name',
        'ytd-channel-name yt-formatted-string'
      ];
      let channelName = 'Channel Not Found';
      for (let selector of channelSelectors) {
        const $channel = $thirdVideo.find(selector).first();
        if ($channel.length > 0 && $channel.text().trim() !== '') {
          channelName = $channel.text().trim().replace(/\s+/g, ' ');
          break;
        }
      }

      const $link = $thirdVideo.find('a#video-title-link, a#video-title, #thumbnail').first();
      const videoUrl = $link.attr('href') || null;

      this.videoData = {
        title: videoTitle,
        channelName: channelName,
        url: videoUrl
      };
      Cypress.env('selectedVideo', this.videoData);

      cy.log('=== VIDEO DATA CAPTURED ===');
      cy.log(`Title: ${videoTitle}`);
      cy.log(`Channel: ${channelName}`);
      cy.log(`Video URL: ${videoUrl}`);

      cy.wrap($link).click({ force: true });
      cy.wait(3000);

      return cy.wrap(this.videoData);
    });
  }

  getVideoData() {
    return this.videoData;
  }
}

export default TrendingPage;
