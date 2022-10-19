/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useAdvanceStore } from '../store/advance';

const hostname = window?.location?.hostname;
const protocol = window?.location?.protocol;

export const getIsAdvancedSupported = (): Promise<void> =>
	fetch(`${protocol}//${hostname}/zx/auth/supported`)
		// eslint-disable-next-line consistent-return
		.then((res) => {
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
