export default {
  bail: 5,
  cacheDirectory: '/tmp/jest_rs',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/coverage/**',
    '!**/jest.config.mjs',
    '!**/jest.config.js',
    '!**/jest.config.json',
    '!**/jest.config.ts',
  ],
  coverageProvider: 'v8',
  passWithNoTests: true,
  verbose: true,
  transform: {
    '^.+\\.*js$': 'babel-jest',
  },
};
