import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import { scrapeCatalog } from './scraper';
import * as downloader from './downloader';
import * as domUtils from './dom-utils';

// Mock the modules that scrapeCatalog depends on
vi.mock('./downloader', () => ({
  saveAs: vi.fn(),
}));

vi.mock('./dom-utils', () => ({
  extractActivityData: vi.fn(),
}));

describe('scraper', () => {
  let dom;

  beforeEach(() => {
    // Create a fresh DOM for each test
    dom = new JSDOM(
      `
      <!DOCTYPE html>
      <body>
        <ql-search-result-container></ql-search-result-container>
      </body>
    `,
      {
        url: 'https://www.skills.google/catalog?format[0]=labs',
      }
    );
    global.document = dom.window.document;
    global.window = dom.window;
    global.URL = dom.window.URL; // Make URL constructor available
    global.MutationObserver = dom.window.MutationObserver;

    // Reset mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup
    vi.useRealTimers();
  });

  // Helper to set up the mock DOM for the scraper
  const setupMockScraperDOM = (pages) => {
    const searchResultContainer = document.querySelector(
      'ql-search-result-container'
    );
    const shadowRoot = searchResultContainer.attachShadow({ mode: 'open' });

    let currentPage = 0;

    const renderPage = () => {
      const pageContent = pages[currentPage];
      shadowRoot.innerHTML = `
        <div class="pagination-page">Page ${currentPage + 1}</div>
        ${pageContent.cards
          .map((card) => `<ql-activity-card id="${card.id}"></ql-activity-card>`)
          .join('')}
        <ql-icon-button class="next-page" ${
          pageContent.hasNext ? '' : 'disabled'
        }></ql-icon-button>
      `;

      // Mock click behavior for the next page button
      const nextPageButton = shadowRoot.querySelector('.next-page');
      if (nextPageButton && !nextPageButton.hasAttribute('disabled')) {
        nextPageButton.addEventListener('click', () => {
          currentPage++;
          renderPage();
          // Dispatch a fake mutation event to resolve waitForPageUpdate
          shadowRoot.dispatchEvent(new dom.window.CustomEvent('mutation'));
        });
      }
    };

    renderPage();
    return searchResultContainer;
  };

  it('should scrape a single page of data and call saveAs', async () => {
    vi.useFakeTimers();
    const mockPages = [
      {
        cards: [{ id: '1' }, { id: '2' }],
        hasNext: false,
      },
    ];
    setupMockScraperDOM(mockPages);

    // Mock the data extraction
    domUtils.extractActivityData
      .mockReturnValueOnce({ id: '1', name: 'Lab 1', type: 'lab' })
      .mockReturnValueOnce({ id: '2', name: 'Lab 2', type: 'lab' });

    const scrapePromise = scrapeCatalog();

    // Fast-forward past initial 5s wait
    vi.runAllTimers();
    await scrapePromise;

    expect(domUtils.extractActivityData).toHaveBeenCalledTimes(2);
    expect(downloader.saveAs).toHaveBeenCalledOnce();
    const csvData = downloader.saveAs.mock.calls[0][0];
    expect(csvData).toContain('ID,Type,Name,Duration,Level,Credits,Link');
    expect(csvData).toContain('1,lab,"Lab 1"');
    expect(csvData).toContain('2,lab,"Lab 2"');
    const filename = downloader.saveAs.mock.calls[0][1];
    expect(filename).toMatch(/qwiklabs-catalog-labs-.*\.csv/);
  });

  it('should handle multiple pages by clicking the next button', async () => {
    vi.useFakeTimers();
    const mockPages = [
      { cards: [{ id: '1' }], hasNext: true },
      { cards: [{ id: '2' }], hasNext: false },
    ];
    setupMockScraperDOM(mockPages);

    domUtils.extractActivityData
      .mockReturnValueOnce({ id: '1', name: 'Lab 1', type: 'lab' })
      .mockReturnValueOnce({ id: '2', name: 'Lab 2', type: 'lab' });

    scrapeCatalog();
    await vi.runAllTimersAsync();

    expect(domUtils.extractActivityData).toHaveBeenCalledTimes(2);
    expect(downloader.saveAs).toHaveBeenCalledOnce();
    const csvData = downloader.saveAs.mock.calls[0][0];
    expect(csvData).toContain('1,lab,"Lab 1"');
    expect(csvData).toContain('2,lab,"Lab 2"');
  });

  it('should not call saveAs if no data is scraped', async () => {
    vi.useFakeTimers();
    const mockPages = [{ cards: [], hasNext: false }];
    setupMockScraperDOM(mockPages);

    domUtils.extractActivityData.mockReturnValue(null);

    const scrapePromise = scrapeCatalog();
    vi.runAllTimers();
    await scrapePromise;

    expect(downloader.saveAs).not.toHaveBeenCalled();
  });

});
