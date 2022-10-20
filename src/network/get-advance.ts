/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { SHELL_APP_ID } from '../constants';
import { useAdvanceStore } from '../store/advance';
import { getSoapFetchRequest } from './fetch';

export const getIsAdvancedSupported = (): Promise<void> =>
	getSoapFetchRequest(SHELL_APP_ID)('/zx/auth/supported')
		// eslint-disable-next-line consistent-return
		.then((res: any) => {
			if (res.status === 200) {
				useAdvanceStore.setState({ isAdvanced: true });
				return res.json();
			}
			useAdvanceStore.setState({ isAdvanced: false });
		})
		.catch((err: unknown) => {
			useAdvanceStore.setState({ isAdvanced: false });
			console.error(err);
		});
