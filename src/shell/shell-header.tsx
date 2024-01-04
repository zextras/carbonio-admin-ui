/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import {
	Container,
	IconButton,
	Padding,
	Responsive,
	useScreenMode,
	Icon,
	Text
} from '@zextras/carbonio-design-system';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';

import { CreationButton } from './creation-button';
import { AppRoute } from '../../types';
import {
	CARBONIO_HELP_ADMIN_URL,
	CARBONIO_HELP_ADVANCED_URL,
	CARBONIO_LOGO_URL
} from '../constants';
import { useDarkMode } from '../dark-mode/use-dark-mode';
import { getDomainInformation } from '../network/get-domain-information';
import { SearchBar } from '../search/search-bar';
import { useUserAccount, useUserSettings } from '../store/account';
import { useIsAdvanced } from '../store/advance';
import { useAppStore } from '../store/app';
import { useDomainInformationStore } from '../store/domain-information';
import { useLoginConfigStore } from '../store/login/store';
import Logo from '../svg/carbonio-admin-panel.svg';
import { openLink } from '../utility-bar/utils';

const CustomImg = styled.img`
	height: 2rem;
`;

const slideInRight = keyframes`
  0% {
    transform: translateX(50%) scaleX(0);
  }
  100% {
    transform: translateX(0%)  scaleX(1);
  }
`;

const FeedbackDiv = styled.div`
	&.feedback {
		position: fixed;
		right: 2rem;
		bottom: 1rem;
		z-index: 3;
	}
`;

const FeedbackText = styled.div`
	padding: 0 0.5rem;
	display: none;
	font-size: 14px;
	animation: ${slideInRight} 0.1s;

	${FeedbackDiv}:hover & {
		display: inline;
	}
`;

const FeedbackContainer = styled.a`
	cursor: pointer;
	display: flex;
	flex-direction: row;
	align-items: center;
	text-decoration: none;
	color: #ffffff;
	background: #2b73d2;
	padding: 0.8rem;
	border-radius: 50px;
	background-color: #2b73d2;
	z-index: 4;
`;

const ShellHeader: FC<{
	activeRoute: AppRoute;
	mobileNavIsOpen: boolean;
	onMobileMenuClick: () => void;
}> = ({ activeRoute, mobileNavIsOpen, onMobileMenuClick, children }) => {
	const screenMode = useScreenMode();
	const [t] = useTranslation();
	const searchEnabled = useAppStore((s) => s.views.search.length > 0);
	const [helpCenterURL, setHelpCenterURL] = useState<string>('');
	const isGlobalAdmin = useUserSettings().attrs?.zimbraIsAdminAccount;
	const isDelegatedAdmin = useUserSettings().attrs?.zimbraIsDelegatedAdminAccount;
	const userName = useUserAccount()?.name;
	const isAdvanced = useIsAdvanced();
	const { carbonioAdminUiAppLogo, carbonioAdminUiDarkAppLogo, carbonioLogoURL } =
		useLoginConfigStore();
	const { darkModeEnabled, darkReaderStatus } = useDarkMode();
	// Hide for now because https://app.useberry.com/embed/embed-script.js not working */
	// const [feedbackVisible, setFeedbackVisible] = useState(true);
	// const configs = useAllConfigStore((c) => c.a);
	// const [feedbackConfig, setFeedbackConfig] = useState('FALSE');

	// const saveToLocalStorage = (): void => {
	// 	localStorage.setItem('feedback', 'true');
	// };

	const getDomainDetails = useCallback(
		// eslint-disable-next-line sonarjs/cognitive-complexity
		(name: any): any => {
			getDomainInformation('name', name).then((data) => {
				const domain = data?.domain[0];
				if (domain) {
					useDomainInformationStore.setState({ a: domain?.a, id: domain?.id, name: domain?.name });
					const domainInformation = domain?.a;
					const obj: any = {};
					domainInformation.map((item: any) => {
						obj[item?.n] = item._content;
						return '';
					});
					if (isAdvanced) {
						if (isGlobalAdmin) {
							const zimbraHelpAdvancedURL = obj?.zimbraHelpAdvancedURL
								? obj?.zimbraHelpAdvancedURL
								: CARBONIO_HELP_ADVANCED_URL;
							setHelpCenterURL(zimbraHelpAdvancedURL);
						}
						if (isDelegatedAdmin) {
							const zimbraHelpDelegatedURL = obj?.zimbraHelpDelegatedURL
								? obj?.zimbraHelpDelegatedURL
								: CARBONIO_HELP_ADVANCED_URL;
							setHelpCenterURL(zimbraHelpDelegatedURL);
						}
					} else {
						const zimbraHelpAdminURL = obj?.zimbraHelpAdminURL
							? obj?.zimbraHelpAdminURL
							: CARBONIO_HELP_ADMIN_URL;
						setHelpCenterURL(zimbraHelpAdminURL);
					}
				}
			});
		},
		[isAdvanced, isDelegatedAdmin, isGlobalAdmin]
	);
	// Hide for now because https://app.useberry.com/embed/embed-script.js not working */
	// useEffect(() => {
	// 	const storedValue = localStorage.getItem('feedback');
	// 	if (storedValue === 'true') {
	// 		setFeedbackVisible(false);
	// 	}
	// 	const carbonioAllowFeedback = configs.find((item: any) => item?.n === 'carbonioAllowFeedback');
	// 	if (carbonioAllowFeedback) {
	// 		setFeedbackConfig(carbonioAllowFeedback?._content);
	// 	}
	// 	const script = document.createElement('script');
	// 	script.type = 'text/javascript';
	// 	script.src = 'https://app.useberry.com/embed/embed-script.js';
	// 	script.async = true;
	// 	document.body.appendChild(script);

	// 	return () => {
	// 		document.body.removeChild(script);
	// 	};
	// }, [configs]);

	useEffect(() => {
		if (userName) {
			getDomainDetails(userName?.split('@')[1]);
		}
	}, [getDomainDetails, userName]);

	const onHelpCenterClick = useCallback(() => {
		openLink(helpCenterURL);
	}, [helpCenterURL]);

	const logoSrc = useMemo(() => {
		if (darkModeEnabled) {
			return carbonioAdminUiDarkAppLogo || carbonioAdminUiAppLogo;
		}
		return carbonioAdminUiAppLogo || carbonioAdminUiDarkAppLogo;
	}, [carbonioAdminUiDarkAppLogo, carbonioAdminUiAppLogo, darkModeEnabled]);

	const logoUrl = useMemo(() => carbonioLogoURL || CARBONIO_LOGO_URL, [carbonioLogoURL]);
	// Hide for now because https://app.useberry.com/embed/embed-script.js not working */
	// const removeFeedback = (): void => {
	// 	setFeedbackVisible(false);
	// 	saveToLocalStorage();
	// };

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
				left: screenMode === 'desktop' ? 'large' : 'small',
				right: screenMode === 'desktop' ? 'large' : 'extrasmall',
				vertical: 'small'
			}}
		>
			<Responsive mode="mobile">
				<Padding right="small">
					<IconButton icon={mobileNavIsOpen ? 'Close' : 'Menu'} onClick={onMobileMenuClick} />
				</Padding>
			</Responsive>
			<Container
				orientation="horizontal"
				width="75%"
				maxWidth="75%"
				mainAlignment="space-between"
				crossAlignment="center"
			>
				<Container
					orientation="horizontal"
					mainAlignment="flex-start"
					crossAlignment="center"
					width="auto"
				>
					<Container width="auto" height={32} crossAlignment="flex-start">
						{darkReaderStatus && (
							<a target="_blank" href={logoUrl} rel="noreferrer">
								{logoSrc ? <CustomImg src={logoSrc} /> : <Logo height="2rem" />}
							</a>
						)}
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
			{/* Hide for now because https://app.useberry.com/embed/embed-script.js not working */}
			{/* {feedbackVisible && feedbackConfig === 'TRUE' && (
				<FeedbackDiv className="feedback" onClick={removeFeedback}>
					<FeedbackContainer
						data-useberry-trigger="true"
						data-useberry-mode="live"
						data-useberry-test-id="mmuYb4FfdgPlom"
					>
						<FeedbackText>Tell us how are we doing</FeedbackText>
						<Icon size="medium" color="gray6" icon="SmileOutline" />
					</FeedbackContainer>
					<Icon
						style={{
							position: 'fixed',
							right: '1rem',
							bottom: '2.7rem',
							zIndex: 3,
							backgroundColor: 'transparent',
							color: '#414141',
							borderRadius: '50%',
							cursor: 'pointer',
							border: 'none'
						}}
						icon="Close"
						onClick={removeFeedback}
					/>
				</FeedbackDiv>
			)} */}
		</Container>
	);
};
export default ShellHeader;
