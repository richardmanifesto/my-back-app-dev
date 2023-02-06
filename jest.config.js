

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  globalSetup: "<rootDir>/tests/setup/globalSetup.ts",
  // globalTeardown: "<rootDir>/tests/setup/globalTeardown.ts",
  // setupFiles: ["<rootDir>/tests/setup/setupAdvanced.ts"],
  // setupFilesAfterEnv: ["<rootDir>/tests/setup/setupSimple.ts"],

  moduleNameMapper: {
    '^@root/(.*)$': '<rootDir>/$1',
  },
  maxWorkers:4,
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
}