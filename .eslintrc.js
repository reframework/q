module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 10,
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
    'jest',
    // '@typescript-eslint/eslint-plugin',
    'testing-library',
    'prettier',
  ],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    // prettier-ignore
    'import/no-unresolved': 'off',
    // 'import/no-extraneous-dependencies': ['error', { devDependencies: true }],,
    'import/order': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      parser: '@typescript-eslint/parser',
      rules: {
        'testing-library/no-node-access': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-types': 'off',
      },
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },

        // typescript-eslint specific options
        warnOnUnsupportedTypeScriptVersion: true,
      },
    },
    {
      files: ['**/__tests__/**/*', '**/*.test.*'],

      // A subset of the recommended rules:
      rules: {
        // https://github.com/jest-community/eslint-plugin-jest
        'jest/no-conditional-expect': 'error',
        'jest/no-identical-title': 'error',
        'jest/no-interpolation-in-snapshots': 'error',
        'jest/no-jasmine-globals': 'error',
        'jest/no-jest-import': 'error',
        'jest/no-mocks-import': 'error',
        'jest/valid-describe-callback': 'error',
        'jest/valid-expect': 'error',
        'jest/valid-expect-in-promise': 'error',
        'jest/valid-title': 'warn',

        //

        // https://github.com/testing-library/eslint-plugin-testing-library
        'testing-library/await-async-query': 'error',
        'testing-library/await-async-utils': 'error',
        'testing-library/no-await-sync-query': 'error',
        'testing-library/no-container': 'error',
        'testing-library/no-debugging-utils': 'error',
        'testing-library/no-dom-import': ['error', 'react'],
        'testing-library/no-node-access': 'error',
        'testing-library/no-promise-in-fire-event': 'error',
        'testing-library/no-render-in-setup': 'error',
        'testing-library/no-unnecessary-act': 'error',
        'testing-library/no-wait-for-empty-callback': 'error',
        'testing-library/no-wait-for-multiple-assertions': 'error',
        'testing-library/no-wait-for-side-effects': 'error',
        'testing-library/no-wait-for-snapshot': 'error',
        'testing-library/prefer-find-by': 'error',
        'testing-library/prefer-presence-queries': 'error',
        'testing-library/prefer-query-by-disappearance': 'error',
        'testing-library/prefer-screen-queries': 'error',
        'testing-library/render-result-naming-convention': 'error',
      },
    },
  ],
};
