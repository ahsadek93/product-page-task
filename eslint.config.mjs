// @ts-check
import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
  },
  {
    // tailwind / postcss configs are CommonJS run by Node
    files: ['*.config.js'],
    extends: [js.configs.recommended],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },
  prettier, // last: turns off ESLint rules that would fight Prettier's formatting
]);
