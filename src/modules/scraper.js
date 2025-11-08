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
 * Scrapes the catalog data from the current page.
 *
 * It automatically handles pagination by clicking the "load more" button
 * until all activities are loaded, then extracts the data and downloads it as a CSV file.
 * @export
 */
export async function scrapeCatalog() {
  const searchResultContainer = document.querySelector(
    SELECTORS.searchResultContainer
  );
  if (!searchResultContainer || !searchResultContainer.shadowRoot) {
    console.error('Search result container not found.');
    return;
  }

  // Handle pagination by repeatedly clicking "next page"
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const nextPageButton = searchResultContainer.shadowRoot.querySelector(
      SELECTORS.nextPageButton
    );
    if (nextPageButton && !nextPageButton.hasAttribute('disabled')) {
      nextPageButton.click();
      // Wait for new content to load
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } else {
      break; // No more "next page" button, or it's disabled
    }
  }

  // Scrape the data
  const cards = searchResultContainer.shadowRoot.querySelectorAll(
    SELECTORS.activityCard
  );
  const scrapedData = [];
  for (const card of cards) {
    const data = extractActivityData(card);
    if (data) {
      scrapedData.push(data);
    }
  }

  // Generate CSV
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

  // Download CSV
  const url = new URL(window.location.href);
  const format = url.searchParams.get('format[0]') || 'all';
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `qwiklabs-catalog-${format}-${timestamp}.csv`;
  saveAs(csvData, filename);

  console.log(`Scraped ${scrapedData.length} items and saved to ${filename}`);
}
