/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { screen } from '@testing-library/react';
import { HttpResponse } from 'msw';

import {
	advancedSupportedApi,
	getAllConfigRequestApi,
	getInfoRequestApi,
	loginConfigApi,
	minMaxVersionApi
} from '../jest-env-setup';
import Bootstrapper from './bootstrapper';
import { setup } from '../test/utils';

describe('Bootstrapper', () => {
	it('should display error when is advanced supported api fails', async () => {
		advancedSupportedApi(HttpResponse.error);
		minMaxVersionApi(HttpResponse.error);
		loginConfigApi(HttpResponse.error);
		getInfoRequestApi(HttpResponse.error);
		getAllConfigRequestApi(HttpResponse.error);

		setup(<Bootstrapper />);
		await screen.findByText('We’re sorry, but there was an error trying to load this page.');
	});

	it('should display error when is advanced true and login config api fails', async () => {
		advancedSupportedApi(() => HttpResponse.json({ supported: true }, { status: 200 }));
		minMaxVersionApi(HttpResponse.error);
		loginConfigApi(HttpResponse.error);
		getInfoRequestApi(HttpResponse.error);
		getAllConfigRequestApi(HttpResponse.error);

		setup(<Bootstrapper />);
		await screen.findByText('We’re sorry, but there was an error trying to load this page.');
	});
});
