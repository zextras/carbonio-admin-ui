/*
 * SPDX-FileCopyrightText: 2024 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { useMemo } from 'react';

import type { PostHogConfig } from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

import { TrackerPageView } from './page-view';
import { ConfigAttributesState } from '../../types';
import { PH_API_HOST, PH_PROJECT_API_KEY, TRUE } from '../constants';
import { useAdvanceStore } from '../store/advance';
import { useConfigStore } from '../store/config';

export const TrackerProvider = ({
	children
}: React.PropsWithChildren<Record<never, never>>): React.JSX.Element => {
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
	const options = useMemo(
		(): Partial<PostHogConfig> => ({
			api_host: PH_API_HOST,
			person_profiles: 'identified_only',
			opt_out_capturing_by_default: true,
			disable_session_recording: true,
			mask_all_text: true,
			disable_surveys: showPostHogSurveys,
			capture_pageview: false,
			capture_pageleave: true,
			autocapture: false
		}),
		[showPostHogSurveys]
	);
	if (carbonioSendAnalyticsEnabled) {
		return (
			<PostHogProvider apiKey={PH_PROJECT_API_KEY} options={options}>
				{children}
				<TrackerPageView />
			</PostHogProvider>
		);
	}
	return <>{children}</>;
};
