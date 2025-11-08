/**
 * @fileoverview This module provides functionality to scrape catalog data from the page.
 */

import { saveAs } from './downloader';
import { extractActivityData } from './dom-utils';

const SELECTORS = {
  searchResultContainer: 'ql-search-result-container',
  activityCard: 'ql-activity-card',
  nextPageButton: 'ql-icon-button.next-page',
};

/**
 * Waits for the search results to update after a pagination click.
 * This function uses a MutationObserver with a debounce mechanism to wait for
 * the DOM to stabilize before resolving the promise.
 * @param {Element} container - The search result container element.
 * @param {number} timeout - The maximum time to wait.
 * @returns {Promise<void>} A promise that resolves when the content has updated.
 */
function waitForPageUpdate(container, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const paginationElement = container.shadowRoot.querySelector(
      '.pagination-page'
    );
    if (!paginationElement) {
      return reject(new Error('Pagination element not found.'));
    }

    const initialText = paginationElement.textContent;
    let debounceTimer;

    const observer = new MutationObserver(() => {
      // Re-query the element in case it was replaced
      const currentPaginationElement = container.shadowRoot.querySelector(
        '.pagination-page'
      );
      if (currentPaginationElement) {
        const newText = currentPaginationElement.textContent;
        // Check if text has changed and is not empty (which can happen during render)
        if (newText !== initialText && newText.trim() !== '') {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            console.debug(
              `Debounced: Page update detected. Text changed from "${initialText}" to "${newText}". Resolving promise.`
            );
            observer.disconnect();
            clearTimeout(timeoutId);
            resolve();
          }, 500); // Debounce to ensure all related DOM changes are complete
        }
      }
    });

    const timeoutId = setTimeout(() => {
      observer.disconnect();
      clearTimeout(debounceTimer);
      reject(new Error('Pagination timeout'));
    }, timeout);

    // Observe the entire shadowRoot for changes, as the pagination element itself might be replaced.
    observer.observe(container.shadowRoot, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });
}

/**
 * Scrapes the catalog data from the current page.
 *
 * It automatically handles pagination by clicking the "next page" button
 * until all activities are loaded, then extracts the data and downloads it as a CSV file.
 * @export
 */
export async function scrapeCatalog() {
  console.log('Waiting for the page to load and stabilize...');
  await new Promise((resolve) => setTimeout(resolve, 5000)); // Initial wait

  const searchResultContainer = document.querySelector(
    SELECTORS.searchResultContainer
  );
  if (!searchResultContainer || !searchResultContainer.shadowRoot) {
    console.error('Search result container or its shadowRoot not found.');
    return;
  }

  console.log('Starting scrape...');
  const scrapedData = [];
  const processedIds = new Set();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const cards = searchResultContainer.shadowRoot.querySelectorAll(
      SELECTORS.activityCard
    );

    console.log(`Found ${cards.length} activity cards on the current page.`);

    for (const card of cards) {
      const data = extractActivityData(card);
      if (data && !processedIds.has(data.id)) {
        scrapedData.push(data);
        processedIds.add(data.id);
        console.debug(`Scraped activity: ${data.name} (ID: ${data.id})`);
      }
    }

    const nextPageButton = searchResultContainer.shadowRoot.querySelector(
      SELECTORS.nextPageButton
    );

    if (nextPageButton && !nextPageButton.hasAttribute('disabled')) {
      console.log('Navigating to the next page...');
      const updatePromise = waitForPageUpdate(searchResultContainer);
      nextPageButton.click();
      try {
        await updatePromise;
      } catch (error) {
        console.error(error.message);
        break; // Stop if pagination fails or times out
      }
    } else {
      console.log('No more pages or next button is disabled. Finishing scrape.');
      break;
    }
  }

  console.log(`Total unique scraped items: ${scrapedData.length}`);

  if (scrapedData.length === 0) {
    console.warn('No data was scraped. Aborting CSV generation.');
    return;
  }

  // Generate and download CSV
  const csvHeader = 'ID,Type,Name,Duration,Level,Credits,Link\n';
  const csvBody = scrapedData
    .map(
      (d) =>
        `${d.id},${d.type},"${d.name.replace(/"/g, '""')}",${d.duration},${
          d.level
        },${d.credits},${d.link}`
    )
    .join('\n');
  const csvData = csvHeader + csvBody;

  const url = new URL(window.location.href);
  const format = url.searchParams.get('format[0]') || 'all';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `qwiklabs-catalog-${format}-${timestamp}.csv`;
  saveAs(csvData, filename);

  console.log(`Scraped ${scrapedData.length} items and saved to ${filename}`);
}

