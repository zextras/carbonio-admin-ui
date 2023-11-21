/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/ban-types */
import { useEffect } from 'react';

import { reduce } from 'lodash';
import { create } from 'zustand';

import { ContextBridgeState } from '../../types';

export const useContextBridge = create<ContextBridgeState>((set) => ({
	packageDependentFunctions: {},
	functions: {},
	add: ({ packageDependentFunctions, functions }): void => {
		set((s) => ({
			packageDependentFunctions: reduce(
				packageDependentFunctions ?? {},
				(acc, f, key) => {
					// eslint-disable-next-line no-param-reassign
					acc[key] = f;
					return acc;
				},
				s.packageDependentFunctions
			),
			functions: reduce(
				functions ?? {},
				(acc, f, key) => {
					// eslint-disable-next-line no-param-reassign
					acc[key] = f;
					return acc;
				},
				s.functions
			)
		}));
	}
}));

export const useBridge = (content: Partial<Omit<ContextBridgeState, 'add'>>): void => {
	const addFunctions = useContextBridge(({ add }) => add);
	useEffect(() => {
		addFunctions(content);
	}, [content, addFunctions]);
};
