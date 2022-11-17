/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable import/no-duplicates */
/* eslint-disable import/no-named-default */
import { forOwn } from 'lodash';
import { ComponentType } from 'react';
import { Reducer, Store } from '@reduxjs/toolkit';
import StoreFactory from '../../redux/store-factory';

import { useAppStore } from '../../store/app';
import { getAppFunctions } from './app-loader-functions';
import { Spinner } from '../../ui-extras/spinner';
import { AppLink } from '../../ui-extras/app-link';
import * as CONSTANTS from '../../constants';
import { IShellWindow, CarbonioModule } from '../../../types';
import { getAppSetters } from './app-loader-setters';
import { report } from '../../reporting';
import SettingsHeader from '../../settings/components/settings-header';

export const _scripts: { [pkgName: string]: HTMLScriptElement } = {};
let _scriptId = 0;
// const _revertableActions: { [pkgName: string]: RevertableActionCollection } = {};

// export function updateAppHandlers(appPkg: CarbonioModule, handlers: RequestHandlersList): void {
// 	if (FLAVOR === 'NPM' && typeof devUtils !== 'undefined') {
// 		const worker = devUtils.getMSWorker<SetupWorkerApi>();
// 		if (worker) {
// 			worker.resetHandlers();
// 			forEach(handlers, (h) => worker.use(h));
// 		}
// 	}
// }

function loadAppModule(appPkg: CarbonioModule, store: Store<any>): Promise<CarbonioModule> {
	return new Promise((_resolve, _reject) => {
		let resolved = false;
		const resolve: (...args: any[]) => void = (...args) => {
			if (!resolved) {
				resolved = true;
				_resolve(appPkg);
			}
		};
		const reject: (e: Error) => void = (e) => {
			if (!resolved) {
				resolved = true;
				_reject(e);
			}
		};
		try {
			// DO NOT RENAME THIS
			(window as unknown as IShellWindow).__ZAPP_SHARED_LIBRARIES__['@zextras/carbonio-shell-ui'][
				appPkg.name
			] = {
				store: {
					store,
					setReducer: (reducer: Reducer): void => store.replaceReducer(reducer)
				},
				report: report(appPkg.name),
				AppLink,
				Spinner,
				SettingsHeader,
				...getAppSetters(appPkg),
				...getAppFunctions(appPkg),
				...CONSTANTS
			};

			(window as unknown as IShellWindow).__ZAPP_HMR_EXPORT__[appPkg.name] = (
				appComponent: ComponentType
			): void => {
				useAppStore.setState((state) => ({
					entryPoints: {
						...state.entryPoints,
						[appPkg.name]: appComponent
					}
				}));
				console.info(
					`%c loaded ${appPkg.name}`,
					'color: white; background: #539507;padding: 0.25rem 0.5rem 0.125rem 0.25rem; font-family: sans-serif; border-radius: 0.75rem; width: 100%'
				);
				resolve(appPkg);
			};

			// if (FLAVOR === 'NPM' && typeof cliSettings !== 'undefined' && cliSettings.hasHandlers) {
			// eslint-disable-next-line max-len
			// (
			// 	window as unknown as IShellWindow<SharedLibrariesAppsMap, ComponentClass>
			// ).__ZAPP_HMR_HANDLERS__[appPkg.name] = (handlers: RequestHandlersList): void =>
			// 	updateAppHandlers(appPkg, handlers);
			// }
			const script: HTMLScriptElement = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('data-pkg_name', appPkg.name);
			script.setAttribute('data-pkg_version', appPkg.version);
			script.setAttribute('data-is_app', 'true');
			script.setAttribute('src', `${appPkg.js_entrypoint}`);
			document.body.appendChild(script);
			_scripts[`${appPkg.name}-loader-${(_scriptId += 1)}`] = script;
		} catch (err) {
			console.error(err);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			reject(err);
		}
	});
}

export function loadApp(pkg: CarbonioModule, storeFactory: StoreFactory): Promise<CarbonioModule> {
	const store = storeFactory.getStoreForApp(pkg);
	return loadAppModule(pkg, store);
}

export function unloadApps(): Promise<void> {
	return Promise.resolve().then(() => {
		forOwn(_scripts, (script) => {
			if (script.parentNode) script.parentNode.removeChild(script);
		});
	});
}
