/*
 * SPDX-FileCopyrightText: 2023 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { faker } from '@faker-js/faker';
import type { HttpResponseResolver } from 'msw';
import { HttpResponse } from 'msw';

export interface GetRightsRequestBody {
	GetRightsRequest: string;
}

export type GetRightsResponseBody = {
	Body: {
		GetRightsResponse: {
			ace: Array<{ right: string; d: string; zid: string; gt: string }>;
		};
		Fault?: { Detail?: { Error?: { Code?: string; Detail?: string } }; Reason?: { Text: string } };
	};
};

export const getRightsRequest: HttpResponseResolver<
	GetRightsRequestBody,
	never,
	GetRightsResponseBody
> = () =>
	HttpResponse.json(
		{
			Body: {
				GetRightsResponse: {
					ace: [
						{
							right: 'sendAs',
							d: faker.internet.email(),
							zid: faker.string.uuid(),
							gt: 'usr'
						}
					]
				}
			}
		},
		{
			status: 200,
			statusText: 'OK'
		}
	);
