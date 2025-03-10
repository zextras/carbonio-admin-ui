/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Event, EventHint } from '@sentry/browser';
import { PostHog } from 'posthog-js';

import { useReporter } from './store';
import { getIsAdvanced } from '../store/advance';

export const report =
	(appId: string) =>
	(error: Event, hint?: EventHint): string => {
		const reporter = useReporter.getState();
		const eventId = reporter.clients[appId]?.captureException(error, { ...hint });
		if (eventId) {
			console.info('Reported event ', eventId);
		}
		return eventId;
	};

export const feedback = (posthog: PostHog, message: Event, data: Record<string, any>): string => {
	const isAdvanced = getIsAdvanced();
	const res = posthog.capture('admin_user_send_feedback', {
		...message,
		carbonio_backend_version: data?.carbonioBackendVersion || '',
		carbonio_admin_UI_version: data?.carbonioAdminUIVersion || '',
		total_accounts: data?.totalAccounts || '',
		total_domains: data?.totalDomains || '',
		total_servers: data?.totalServers || '',
		carbonio_ce: !isAdvanced
	});

	const eventId = res && res.uuid;

	if (eventId) {
		console.info('Feedback ', eventId, ' sent, Thank you');
	}
	return JSON.stringify({
		eventId,
		// carbonio_ui_version: '',
		// carbonio_admin_version: '',
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		carbonio_backend_version: data.carbonioBackendVersion,
		carbonio_ce: !isAdvanced,
		...message
	});
};
