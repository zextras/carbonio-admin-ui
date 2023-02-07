/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useEffect, useState, useContext } from 'react';
import { Row, Responsive, ModalManager, SnackbarManager } from '@zextras/carbonio-design-system';
import styled from 'styled-components';
import { find } from 'lodash';
import AppViewContainer from './app-view-container';
import ShellContextProvider from './shell-context-provider';
import ShellHeader from './shell-header';
import ShellNavigationBar from './shell-navigation-bar';
import AppBoardWindow from './boards/app-board-window';
import { ThemeCallbacksContext } from '../boot/theme-provider';
import { useUserSettings } from '../store/account';
import { ShellUtilityBar, ShellUtilityPanel } from '../utility-bar';
import { useCurrentRoute } from '../history/hooks';
import { useTagStore } from '../store/tags/store';
import { createTag } from '../network/tags';
import { useDarkReaderResultValue } from '../custom-hooks/useDarkReaderResultValue';

const Background = styled.div`
	background: ${({ theme }) => theme.palette.gray6.regular};
	display: flex;
	flex-direction: column;
	height: 100%;
	min-height: 100%;
	max-height: 100%;
	width: 100%;
	min-width: 100%;
	max-width: 100%;
`;

function DarkReaderListener() {
	const { setDarkReaderState } = useContext(ThemeCallbacksContext);
	const darkReaderResultValue = useDarkReaderResultValue();
	useEffect(() => {
		if (darkReaderResultValue) {
			setDarkReaderState(darkReaderResultValue);
		}
	}, [darkReaderResultValue, setDarkReaderState]);
	return null;
}

export function Shell() {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const activeRoute = useCurrentRoute();
	return (
		<Background>
			<DarkReaderListener />
			{/* <MainAppRerouter /> */}
			<ShellHeader
				activeRoute={activeRoute}
				mobileNavIsOpen={mobileNavOpen}
				onMobileMenuClick={() => setMobileNavOpen(!mobileNavOpen)}
			>
				<ShellUtilityBar />
			</ShellHeader>
			<Row crossAlignment="unset" style={{ position: 'relative', flexGrow: '1' }}>
				<ShellNavigationBar activeRoute={activeRoute} mobileNavIsOpen={mobileNavOpen} />
				<AppViewContainer activeRoute={activeRoute} />
				<ShellUtilityPanel />
			</Row>
			<Responsive mode="desktop">
				<AppBoardWindow />
			</Responsive>
		</Background>
	);
}

export default function ShellView() {
	return (
		<ShellContextProvider>
			<ModalManager>
				<SnackbarManager>
					<Shell />
				</SnackbarManager>
			</ModalManager>
		</ShellContextProvider>
	);
}
