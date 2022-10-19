/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import create, { StoreApi, UseBoundStore } from 'zustand';
import { AdvanceState } from '../../../types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const useAdvanceStore = create<AdvanceState>(() => ({
	isAdvanced: false
})) as UseBoundStore<AdvanceState, StoreApi<AdvanceState>>;
