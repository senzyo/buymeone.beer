import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist/**'] },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  ...eslintPluginAstro.configs['recommended'],
  eslintConfigPrettier,
];
