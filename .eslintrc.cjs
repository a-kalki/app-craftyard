module.exports = {
  extends: 'eslint:recommended',
  files: ['**/*.ts'],
  languageOptions: {
    parser: '@typescript-eslint/parser',
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2022
    }
  },
  plugins: {
    '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
  },
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single']
  }
}
