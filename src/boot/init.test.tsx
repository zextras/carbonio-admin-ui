/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { renderHook } from '@testing-library/react';
import { HttpResponse } from 'msw';

import { init } from './init';
import { advancedSupportedApi } from '../jest-env-setup';

describe('init', () => {
	it('should return error when advanced supported fails', async () => {
		const mocki18n: any = {
			_cache: {},
			locale: '',
			getShellI18n: jest.fn(),
			getAppI18n: jest.fn(),
			setLocale: jest.fn()
		};

		const mockStore: any = {
			getStoreForApp: jest.fn()
		};
		advancedSupportedApi(HttpResponse.error);
		const { result } = renderHook(() => init(mocki18n, mockStore));
		expect(await result.current).toHaveProperty('error');
	});
});
