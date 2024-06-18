/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable import/no-import-module-exports */

import './index.css';
import React, { lazy, Suspense } from 'react';

import posthog from 'posthog-js';
import { render } from 'react-dom';

import LoadingView from './boot/splash';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { PH_API_HOST, PH_PROJECT_API_KEY } from './constants';

window.addEventListener('contextmenu', (ev) => {
	if (
		!(
			['IMG', 'A'].find(
				// @ts-ignore
				(name) => ev?.target?.tagName === name
			) ||
			ev.view?.getSelection?.()?.type === 'Range' ||
			// @ts-ignore
			ev.path?.find((element) =>
				element.classList?.find?.((cl: string) => cl === 'carbonio-bypass-context-menu')
			)
		)
	)
		ev.preventDefault();
});

// @ts-ignore works as intended, but it's tampering with the window
window.__CARBONIO_DEV__ = !!new URL(window.location).searchParams.get('dev');
const Bootstrapper = lazy(() => import('./boot/bootstrapper'));

posthog.init(PH_PROJECT_API_KEY, {
	api_host: PH_API_HOST
});

if (module.hot) module.hot.accept();
render(
	<Suspense fallback={<LoadingView />}>
		<Bootstrapper key="boot" />
	</Suspense>,
	document.getElementById('app')
);
