const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  { ignores: ['dist/*', '.expo/*'] },
  {
    // F-04: no hard-coded user-facing strings in screens/components – use t() from src/i18n.
    files: ['src/app/**/*.tsx', 'src/components/**/*.tsx'],
    ignores: ['src/app/dev/**', 'src/components/ui/**', 'src/components/screen-stub.tsx'],
    rules: {
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'JSXText[value=/[A-Za-z\\u0600-\\u06FF]{2,}/]',
          message: 'Hard-coded UI string – move it to src/i18n and use t().',
        },
      ],
    },
  },
]);
