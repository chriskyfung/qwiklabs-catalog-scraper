/**
 * Saves data to a file and triggers a download in the browser.
 *
 * @param {string|object} data The data to save. If an object is provided, it will be stringified.
 * @param {string=} [filename='console.json'] The name of the file to save.
 */
export function saveAs(data, filename = 'console.json') {
  if (!data) {
    console.error('Console.save: No data');
    return;
  }

  const dataAsString =
    typeof data === 'object' ? JSON.stringify(data, undefined, 4) : data;

  const blob = new Blob([dataAsString], { type: 'text/json' });
  const a = document.createElement('a');

  a.download = filename;
  a.href = window.URL.createObjectURL(blob);
  a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
  a.click();
  window.URL.revokeObjectURL(a.href);
}
