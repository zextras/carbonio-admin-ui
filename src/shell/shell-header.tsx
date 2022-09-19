/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useCallback, useEffect, useState } from 'react';
import {
	Container,
	IconButton,
	Padding,
	Responsive,
	useScreenMode,
	Input,
	Icon,
	Text
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import Logo from '../svg/carbonio-admin-panel.svg';
import { SearchBar } from '../search/search-bar';
import { CreationButton } from './creation-button';
import { useAppStore } from '../store/app';
import { AppRoute } from '../../types';
import { useAllConfigStore } from '../store/config/store';
import { openLink } from '../utility-bar/utils';

const ShellHeader: FC<{
	activeRoute: AppRoute;
	mobileNavIsOpen: boolean;
	onMobileMenuClick: () => void;
}> = ({ activeRoute, mobileNavIsOpen, onMobileMenuClick, children }) => {
	const screenMode = useScreenMode();
	const [t] = useTranslation();
	const searchEnabled = useAppStore((s) => s.views.search.length > 0);
	const configs = useAllConfigStore((c) => c.a);
	const [helpCenterURL, setHelpCenterURL] = useState<string>('https://docs.zextras.com');
	useEffect(() => {
		if (configs && configs.length > 0) {
			const zimbraHelpAdminURLattribute = configs.find(
				(item: any) => item?.n === 'zimbraHelpAdminURLattribute'
			);
			if (zimbraHelpAdminURLattribute) {
				setHelpCenterURL(zimbraHelpAdminURLattribute?._content);
			}
		}
	}, [configs]);
	const onHelpCenterClick = useCallback(() => {
		openLink(helpCenterURL);
	}, [helpCenterURL]);
	return (
		<Container
			orientation="horizontal"
			background="gray3"
			width="fill"
			height="60px"
			minHeight="60px"
			maxHeight="60px"
			mainAlignment="space-between"
			padding={{
				horizontal: screenMode === 'desktop' ? 'large' : 'extrasmall',
				vertical: 'small'
			}}
		>
			<Container
				orientation="horizontal"
				width="75%"
				maxWidth="75%"
				mainAlignment="space-between"
				crossAlignment="center"
			>
				<Responsive mode="mobile">
					<Padding right="small">
						<IconButton icon={mobileNavIsOpen ? 'Close' : 'Menu'} onClick={onMobileMenuClick} />
					</Padding>
				</Responsive>
				<Container
					orientation="horizontal"
					mainAlignment="flex-start"
					crossAlignment="center"
					width="auto"
				>
					<Container width="auto" height={32} crossAlignment="flex-start">
						<Logo height="32px" />
					</Container>

					<Padding horizontal="extralarge">
						<CreationButton activeRoute={activeRoute} />
					</Padding>
				</Container>

				<Container
					orientation="horizontal"
					mainAlignment="flex-start"
					crossAlignment="center"
					width="100%"
				>
					{/* <Container width="100%">
						<Input
							label={t('search.app', 'Search')}
							CustomIcon={(): any => <Icon icon="SearchOutline" size="large" color="text" />}
						/>
					</Container> */}
					<Container
						orientation="horizontal"
						mainAlignment="flex-start"
						crossAlignment="center"
						width="100%"
						padding={{
							all: 'large'
						}}
					>
						<Text
							color="primary"
							size="regular"
							onClick={onHelpCenterClick}
							style={{ cursor: 'pointer' }}
						>
							{t('labels.help_center', 'Help Center')}
						</Text>
						<Padding left="medium" onClick={onHelpCenterClick}>
							<Icon
								icon="QuestionMarkCircleOutline"
								size="medium"
								color="primary"
								style={{ cursor: 'pointer' }}
							/>
						</Padding>
					</Container>
				</Container>
				<Responsive mode="desktop">
					{searchEnabled && (
						<SearchBar
							activeRoute={activeRoute}
							// primaryAction={primaryAction}
							// secondaryActions={secondaryActions}
						/>
					)}
				</Responsive>
			</Container>
			<Container orientation="horizontal" width="25%" mainAlignment="flex-end">
				<Responsive mode="desktop">{children}</Responsive>
				<Responsive mode="mobile">
					<Container
						orientation="horizontal"
						mainAlignment="flex-end"
						padding={{ right: 'extrasmall' }}
					>
						{/* <Dropdown items={secondaryActions} placement="bottom-start">
							<IconButton icon="Plus" />
						</Dropdown> */}
					</Container>
				</Responsive>
			</Container>
		</Container>
	);
};
export default ShellHeader;
