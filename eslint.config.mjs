import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ['.vscode/*', 'package-lock.json', 'node_modules/'],
  files: ["**/*.{js,mjs,cjs}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.node, ecmaVersion: 2021, sourceType: "script" },
  files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
]);
