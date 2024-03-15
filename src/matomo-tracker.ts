/* eslint-disable import/no-extraneous-dependencies */
/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { createInstance } from '@datapunt/matomo-tracker-react';
import { MatomoInstance } from '@datapunt/matomo-tracker-react/lib/types';

import { MATOMO_SITE_ID, MATOMO_URL } from './test/constants';

export default class MatomoTracker {
	matomoInstance;

	constructor(userID: string) {
		this.matomoInstance = createInstance({
			urlBase: MATOMO_URL,
			userId: userID,
			siteId: MATOMO_SITE_ID,
			heartBeat: {
				active: false
			},
			linkTracking: false
		});
	}

	static matomoInstance: MatomoInstance;

	trackPageView(pageName: string): void {
		this.matomoInstance.trackPageView({
			documentTitle: pageName,
			href: '',
			customDimensions: [
				{
					id: 3,
					value: pageName
				}
			]
		});
	}

	trackEvent(category: string, action: string, name?: string): void {
		return name
			? this.matomoInstance.trackEvent({
					href: '',
					category,
					action,
					name
			  })
			: this.matomoInstance.trackEvent({
					href: '',
					category,
					action
			  });
	}
}
