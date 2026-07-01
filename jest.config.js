const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

/** @type {import('jest').Config} */
const customJestConfig = {
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	testEnvironment: 'jest-environment-jsdom',
	testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
	},
};

module.exports = createJestConfig(customJestConfig);
