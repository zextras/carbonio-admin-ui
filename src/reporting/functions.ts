/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { Event, EventHint, Severity, setTag } from '@sentry/browser';
import { useReporter } from './store';

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

export const feedback = (message: Event): string => {
	const reporter = useReporter.getState();
	const eventId = reporter.clients.feedbacks.captureEvent({
		...message,
		level: Severity.Info,
		tags: {
			carbonio_ui_version: '',
			carbonio_admin_version: '',
			carbonio_backend_version: '',
			carbonio_ce: false
		}
	});
	if (eventId) {
		console.info('Feedback ', eventId, ' sent, Thank you');
	}
	return eventId;
};
