const { FlatCompat } = require('@eslint/eslintrc');
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedDefaultEntries: true,
});

module.exports = [
  // Ignore build and dependency folders
  { ignores: ['node_modules/**', '.next/**', 'out/**'] },

  // Extend Next.js shareable configs via FlatCompat
  ...compat.extends('next', 'next/core-web-vitals'),

  // File-specific rules or overrides
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // your custom rule overrides
    },
  },
];
