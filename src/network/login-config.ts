/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { LoginConfigStore } from '../../types/loginConfig';
import { useLoginConfigStore } from '../store/login/store';
import { LOGIN_V3_CONFIG_PATH } from '../constants';

export const loginConfig = (): Promise<void> =>
	fetch(`${LOGIN_V3_CONFIG_PATH}?domain=${window?.location?.hostname}`)
		.then((response) => response.json())
		.then((data: LoginConfigStore) => {
			useLoginConfigStore.setState(data);
			const favicon = document.getElementById('favicon');
			if (favicon && favicon instanceof HTMLLinkElement) {
				favicon.href = data.carbonioAdminUiFavicon
					? data.carbonioAdminUiFavicon
					: `${BASE_PATH}favicon.svg`;
			}
			if (data.carbonioAdminUiTitle) {
				document.title = data.carbonioAdminUiTitle;
			}
		})
		.catch((reason) => {
			console.warn(reason);
		});
