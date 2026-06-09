/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    './base',
    'next/core-web-vitals',
    'prettier',
  ],
  rules: {
    'react/display-name': 'off',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    // no-require-imports is less relevant in Next.js — allow dynamic require in config files
    '@typescript-eslint/no-require-imports': 'off',
  },
}
