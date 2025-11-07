export function addDownloadLinks() {
  document.querySelector("label[for='format_labs']").innerHTML +=
    '<span class="mdl-checkbox__label" style="align-items:flex-start;"><i class="fas fa-file-download"></i>&nbsp;<a href="https://www.qwiklabs.com/catalog.labs?cloud%5B%5D=GCP&keywords=&locale=&page=1&per_page=100" target="_blank">GCP</a><i class="fas fa-file-download"></i>&nbsp;<a href="https://www.qwiklabs.com/catalog.labs?cloud%5B%5D=AWS&keywords=&locale=&page=1&per_page=100" target="_blank">AWS</a></span>';
  document.querySelector("label[for='format_quests']").innerHTML +=
    '<span class="mdl-checkbox__label" style="align-items:flex-start;"><i class="fas fa-file-download"></i>&nbsp;<a href="https://www.qwiklabs.com/catalog.quests?cloud%5B%5D=GCP&keywords=&locale=&page=1&per_page=100" target="_blank">GCP</a><i class="fas fa-file-download"></i>&nbsp;<a href="https://www.qwiklabs.com/catalog.quests?cloud%5B%5D=AWS&keywords=&locale=&page=1&per_page=100" target="_blank">AWS</a></span>';
}
