/**
 * @fileoverview This module provides functionality to add download links to the catalog page.
 */

/**
 * @constant {Object<string, string>} URLS
 * @description A mapping of catalog formats to their corresponding URLs.
 */
const URLS = {
  labs: 'https://www.skills.google/catalog?skill-badge%5B%5D=__any__&format%5B%5D=labs&level%5B%5D=__any__&language%5B%5D=__any__&keywords=&locale=&per_page=100',
  courses:
    'https://www.skills.google/catalog?skill-badge%5B%5D=__any__&format%5B%5D=courses&level%5B%5D=__any__&language%5B%5D=__any__&keywords=&locale=&per_page=100',
};

/**
 * Creates a download link element.
 * @param {string} url - The URL for the download link.
 * @return {HTMLAnchorElement} The created anchor element.
 */
function createDownloadLink(url) {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.innerHTML = `<i class="fas fa-file-download"></i>&nbsp;All`;
  return link;
}

/**
 * Adds a download link to the label of a given format.
 * @param {string} format - The catalog format (e.g., 'labs', 'courses').
 */
function addDownloadLinkToLabel(format) {
  const label = document.querySelector(`label[for='format_${format}']`);
  if (label) {
    const span = document.createElement('span');
    span.className = 'mdl-checkbox__label';
    span.style.alignItems = 'flex-start';
    span.appendChild(createDownloadLink(URLS[format]));
    label.appendChild(span);
  }
}

/**
 * Adds download links for all supported catalog formats.
 */
export function addDownloadLinks() {
  addDownloadLinkToLabel('labs');
  addDownloadLinkToLabel('courses');
}
