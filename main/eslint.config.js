// main/eslint.config.js
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,

  // Common defaults
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
    },
    ignores: [
      'node_modules/**',
      'public/**',
      'coverage/**',
      'test-results/**',
      'views/**',        // optional: ignore EJS templates
    ],
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      eqeqeq: ['warn', 'smart'],
    },
  },

  // Node/Express files (server-side)
  {
    files: [
      'server.js',
      'app.js',
      'routes/**/*.js',
      'controllers/**/*.js',
      'models/**/*.js',
    ],
    languageOptions: {
      globals: {
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
      },
    },
  },

  // Browser files (front-end JS)
  {
    files: [
      'adoption/**/*.js',  // <-- note: no "main/" prefix
      'public/**/*.js',
    ],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
      },
    },
  },

  // Jest tests
  {
    files: [
      'tests/**/*.js',
      '**/*.test.js',
      '**/__tests__/**/*.js',
    ],
    languageOptions: {
      globals: {
        describe: 'readonly',
        test: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        jest: 'readonly',
        process: 'readonly',
      },
    },
  },
];