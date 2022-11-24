/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SHELL_APP_ID } from '../constants';
import { getSoapFetch } from './fetch';

export const getDomainInformation = async (type: string, domainId: string): Promise<any> =>
	getSoapFetch(SHELL_APP_ID)(`GetDomain`, {
		_jsns: 'urn:zimbraAdmin',
		domain: {
			by: type,
			_content: domainId
		}
	});
