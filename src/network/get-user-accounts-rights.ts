/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SHELL_APP_ID } from '../constants';
import { getSoapFetch } from './fetch';

export const getUsersRights = async (type: string, userName: string): Promise<any> =>
	getSoapFetch(SHELL_APP_ID)(`GetAllEffectiveRights`, {
		_jsns: 'urn:zimbraAdmin',
		grantee: {
			by: type,
			_content: userName
		}
	});
