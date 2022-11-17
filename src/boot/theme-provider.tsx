/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { createContext, FC, useCallback, useEffect, useState } from 'react';
import { ThemeProvider as UIThemeProvider } from '@zextras/carbonio-design-system';
import { enable, disable, auto, setFetchMethod } from 'darkreader';
import { reduce } from 'lodash';
import { useAccountStore } from '../store/account';
import { ThemeExtension, ThemeExtensionMap } from '../../types';
import { darkReaderDynamicThemeFixes } from '../constants';

setFetchMethod(window.fetch);

export const ThemeCallbacksContext = createContext<{
	addExtension: (newExtension: ThemeExtension, id: string) => void;
	setDarkReaderState: (newState: 'auto' | 'enabled' | 'disabled') => void;
}>({
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	addExtension: (newExtension: ThemeExtension, id: string) => {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	setDarkReaderState: (newState: 'auto' | 'enabled' | 'disabled') => {}
});

const themeSizes = (
	size: 'small' | 'normal' | 'large' | 'larger' | 'default' | string
): ThemeExtension => {
	switch (size) {
		case 'small': {
			return (t: any): any => {
				// eslint-disable-next-line no-param-reassign
				t.sizes.font = {
					extrasmall: '10.625rem',
					small: '0.75rem',
					medium: '0.875rem',
					large: '1rem'
				};
				return t;
			};
		}
		case 'large': {
			return (t: any): any => {
				// eslint-disable-next-line no-param-reassign
				t.sizes.font = {
					extrasmall: '0.875rem',
					small: '1rem',
					medium: '1.125rem',
					large: '1.25rem'
				};
				return t;
			};
		}
		case 'larger': {
			return (t: any): any => {
				// eslint-disable-next-line no-param-reassign
				t.sizes.font = {
					extrasmall: '1rem',
					small: '1.125rem',
					medium: '1.25rem',
					large: '1.375rem'
				};
				return t;
			};
		}
		case 'default':
		case 'normal':
		default: {
			return (t: any): any => {
				// eslint-disable-next-line no-param-reassign
				t.sizes.font = {
					extrasmall: '0.75rem',
					small: '0.875rem',
					medium: '1rem',
					large: '1.125rem'
				};
				return t;
			};
		}
	}
};

export const ThemeProvider: FC = ({ children }) => {
	const zimbraPrefFontSize = useAccountStore((s) => s.settings.prefs?.zimbraPrefFontSize as string);
	// TODO: update when the DS is fully typed :D
	const [extensions, setExtensions] = useState<ThemeExtensionMap>({
		fonts: (theme) => {
			// eslint-disable-next-line no-param-reassign
			theme.sizes.font = {
				extrasmall: '0.75rem',
				small: '0.875rem',
				medium: '1rem',
				large: '1.125rem'
			};
			return theme;
		}
	});
	useEffect(() => {
		setExtensions((e) => ({
			...e,
			fonts: themeSizes(zimbraPrefFontSize)
		}));
	}, [zimbraPrefFontSize]);
	const [darkReaderState, setDarkReaderState] = useState<'auto' | 'disabled' | 'enabled'>('auto');
	useEffect(() => {
		switch (darkReaderState) {
			case 'disabled':
				disable();
				break;
			case 'enabled':
				enable(
					{
						sepia: -50
					},
					darkReaderDynamicThemeFixes
				);
				break;
			case 'auto':
			default:
				auto(
					{
						sepia: -50
					},
					darkReaderDynamicThemeFixes
				);
				break;
		}
	}, [darkReaderState]);
	const aggregatedExtensions = useCallback(
		(theme: any) => reduce(extensions, (acc, val) => val(acc), theme),
		[extensions]
	);
	const addExtension = useCallback((newExtension: ThemeExtension, id: string) => {
		setExtensions((ext) => ({ ...ext, [id]: newExtension }));
	}, []);
	return (
		<UIThemeProvider extension={aggregatedExtensions}>
			<ThemeCallbacksContext.Provider value={{ addExtension, setDarkReaderState }}>
				{children}
			</ThemeCallbacksContext.Provider>
		</UIThemeProvider>
	);
};
