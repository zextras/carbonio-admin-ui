/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { renderHook } from '@testing-library/react';
import { noop } from 'lodash';
import { HttpResponse } from 'msw';

import { minMaxVersionApi } from '../../jest-env-setup';
import * as reporter from '../../reporting/functions';
import { useAdvanceStore } from '../../store/advance';
import { getMinMaxAPIVersion } from '../get-min-max-api-version';

describe('getMinMaxApiVersion', () => {
	it('sets fields as true if domain present in response', async () => {
		minMaxVersionApi(() =>
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
		expect(result.current.minApiVersion).toBe(2);
		expect(result.current.maxApiVersion).toBe(3);
		expect(result.current.domain).toBe('test.com');
	});

	it('return error if no domain present in response', async () => {
		minMaxVersionApi(() =>
			HttpResponse.json(
				{
					minApiVersion: 2,
					maxApiVersion: 3
				},
				{ status: 200 }
			)
		);
		const response = await getMinMaxAPIVersion();
		expect(response).toHaveProperty('errorMessage');
	});

	it('return error if api fails', async () => {
		jest.spyOn(reporter, 'report').mockImplementation((): any => noop);
		minMaxVersionApi(HttpResponse.error);
		const response = await getMinMaxAPIVersion();
		expect(response).toHaveProperty('errorMessage');
	});
});
