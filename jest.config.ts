import { Config } from "@jest/types";

//const baseDir = '<rootDir>/src/app/pass_checker';
//const baseTestDir = '<rootDir>/src/test/pass_checker';

//const baseDir = '<rootDir>/src/app/doubles';
//const baseTestDir = '<rootDir>/src/test/doubles';

const baseDir = '<rootDir>/src/app/server_app';
const baseTestDir = '<rootDir>/src/test/server_app';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    `${baseDir}/**/*.ts`
  ],
  testMatch: 
    [`${baseTestDir}/**/*.ts`],
    "transform": {
      "^.+\\.(t)s$": "ts-jest",
      "^.+\\.(js|jsx)$": "babel-jest"
    },
}

export default config;