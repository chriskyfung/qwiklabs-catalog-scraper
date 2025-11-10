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
    const path = linkElement.getAttribute('href');
    id = path.match(/\/(\d+)/)?.[1];
    name = linkElement.getAttribute('title');
    type = labelElement.getAttribute('activity')?.toLowerCase();
    link = `https://www.skills.google${path}`;
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
