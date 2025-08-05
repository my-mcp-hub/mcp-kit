import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'

export default [
  {
    ignores: ['**/build', '**/node_modules', '**/.*', '**/*.d.ts', '.husky/'],
  },
  {
    files: ['src/**/*.js', 'tests/**/*.js'],
  },
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.es2022,
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',
      semi: ['warn', 'never'],
      quotes: ['warn', 'single'],
      'no-unused-vars': 'off',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js'],
        },
      },
    },
  },
]
