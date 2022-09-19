/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import create, { StoreApi, UseBoundStore } from 'zustand';
import { ConfigState } from '../../../types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useAllConfigStore = create<ConfigState>(() => ({
	a: []
})) as UseBoundStore<ConfigState, StoreApi<ConfigState>>;
