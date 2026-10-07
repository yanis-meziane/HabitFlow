import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["**/node_modules/**", "**/dist/**", "docs/**"] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // varsIgnorePattern : sans plugin React, les composants utilisés seulement dans le JSX paraîtraient inutilisés
    rules: { "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z]", argsIgnorePattern: "^_" }] },
  },
  { files: ["backend/**/*.js"], languageOptions: { globals: globals.node } },
  { files: ["frontend/**/*.{js,jsx}"], languageOptions: { globals: globals.browser } },
  { files: ["backend/test/**/*.js"], languageOptions: { globals: { ...globals.node, ...globals.jest } } },
  { files: ["eslint.config.js", "frontend/vite.config.js"], languageOptions: { globals: globals.node } },
];
