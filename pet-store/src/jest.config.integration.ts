/*
  Do not modify this file.
*/

import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.ispec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: false,
  coverageDirectory: '../coverage-integration',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    'src/HttpLogger.middleware.ts',
    'src/pet/helpers/pet.testhelper.ts',
    'src/main.ts',
    'app.module.ts',
    'src/main.ts',
  ],
};

export default config;
