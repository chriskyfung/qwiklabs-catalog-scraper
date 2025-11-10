import { vi } from 'vitest';

global.GM_getValue = vi.fn();
global.GM_setValue = vi.fn();
global.GM_registerMenuCommand = vi.fn();
global.GM_info = {
  script: {
    name: 'Google Skills Catalog Scraper',
    version: '1.0.0',
  },
};