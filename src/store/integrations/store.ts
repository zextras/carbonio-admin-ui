/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ComponentType } from 'react';

import { produce } from 'immer';
import { forEach, omit, reduce } from 'lodash';
import { create } from 'zustand';

import Composer from './composer';
import { ActionFactory, AnyFunction, IntegrationsState, SHELL_APP_ID } from '../../../types';

export const useIntegrationsStore = create<IntegrationsState>((set) => ({
	actions: {},
	components: {
		composer: {
			item: Composer,
			app: SHELL_APP_ID
		}
	},
	hooks: {},
	functions: {},
	registerActions: <T>(
		...items: Array<{ id: string; action: ActionFactory<T>; type: string }>
	): void =>
		set(
			produce((state) => {
				forEach(items, ({ id, action, type }) => {
					if (!state.actions[type])
						// eslint-disable-next-line no-param-reassign
						state.actions[type] = {};
					// eslint-disable-next-line no-param-reassign
					state.actions[type][id] = action;
				});
			})
		),
	registerComponents:
		(app: string) =>
		(...items: Array<{ id: string; component: ComponentType }>): void =>
			set(
				produce((state) => {
					forEach(items, ({ id, component }) => {
						// eslint-disable-next-line no-param-reassign
						state.components[id] = { app, item: component };
					});
				})
			),
	registerHooks: (...items: Array<{ id: string; hook: AnyFunction }>): void =>
		set(
			produce((state) => {
				forEach(items, ({ id, hook }) => {
					// eslint-disable-next-line no-param-reassign
					state.hooks[id] = hook;
				});
			})
		),
	registerFunctions: (...items: Array<{ id: string; fn: AnyFunction }>): void =>
		set(
			produce((state) => {
				forEach(items, ({ id, fn }) => {
					// eslint-disable-next-line no-param-reassign
					state.functions[id] = fn;
				});
			})
		),
	removeActions: (...ids: Array<string>): void =>
		set((s) => ({
			...s,
			actions: reduce(
				s.actions,
				(acc, actions, type) => ({ ...acc, [type]: omit(actions, ids) }),
				{}
			)
		})),
	removeComponents: (...ids: Array<string>): void =>
		set((s) => ({
			...s,
			actions: omit(s.components, ids)
		})),
	removeHooks: (...ids: Array<string>): void =>
		set((s) => ({
			...s,
			actions: omit(s.hooks, ids)
		})),
	removeFunctions: (...ids: Array<string>): void =>
		set((s) => ({
			...s,
			actions: omit(s.functions, ids)
		}))
}));
