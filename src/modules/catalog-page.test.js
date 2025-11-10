import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addDownloadLinks } from './catalog-page';

describe('catalog-page', () => {
  beforeEach(() => {
    // Set up a mock DOM before each test
    document.body.innerHTML = '<div class="catalog-filters"></div>';
    // Mock window.open
    global.window.open = vi.fn();
  });

  afterEach(() => {
    // Clean up the DOM and mocks after each test
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('should not add links if .catalog-filters element is not found', () => {
    document.body.innerHTML = ''; // Remove the element
    addDownloadLinks();
    const container = document.querySelector('.catalog-filters > div');
    expect(container).toBeNull();
  });

  it('should add a container with a label and two buttons', () => {
    addDownloadLinks();
    const container = document.querySelector('.catalog-filters > div');
    expect(container).not.toBeNull();

    const label = container.querySelector('span');
    expect(label.textContent).toContain('Scrape catalog as CSV:');

    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toBe('All labs');
    expect(buttons[1].textContent).toBe('All courses');
  });

  it('should open the correct URL when a button is clicked', () => {
    addDownloadLinks();
    const buttons = document.querySelectorAll('button');
    const labsButton = buttons[0];
    const coursesButton = buttons[1];

    labsButton.click();
    expect(window.open).toHaveBeenCalledWith(
      'https://www.skills.google/catalog?skill-badge%5B%5D=__any__&format%5B%5D=labs&level%5B%5D=__any__&language%5B%5D=__any__&keywords=&locale=',
      '_blank'
    );

    coursesButton.click();
    expect(window.open).toHaveBeenCalledWith(
      'https://www.skills.google/catalog?skill-badge%5B%5D=__any__&format%5B%5D=courses&level%5B%5D=__any__&language%5B%5D=__any__&keywords=&locale=',
      '_blank'
    );
  });

  it('should add per_page=100 to the URL if GM_getValue returns true', () => {
    // Mock GM_getValue to return true for this specific test
    global.GM_getValue = vi.fn().mockReturnValue(true);

    addDownloadLinks();
    const labsButton = document.querySelector('button');
    labsButton.click();

    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('&per_page=100'),
      '_blank'
    );
    // Restore the original mock for other tests
    global.GM_getValue.mockRestore();
  });

  it('should change button background on mouseover and mouseout', () => {
    addDownloadLinks();
    const button = document.querySelector('button');

    // Create and dispatch mouse events
    const mouseoverEvent = new MouseEvent('mouseover', { bubbles: true });
    const mouseoutEvent = new MouseEvent('mouseout', { bubbles: true });

    button.dispatchEvent(mouseoverEvent);
    expect(button.style.backgroundColor).toBe('rgb(232, 222, 248)'); // #e8def8

    button.dispatchEvent(mouseoutEvent);
    expect(button.style.backgroundColor).toBe('inherit');
  });
});
