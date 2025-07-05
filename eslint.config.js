import js from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importSort from "eslint-plugin-simple-import-sort";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default tseslint.config([
  globalIgnores(["dist", "build", "node_modules", ".yarn"]),

  js.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs["recommended-latest"],
  reactRefresh.configs.vite,

  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
      globals: {
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        global: "readonly",
      },
    },
    plugins: {
      "simple-import-sort": importSort,
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "react-hooks/exhaustive-deps": "warn",
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react$"],
            ["^node:", "^@tanstack", "^[a-z]"],
            [
              "^@/assets",
              "^@/pages",
              "^@/components",
              "^@/constants",
              "^@/hooks",
              "^@/stores",
              "^@/styles",
              "^@/utils",
              "^@/types",
            ],
            [
              "^\\.\\.(?!/?$)",
              "^\\.\\./?$",
              "^\\./(?=.*/)(?!/?$)",
              "^\\.(?!/?$)",
              "^\\./?$",
            ],
            ["^.+\\.css\\.ts$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },
]);
