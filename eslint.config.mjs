import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default defineConfig([
  prettier,  // Add prettier config to the array
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021
      },
      ecmaVersion: 12,
      sourceType: "module"
    },
    rules: {
      'max-len': [
        "warn",
        {
          code: 120,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ]
    },
  },
  globalIgnores([
    "**/.DS_Store",
    "**/node_modules/*",
    "**/dist/*",
    "**/package-lock.json",
    "!**/.*.js",
  ]),
]);
