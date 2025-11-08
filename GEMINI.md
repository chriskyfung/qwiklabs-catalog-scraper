# Project Overview

This project, "qwiklabs-catalog-scraper", is a userscript designed to scrape lab and course information from the Google Skills Catalog. It's built using Vite and `vite-plugin-monkey`, allowing it to run as a browser extension/userscript. The script provides functionality to add download links to the catalog page for labs and courses, and also to scrape the catalog data directly, handling pagination and exporting the data as a CSV file.

# Building and Running

The project uses `vite` for building.

*   **Development (watch mode):** `npm run dev`
*   **Build for production:** `npm run build`
*   **Linting and formatting:** `npm run lint` (which runs `npm run eslint` and `npm run prettier`)
*   **ESLint:** `npm run eslint`
*   **Prettier:** `npm run prettier`

# Development Conventions

*   **Linting:** ESLint is used with `eslint-config-google` and `eslint-config-prettier`.
*   **Formatting:** Prettier is used for code formatting.
*   **Userscript specific:** The project uses `GM_getValue`, `GM_setValue`, and `GM_registerMenuCommand` for userscript-specific functionalities, such as toggling the `per_page=100` parameter.
*   **Shadow DOM:** The scraper interacts with elements within shadow DOMs, as seen in `src/modules/scraper.js` and `src/modules/dom-utils.js`.
