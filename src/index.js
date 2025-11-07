import { addDownloadLinks } from './modules/catalog-page';
import { scrapeCatalog } from './modules/scraper';

(function () {
  'use strict';

  const URL = window.location.href;
  if (URL == 'https://www.skills.google/catalog') {
    addDownloadLinks();
  } else {
    scrapeCatalog();
  }
})();
