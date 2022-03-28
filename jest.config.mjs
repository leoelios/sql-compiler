export default {
  bail: 5,
  cacheDirectory: '/tmp/jest_rs',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  passWithNoTests: true,
  verbose: true,
  transform: {
    '^.+\\.*js$': 'babel-jest',
  },
};
