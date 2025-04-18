/*
  Do not modify this file.
*/

import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: ['.*\\.spec\\.ts$', '.*\\.ispec\\.ts$'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: false,
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
