/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useEffect, useMemo } from 'react';

import { SnackbarManager, ModalManager } from '@zextras/carbonio-design-system';
import posthog from 'posthog-js';
import { useTranslation } from 'react-i18next';

import { registerDefaultViews } from './app/default-views';
import { unloadAllApps } from './app/load-apps';
import BootstrapperContextProvider from './bootstrapper-provider';
import BootstrapperRouter from './bootstrapper-router';
import { init } from './init';
import { ThemeProvider } from './theme-provider';
import { ConfigAttributesState } from '../../types';
import { PH_API_HOST, PH_PROJECT_API_KEY, TRUE } from '../constants';
import I18nFactory from '../i18n/i18n-factory';
import StoreFactory from '../redux/store-factory';
import { useAdvanceStore } from '../store/advance';
import { useConfigStore } from '../store/config';
import { useBridge } from '../store/context-bridge';

const DefaultViewsRegister: FC = () => {
	const [t] = useTranslation();
	useEffect(() => {
		registerDefaultViews(t);
	}, [t]);
	return null;
};

const TBridge: FC<{ i18nFactory: I18nFactory }> = ({ i18nFactory }) => {
	useBridge({
		functions: {},
		packageDependentFunctions: {
			t: (app) => i18nFactory.getAppI18n({ name: app }).t
		}
	});
	return null;
};

const Bootstrapper: FC = () => {
	const i18nFactory = useMemo(() => new I18nFactory(), []);
	const storeFactory = useMemo(() => new StoreFactory(), []);
	const feedbackPermission = useConfigStore(
		(state: ConfigAttributesState) => state.getConfigAttribute('carbonioAllowFeedback') === TRUE
	);
	const { isAdvanced } = useAdvanceStore();
	const showPostHogSurveys = useMemo(
		() => !isAdvanced && feedbackPermission,
		[isAdvanced, feedbackPermission]
	);
	const carbonioSendAnalyticsEnabled = useConfigStore(
		(state: ConfigAttributesState) => state.getConfigAttribute('carbonioSendAnalytics') === TRUE
	);

	if (carbonioSendAnalyticsEnabled) {
		posthog.init(PH_PROJECT_API_KEY, {
			api_host: PH_API_HOST,
			mask_all_text: true,
			disable_surveys: !showPostHogSurveys
		});
	}

	useEffect(() => {
		init(i18nFactory, storeFactory);
		return () => {
			unloadAllApps();
		};
	}, [i18nFactory, storeFactory]);
	return (
		<ThemeProvider>
			<SnackbarManager>
				<ModalManager>
					<BootstrapperContextProvider i18nFactory={i18nFactory} storeFactory={storeFactory}>
						<TBridge i18nFactory={i18nFactory} />
						<DefaultViewsRegister />
						<BootstrapperRouter />
					</BootstrapperContextProvider>
				</ModalManager>
			</SnackbarManager>
		</ThemeProvider>
	);
};

export default Bootstrapper;
