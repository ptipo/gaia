import path from 'path';
import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    moduleNameMapper: {
        '^@hayadev/configurator(/.*)?$': '<rootDir>/src$1',
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    preset: 'ts-jest',

    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
    },

    collectCoverage: true,
    coverageDirectory: path.join(__dirname, 'tests/.coverage'),
    coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
    coverageProvider: 'v8',
    coverageReporters: ['json', 'text', 'lcov', 'clover'],
};

export default config;
