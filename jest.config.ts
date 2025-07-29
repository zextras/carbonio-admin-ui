/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export default {
	collectCoverage: true,

	collectCoverageFrom: [
		'src/**/*.{js,ts,jsx,tsx}',

		'!src/**/mocks/**',
		'!src/**/__mocks__/**',

		'!src/test/**',
		'!src/**/__tests__/**',
		'!**/*.{test,spec}.{js,jsx,ts,tsx}',
		'!**/(test|mock)*.{ts,tsx,js,jsx}',

		'!src/**/types/**',
		'!src/**/*.d.ts',

		'!src/workers/**'
	],

	coverageDirectory: 'coverage',

	coverageProvider: 'babel',

	coverageReporters: ['lcov', 'html'],

	coverageThreshold: {},

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

	testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],

	testPathIgnorePatterns: ['/node_modules/', 'constants/test.ts'],

	transform: {
		'^.+\\.[t|j]sx?$': ['babel-jest', { configFile: './babel.config.jest.js' }],
		'\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
			'./__mocks__/fileTransformer.js'
	}
};
