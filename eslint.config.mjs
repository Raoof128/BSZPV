import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    name: 'project-rules',
    files: ['**/*.js'],
    ignores: ['node_modules/**', 'artifacts/**', 'cache/**', 'coverage/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.mocha
      }
    },
    plugins: {
      import: importPlugin
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
    }
  }
];
