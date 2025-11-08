/**
 * @fileoverview This module provides functionality to add download links to the catalog page.
 */

/**
 * @constant {Object<string, string>} URLS
 * @description A mapping of catalog formats to their corresponding URLs.
 */
const URLS = {
  labs: 'https://www.skills.google/catalog?skill-badge%5B%5D=__any__&format%5B%5D=labs&level%5B%5D=__any__&language%5B%5D=__any__&keywords=&locale=',
  courses:
    'https://www.skills.google/catalog?skill-badge%5B%5D=__any__&format%5B%5D=courses&level%5B%5D=__any__&language%5B%5D=__any__&keywords=&locale=',
};

/**
 * Creates a download button element.
 * @param {string} type - The catalog format (e.g., 'labs', 'courses').
 * @param {string} url - The URL for the download link.
 * @return {HTMLButtonElement} The created button element.
 */
function createDownloadButton(type, url) {
  const button = document.createElement('button');
  Object.assign(button.style, {
    backgroundColor: 'inherit',
    border: '1px solid #c4c7c5',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '14px',
    height: '32px',
    padding: '0px 16px',
  });

  let finalUrl = url;
  if (typeof GM_getValue === 'function' && GM_getValue('add_per_page', false)) {
    finalUrl += '&per_page=100';
  }

  button.addEventListener('click', () => {
    window.open(finalUrl, '_blank');
  });

  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = '#e8def8';
  });

  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = 'inherit';
  });

  button.textContent = `All ${type}`;

  return button;
}

/**
 * Adds download links for all supported catalog formats.
 */
export function addDownloadLinks() {
  const filters = document.querySelector('.catalog-filters');
  if (filters) {
    const container = document.createElement('div');
    container.style.padding = '16px';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '16px';
    container.style.borderTop = '1px solid #ccc';
    container.style.marginTop = '16px';

    const label = document.createElement('span');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.gap = '8px';
    label.style.fontWeight = 'bold';

    const icon = document.createElement('span');
    icon.className = 'material-icons';
    icon.textContent = 'file_download';
    label.appendChild(icon);

    const text = document.createTextNode('Scrape catalog as CSV:');
    label.appendChild(text);

    container.appendChild(label);

    const labsButton = createDownloadButton('labs', URLS.labs);
    container.appendChild(labsButton);

    const coursesButton = createDownloadButton('courses', URLS.courses);
    container.appendChild(coursesButton);

    filters.appendChild(container);
  }
}
