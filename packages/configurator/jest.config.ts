import path from 'path';

// /** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    moduleNameMapper: {
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
