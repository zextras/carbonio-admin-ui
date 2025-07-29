/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { Text } from '@zextras/carbonio-design-system';

import Helmet from '../svg/carbonio-head.svg';

export const ErrorPage = (): React.JSX.Element => (
	<div style={{ backgroundColor: '#F5F6F8' }}>
		<Helmet fill="#A3AEBC" />
		<Text>We’re sorry, but there was an error trying to load this page.</Text>
	</div>
);
