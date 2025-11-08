/**
 * Get the inner text from a descendant element with CSS selectors.
 * @param {Element} parentElement - A DOM element.
 * @param {string} selectors - The CSS selectors to query the descendant.
 * @return {string} The inner text or an empty string if not found.
 */
export function getInnerText(parentElement, selectors) {
  const element = parentElement.querySelector(selectors);
  try {
    return element.innerText;
  } catch (e) {
    return '';
  }
}

/**
 * Extracts activity data from a ql-activity-card element.
 *
 * @param {HTMLElement} card The ql-activity-card element.
 * @return {{
 *   id: string,
 *   name: string,
 *   type: string,
 *   duration: string,
 *   level: string,
 *   credits: string,
 *   link: string
 * }|null} An object containing the activity data, or null if the card is invalid.
 */
export function extractActivityData(card) {
  if (!card.shadowRoot) {
    console.warn('No shadowRoot found for card:', card);
    return null;
  }

  let id;
  let name;
  let type;
  let link;

  if (card.hasAttribute('path')) {
    id = card.getAttribute('path').match(/\/(\d+)/)?.[1];
    name = card.getAttribute('title');
    type = card.getAttribute('type')?.toLowerCase();
    link = `https://www.skills.google${card.getAttribute('path')}`;
  } else {
    const linkElement = card.shadowRoot.querySelector('a');
    const labelElement = card.shadowRoot.querySelector('ql-activity-label');
    if (!linkElement || !labelElement) {
      return null;
    }
    id = linkElement.getAttribute('href').match(/\/(\d+)/)?.[1];
    name = linkElement.getAttribute('title');
    type = labelElement.getAttribute('activity')?.toLowerCase();
    link = linkElement.href;
  }

  if (!id || !type) {
    return null;
  }

  // Extract metadata. This assumes a certain structure within the shadow DOM.
  const metadataElements = card.shadowRoot.querySelectorAll('.metadata-value');
  const duration = metadataElements[0]
    ? metadataElements[0].textContent.trim()
    : '';
  const level = metadataElements[1]
    ? metadataElements[1].textContent.trim()
    : '';
  const credits = metadataElements[2]
    ? metadataElements[2].textContent.trim()
    : '';

  return { id, name, type, duration, level, credits, link };
}
