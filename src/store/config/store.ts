/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { find, get as _get } from 'lodash';
import { create } from 'zustand';

import { ConfigState } from '../../../types';
import { CONTENT } from '../../constants';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useAllConfigStore = create<ConfigState>((set, get) => ({
	a: [],
	getConfigByKey: (key: string): string => _get(find(get().a, { n: key }), CONTENT)
}));
