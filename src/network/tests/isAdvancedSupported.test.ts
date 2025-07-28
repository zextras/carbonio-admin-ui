/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { HttpResponse } from 'msw';

import { APIInterceptor, createAPIInterceptor } from '../../jest-env-setup';
import { isAdvancedSupported } from '../isAdvancedSupported';

const advancedSupportedApi = (supplier: () => HttpResponse): APIInterceptor =>
	createAPIInterceptor('get', '/advanced/supported', supplier);

describe('isAdvancedSupported', () => {
	it('Should return true when the isAdvancedSupported is true', async () => {
		advancedSupportedApi(() => HttpResponse.json({ supported: true }, { status: 200 }));

		const advancedSupported = await isAdvancedSupported();

		expect(advancedSupported).toEqual({ supported: true });
	});

	it('Should return false when the isAdvancedSupported is false', async () => {
		advancedSupportedApi(() => HttpResponse.json({ supported: false }, { status: 200 }));

		const advancedSupported = await isAdvancedSupported();

		expect(advancedSupported).toEqual({ supported: false });
	});

	it('Should return error when the API fails', async () => {
		advancedSupportedApi(() => HttpResponse.error());

		const advancedSupported = await isAdvancedSupported();

		expect(advancedSupported).toHaveProperty('errorMessage');
	});
});
