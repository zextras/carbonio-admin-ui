/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

type Supported = {
	supported: boolean;
};
type Error = {
	errorMessage: string;
};
export const isAdvancedSupported = (): Promise<Supported | Error> =>
	fetch('/advanced/supported')
		.then(async (response: Response) => {
			if (!response.ok) {
				return {
					errorMessage: 'Error'
				};
			}
			const data = await response.json();
			if ('supported' in data) return { supported: data.supported };
			return { errorMessage: '' };
		})
		.catch(() => ({ errorMessage: 'Network error' }));
