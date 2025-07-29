/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export default {
	collectCoverage: true,

	collectCoverageFrom: [
		'src/**/*.{js,ts,jsx,tsx}',

		// Exclude test files (unit + integration)
		'!**/*.test.{js,jsx,ts,tsx}',
		'!**/*.spec.{js,jsx,ts,tsx}',
		'!**/tests/**',
		'!**/__tests__/**',

		// Exclude mocks and manual mocks
		'!**/__mocks__/**',
		'!**/mocks/**',
		'!**/mock*/**',
		'!**/*mock*.{js,ts,jsx,tsx}',

		// Exclude files with test or mock prefix
		'!**/(test|mock)*.{js,ts,jsx,tsx}',

		// Exclude declaration and type files
		'!**/*.d.ts',
		'!**/types/**',

		// Exclude test setup and bootstrap files
		'!src/jest-env-setup.ts',
		'!src/boot/bootstrapper.test.tsx',
		'!src/boot/init.test.tsx',
		'!src/network/tests/**'
	],

	coverageDirectory: 'coverage',
	coverageProvider: 'babel',
	coverageReporters: ['lcov', 'html'],

	fakeTimers: {
		enableGlobally: true
	},

	globals: {
		BASE_PATH: '',
		__CARBONIO_DEV__: false
	},

	moduleDirectories: ['node_modules'],

	moduleNameMapper: {
		'^react-pdf': 'react-pdf/dist/cjs/entry.jest',
		'\\.(css|less)$': 'identity-obj-proxy',
		'^msw/node$': '<rootDir>/node_modules/msw/node'
	},

	modulePathIgnorePatterns: ['<rootDir>/.*/__mocks__'],

	reporters: ['default', 'jest-junit'],

	restoreMocks: true,

	setupFiles: ['<rootDir>/src/jest-polyfills.ts'],

	setupFilesAfterEnv: ['<rootDir>/src/jest-env-setup.ts'],

	testEnvironment: '<rootDir>/src/test/jsdom-extended.ts',

	testEnvironmentOptions: {
		customExportConditions: [''],
		url: 'http://localhost:6071/carbonioAdmin'
	},

	testPathIgnorePatterns: ['/node_modules/', '/__mocks__/', '/mocks/'],

	transform: {
		'^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', { configFile: './babel.config.jest.js' }],
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'./__mocks__/fileTransformer.js'
	}
};
