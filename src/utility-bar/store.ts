/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import create from 'zustand';
import { UtilityBarStore } from '../../types';

export const useUtilityBarStore = create<UtilityBarStore>((set) => ({
	mode: 'closed',
	current: undefined,
	primaryBarState: false,
	secondaryBarState: true,
	setMode: (mode): void =>
		set((s) => ({ mode, secondaryBarState: mode === 'open' ? false : s.secondaryBarState })),
	setCurrent: (current): void => set({ current }),
	setSecondaryBarState: (secondaryBarState: boolean): void => set({ secondaryBarState }),
	setPrimaryBarState: (primaryBarState: boolean): void => set({ primaryBarState })
}));
