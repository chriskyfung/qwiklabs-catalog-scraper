import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/index.js',
      userscript: {
        name: 'Google Skills Catalog Scraper',
        namespace: 'https://chriskyfung.github.io/',
        version: '1.0.0',
        author: 'chriskyfung',
        description:
          'Scraping labs and courses from Google Skills Catalog and save as CSV files (You may merge the CSV files with http://merge-csv.com/)',
        icon: 'https://raw.githubusercontent.com/chriskyfung/qwiklabs-catalog-scraper/refs/heads/master/assets/icons/qwiklabs-catalog-scraper-icon-32x32.png',
        icon64:
          'https://raw.githubusercontent.com/chriskyfung/qwiklabs-catalog-scraper/refs/heads/master/assets/icons/qwiklabs-catalog-scraper-icon-64x64.png',
        updateURL:
          'https://github.com/chriskyfung/qwiklabs-catalog-scraper/releases/latest/download/qwiklabs-catalog-scraper.user.js',
        supportUrl:
          'https://github.com/chriskyfung/qwiklabs-catalog-scraper/issues',
        match: ['https://*.skills.google/com/catalog*'],
        grant: ['GM_getValue', 'GM_setValue', 'GM_registerMenuCommand'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.js',
  },
});
