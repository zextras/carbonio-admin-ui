/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { renderHook } from '@testing-library/react';
import { noop } from 'lodash';
import { HttpResponse } from 'msw';

import { createAPIInterceptor } from '../../jest-env-setup';
import * as reporter from '../../reporting/functions';
import { useAdvanceStore } from '../../store/advance';
import { getMinMaxAPIVersion } from '../get-min-max-api-version';

describe('getMinMaxApiVersion', () => {
	const advancedSupportedUrl = '/zx/auth/supported';
	it('sets advanced as true if domain present in response', async () => {
		createAPIInterceptor('get', advancedSupportedUrl, () =>
			HttpResponse.json(
				{
					minApiVersion: 2,
					maxApiVersion: 3,
					domain: 'test.com'
				},
				{ status: 200 }
			)
		);
		await getMinMaxAPIVersion();
		const { result } = renderHook(() => useAdvanceStore());
		expect(result.current.isAdvanced).toBeTruthy();
	});

	it('sets advanced as false if no domain present in response', async () => {
		createAPIInterceptor('get', advancedSupportedUrl, () =>
			HttpResponse.json(
				{
					minApiVersion: 2,
					maxApiVersion: 3
				},
				{ status: 200 }
			)
		);
		await getMinMaxAPIVersion();
		const { result } = renderHook(() => useAdvanceStore());
		expect(result.current.isAdvanced).toBeFalsy();
	});

	it('sets advanced as false if api fails', async () => {
		jest.spyOn(reporter, 'report').mockImplementation((): any => noop);
		createAPIInterceptor('get', advancedSupportedUrl, () => HttpResponse.error());
		await getMinMaxAPIVersion();
		const { result } = renderHook(() => useAdvanceStore());
		expect(result.current.isAdvanced).toBeFalsy();
	});
});
