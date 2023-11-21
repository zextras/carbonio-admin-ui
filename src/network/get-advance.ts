/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { getSoapFetchRequest } from './fetch';
import { SHELL_APP_ID } from '../constants';
import { useAdvanceStore } from '../store/advance';

export const getIsAdvancedSupported = (): Promise<void> =>
	getSoapFetchRequest(SHELL_APP_ID)('/zx/auth/supported')
		// eslint-disable-next-line consistent-return
		.then((data: any) => {
			if (data?.domain) {
				useAdvanceStore.setState({
					maxApiVersion: data?.maxApiVersion,
					minApiVersion: data?.minApiVersion,
					version: data?.version,
					domain: data?.domain,
					isAdvanced: true
				});
			} else {
				useAdvanceStore.setState({ isAdvanced: false });
			}
		})
		.catch((err: unknown) => {
			useAdvanceStore.setState({ isAdvanced: false });
			console.error(err);
		});
