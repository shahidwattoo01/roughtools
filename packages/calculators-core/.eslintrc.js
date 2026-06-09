module.exports = {
  extends: ['../../.eslintrc.js'],
  ignorePatterns: ['**/*.d.ts'],
  overrides: [
    {
      files: ['**/*.js'],
      env: {
        commonjs: true,
        node: true,
      },
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        'no-undef': 'off',
      },
    },
  ],
};