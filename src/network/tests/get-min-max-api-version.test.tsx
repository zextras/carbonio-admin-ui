/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { renderHook } from '@testing-library/react';
import { HttpResponse } from 'msw';

import { createAPIInterceptor } from '../../jest-env-setup';
import { getMinMaxAPIVersion } from '../get-min-max-api-version';

describe('getMinMaxApiVersion', () => {
	it('set advanced as false', () => {
		createAPIInterceptor('get', '/zx/auth/supported', () =>
			HttpResponse.json(
				{
					minApiVersion: 2,
					maxApiVersion: 3
				},
				{ status: 200 }
			)
		);
		renderHook(() => getMinMaxAPIVersion());
	});
});
