// /** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    // preset: 'ts-jest',
    // testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
    },
};
