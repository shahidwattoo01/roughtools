/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    './base',
    'prettier',
  ],
  env: {
    node: true,
    es2022: true,
  },
  rules: {
    'no-console': 'off',
  },
}
