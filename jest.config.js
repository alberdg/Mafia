module.exports = {
    roots: ['<rootDir>/src/__tests__'],
    testMatch: ['**/*-test.+(ts|js)'],
    transform: {
      '^.+\\.(ts)$': 'ts-jest',
    },
    verbose: true,
    silent: true,
    collectCoverage: true,
    coverageDirectory: './__coverage__',
    collectCoverageFrom: [
      './src/**/*.ts',
    ]
  };
  