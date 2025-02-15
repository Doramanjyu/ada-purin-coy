import globals from 'globals'
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'

export default [
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat['jsx-runtime'],
  {
    ignores: ['node_modules/**', 'out/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: 'React',
        },
      ],
    },
  },
]
