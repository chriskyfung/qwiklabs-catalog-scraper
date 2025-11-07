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
