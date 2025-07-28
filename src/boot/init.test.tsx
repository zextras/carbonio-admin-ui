/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { renderHook } from '@testing-library/react';
import { noop } from 'lodash';
import { HttpResponse } from 'msw';

import { init } from './init';
import I18nFactory from '../i18n/i18n-factory';
import {
	advancedSupportedApi,
	getAllConfigRequestApi,
	getInfoRequestApi,
	loginConfigApi,
	minMaxVersionApi
} from '../jest-env-setup';
import * as mockGoToLogin from '../network/go-to-login';
import { goToLogin } from '../network/go-to-login';
import StoreFactory from '../redux/store-factory';
import * as reporter from '../reporting/functions';
import { useIsAdvanced } from '../store/advance';

jest.mock('../network/go-to-login', () => ({
	goToLogin: jest.fn()
}));

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

describe('init', () => {
	it('should return error when advanced supported fails', async () => {
		advancedSupportedApi(HttpResponse.error);
		const { result } = renderHook(() => init(mocki18n, mockStore));
		expect(await result.current).toHaveProperty('error');
	});

	it('should set advanced true when advanced supported is true', async () => {
		jest.spyOn(mockGoToLogin, 'goToLogin').mockImplementation(jest.fn());
		advancedSupportedApi(() => HttpResponse.json({ supported: true }, { status: 200 }));
		minMaxVersionApi(HttpResponse.error);
		loginConfigApi(HttpResponse.error);
		getInfoRequestApi(HttpResponse.error);
		getAllConfigRequestApi(HttpResponse.error);

		await init(new I18nFactory(), new StoreFactory());

		const { result: advancedResult } = renderHook(() => useIsAdvanced());
		expect(advancedResult.current).toBeTruthy();
	});

	it('should call go to login advanced true and minMaxApiFails', async () => {
		jest.spyOn(reporter, 'report').mockImplementation((): any => noop);
		advancedSupportedApi(() => HttpResponse.json({ supported: true }, { status: 200 }));
		minMaxVersionApi(HttpResponse.error);
		loginConfigApi(HttpResponse.error);
		getInfoRequestApi(HttpResponse.error);
		getAllConfigRequestApi(HttpResponse.error);

		const { result } = renderHook(() => init(mocki18n, mockStore));
		await result.current;

		expect(goToLogin as jest.Mock).toHaveBeenCalled();
	});
});
