/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SHELL_APP_ID } from '../constants';
import { useLoginConfigStore } from '../store/login/store';
import { getSoapFetch } from './fetch';
import { goTo, goToLogin } from './go-to-login';

export const logout = (): Promise<void> =>
	fetch('/logout', { redirect: 'manual' })
		.then(() => {
			const customLogoutUrl = useLoginConfigStore.getState().carbonioAdminUiLogoutURL;
			customLogoutUrl ? goTo(customLogoutUrl) : goToLogin();
		})
		.catch((error) => {
			console.error(error);
		});
