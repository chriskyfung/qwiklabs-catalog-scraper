import { addDownloadLinks } from './modules/catalog-page';
import { scrapeCatalog } from './modules/scraper';

(function () {
  'use strict';

  // --- Menu Command for toggling per_page ---
  if (typeof GM_getValue === 'function' && typeof GM_setValue === 'function' && typeof GM_registerMenuCommand === 'function') {
    let addPerPage = GM_getValue('add_per_page', false);

    const toggleAddPerPage = () => {
      addPerPage = !addPerPage;
      GM_setValue('add_per_page', addPerPage);
      // We need to reload the page to apply the changes
      window.location.reload();
    };

    GM_registerMenuCommand(
      `${addPerPage ? '✅' : '❌'} Add per_page=100`,
      toggleAddPerPage
    );
  }
  // --- End of Menu Command ---

  const URL = window.location.href;
  if (URL == 'https://www.skills.google/catalog') {
    addDownloadLinks();
  } else {
    scrapeCatalog();
  }
})();
