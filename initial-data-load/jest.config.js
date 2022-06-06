module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/src/tests/*.ts'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/testUtils/setup.ts'],
  modulePaths: ['<rootDir>'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  collectCoverageFrom: ['src/**/{!(test|config),}.ts', '!src/index.ts'],
};
