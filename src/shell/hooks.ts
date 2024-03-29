/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable react-hooks/rules-of-hooks */

import { useContext, useState } from 'react';

import ShellContext from './shell-context';
import { useNetworkStore } from '../store/network';
import { useUtilityBarStore } from '../utility-bar';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

export function useIsMobile(): boolean {
	const { isMobile } = useContext(ShellContext);
	return isMobile;
}

export function useLocalStorage<T>(key: string, initialValue: T): any {
	const [storedValue, setStoredValue] = useState<T>(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.error(error);
			return initialValue;
		}
	});
	const setValue = (value: T | ((val: T) => T)): any => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.error(error);
		}
	};
	return [storedValue, setValue] as const;
}

export const usePrimaryBarState = (): boolean => useUtilityBarStore((s) => s.primaryBarState);

export const useNetworkState = (): any => useNetworkStore.getState();
