/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { Text } from '@zextras/carbonio-design-system';

import ErrorSVG from '../svg/carbonio-load-app-error.svg';

export const ErrorPage = (): React.JSX.Element => (
	<div>
		<ErrorSVG />
		<Text>We’re sorry, but there was an error trying to load this page.</Text>
		<Text>Contact support or try refreshing the page</Text>
	</div>
);
