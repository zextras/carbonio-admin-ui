/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useAccountStore } from '../store/account';
import { useAppStore } from '../store/app';
import { loadApps } from './app/load-apps';
import I18nFactory from '../i18n/i18n-factory';
import StoreFactory from '../redux/store-factory';
import { getInfo } from '../network/get-info';
import { getAllConfig } from '../network/get-all-config';
import { getIsAdvancedSupported } from '../network/get-advance';
import { loginConfig } from '../network/login-config';

export const init = (_i18nFactory: I18nFactory, _storeFactory: StoreFactory): void => {
	Promise.all([loginConfig(), getInfo()]).finally(() => {
		_i18nFactory.setLocale(
			(
				(useAccountStore.getState().settings?.prefs?.zimbraPrefLocale as string) ??
				(useAccountStore.getState().settings?.attrs?.zimbraLocale as string)
			)?.split?.('_')?.[0] ?? 'en'
		);
		loadApps(_storeFactory, Object.values(useAppStore.getState().apps));
	});

	getAllConfig().then();
	getIsAdvancedSupported().then();
};
