import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/**", "coverage/**", "main/adoption/**", "main/routes/adoptionRoute.js"] },

  js.configs.recommended,
  {
    files: ["**/*.js", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",       
      globals: { ...globals.node } 
    },
    rules: {
      "no-undef": "error",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }]
    }
  },

  {
    files: ["__tests__/**/*.js", "__tests__/**/*.cjs"],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest }
    }
  },

  {
    files: ["public/**/*.js"],
    languageOptions: {
      sourceType: "script",            
      globals: { ...globals.browser }  
    }
  }
];
