module.exports = {
  moduleFileExtensions: ['js'],
  testMatch: ['**/src/tests/*.js'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/testUtils/setup.js'],
  modulePaths: ['<rootDir>'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  collectCoverageFrom: ['src/**/{!(test|config),}.js', '!src/index.js'],
};
