import { getInnerText } from './dom-utils';
import { saveAs } from './downloader';

export function scrapeCatalog() {
  const URL = window.location.href;
  const type = URL.match(/catalog\.(\w+)?/)[1];
  const platformName = URL.match(/cloud%5B%5D=(\w+)&/)[1];
  let iPage;
  try {
    iPage = URL.match(/page=(\w+)&/)[1];
  } catch (e) {
    iPage = 1;
  }

  // query the hyperlink tag of all catalog items
  const items = document.querySelectorAll('div.catalog-item');

  // use console.log to print the query results
  console.group('Calalog Items');

  const csvheader = 'type,id,name,duration,level,costs,env\n';
  let csvData = csvheader;

  items.forEach((i) => {
    const name = getInnerText(i, '.catalog-item__title');
    const id = i
      .querySelector('.catalog-item__title > a')
      .href.match(/(focuses|quests)\/(\d+)/)[2];
    const dur = getInnerText(i, '.catalog-item-duration');
    const level = getInnerText(i, '.catalog-item-level');
    const cost = getInnerText(i, '.catalog-item-cost');
    const line = `${type},${id},"${name}",${dur},${level},${cost},${platformName}\n`;
    console.log(line);
    csvData += line;
  });
  console.groupEnd('Calalog Items');

  saveAs(csvData, `qwiklabs-${type}-${platformName}-${iPage}.csv`);

  setTimeout(function () {
    const nextBtn = document.querySelector('.next_page');
    if (nextBtn) nextBtn.click();
  }, 3000);
}
