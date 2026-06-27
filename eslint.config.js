import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  // shadcn/ui components and shared hooks/contexts legitimately export
  // non-component constants/helpers alongside components. Disable fast-refresh
  // linting there rather than restructuring generated files.
  {
    files: ['src/components/ui/**/*.tsx', 'src/contexts/**/*.tsx', 'src/lib/**/*.ts'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
  // The generated sidebar skeleton uses Math.random for placeholder widths.
  // It is presentational fallback UI, not critical render logic.
  {
    files: ['src/components/ui/sidebar.tsx'],
    rules: {
      'react-hooks/purity': 'off',
    },
  },
])
