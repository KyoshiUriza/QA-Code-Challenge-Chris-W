import playwright from 'eslint-plugin-playwright';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['node_modules/**', 'playwright-report/**', 'test-results/**', 'blob-report/**'],
  },
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Assertions often live in the Page Object's expect* helpers, which this
      // rule cannot see, so it reports those tests as assertion-free.
      'playwright/expect-expect': 'off',
    },
  },
];
