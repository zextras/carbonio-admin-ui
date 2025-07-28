/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { renderHook } from '@testing-library/react';
import { HttpResponse } from 'msw';

import { createAPIInterceptor } from '../../jest-env-setup';
import { useAdvanceStore } from '../../store/advance';
import { getMinMaxAPIVersion } from '../get-min-max-api-version';

describe('getMinMaxApiVersion', () => {
	it('sets advanced as true if domain present in response', async () => {
		createAPIInterceptor('get', '/zx/auth/supported', () =>
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
		createAPIInterceptor('get', '/zx/auth/supported', () =>
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
});
