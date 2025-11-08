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
 * Creates a download link element.
 * @param {string} type - The catalog format (e.g., 'labs', 'courses').
 * @param {string} url - The URL for the download link.
 * @return {HTMLAnchorElement} The created anchor element.
 */
function createDownloadLink(type, url) {
  const link = document.createElement('a');

  let finalUrl = url;
  if (typeof GM_getValue === 'function' && GM_getValue('add_per_page', false)) {
    finalUrl += '&per_page=100';
  }

  link.href = finalUrl;
  link.target = '_blank';

  const icon = document.createElement('span');
  icon.className = 'material-icons';
  icon.style.verticalAlign = 'text-bottom';
  icon.textContent = 'file_download';

  link.appendChild(icon);
  link.appendChild(document.createTextNode(` All ${type}`));

  return link;
}

/**
 * Adds download links for all supported catalog formats.
 */
export function addDownloadLinks() {
  const filters = document.querySelector('.catalog-filters');
  if (filters) {
    const container = document.createElement('div');
    container.style.padding = '0 16px 16px';
    container.style.display = 'flex';
    container.style.gap = '16px';

    const labsLink = createDownloadLink('labs', URLS.labs);
    container.appendChild(labsLink);

    const coursesLink = createDownloadLink('courses', URLS.courses);
    container.appendChild(coursesLink);

    filters.appendChild(container);
  }
}
