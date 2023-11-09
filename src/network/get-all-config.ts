/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { getSoapFetch } from './fetch';
import { GetAllConfigResponse } from '../../types';
import { SHELL_APP_ID } from '../constants';
import { useAllConfigStore } from '../store/config';

export const getAllConfig = (): Promise<void> =>
	getSoapFetch(SHELL_APP_ID)<{ _jsns: string }, GetAllConfigResponse>('GetAllConfig', {
		_jsns: 'urn:zimbraAdmin'
	})
		.then((res: any): void => {
			if (res && res?.a && Array.isArray(res?.a)) {
				useAllConfigStore.setState({ a: res?.a });
			}
		})
		.catch((err: unknown) => {
			console.log('there was an error to get AllConfig');
			console.error(err);
		});
