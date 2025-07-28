/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { create } from 'zustand';

import { AdvanceState, IsAdvancedState } from '../../../types';

export const useAdvanceStore = create<AdvanceState>(() => ({
	maxApiVersion: 1,
	minApiVersion: 1,
	version: '',
	domain: ''
}));

export const useProductVersionStore = create<IsAdvancedState>(() => ({
	isAdvanced: false
}));
