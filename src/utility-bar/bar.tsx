/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Container, Tooltip, IconButton, Dropdown, Text } from '@zextras/carbonio-design-system';
import { map } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useUtilityBarStore } from './store';
import { useUtilityViews } from './utils';
import { UtilityView } from '../../types/apps';
import { SHELL_APP_ID } from '../constants';
import { logout } from '../network/logout';
import { useUserAccount } from '../store/account';
import { useContextBridge } from '../store/context-bridge';

const UtilityBarItem: FC<{ view: UtilityView }> = ({ view }) => {
	const { mode, setMode, current, setCurrent } = useUtilityBarStore();
	const onClick = useCallback((): void => {
		// eslint-disable-next-line no-nested-ternary
		setMode(current !== view.id ? 'open' : mode !== 'open' ? 'open' : 'closed');
		setCurrent(view.id);
	}, [current, mode, setCurrent, setMode, view.id]);
	if (typeof view.button === 'string') {
		return (
			<Tooltip label={view.label} placement="bottom-end">
				<IconButton
					icon={view.button}
					iconColor={current === view.id ? 'primary' : 'text'}
					onClick={onClick}
					size="large"
				/>
			</Tooltip>
		);
	}
	return <view.button mode={mode} setMode={setMode} />;
};

export const ShellUtilityBar: FC = () => {
	const [accountName, setAccountName] = useState('');
	const views = useUtilityViews();
	const acct = useUserAccount();
	const [t] = useTranslation();
	const accountItems = useMemo(
		() => [
			{
				id: 'feedback',
				label: t('label.feedback', 'Feedback'),
				click: () =>
					useContextBridge.getState().packageDependentFunctions?.addBoard(SHELL_APP_ID)(
						'/feedback/',
						{ title: t('label.feedback', 'Feedback') }
					),
				icon: 'MessageSquareOutline'
			},
			{
				id: 'logout',
				label: t('label.logout', 'Logout'),
				click: logout,
				icon: 'LogOut'
			}
		],
		[t]
	);

	const clipTextAfterWords = (text: string): string => {
		const words = text?.split('');
		const clippedText = words?.slice(0, 32).join('');
		return clippedText + (words?.length > 32 ? '...' : '');
	};

	useEffect(() => {
		if (acct?.name) {
			setAccountName(clipTextAfterWords(acct?.name));
		}
	}, [acct?.name]);

	return (
		<Container orientation="horizontal" width="fit">
			{map(views, (view) => (
				<UtilityBarItem view={view} key={view.id} />
			))}
			<Container margin={{ right: 'small' }}>
				<Text color="primary" style={{ whiteSpace: 'pre-line', textAlign: 'left' }}>
					{accountName}
				</Text>
			</Container>
			<Tooltip label={t('label.account_menu', 'Account menu')} placement="left-end">
				<Dropdown items={accountItems}>
					<IconButton
						icon="AvatarOutline"
						customSize={{ iconSize: '1.5rem', paddingSize: 'medium' }}
						iconColor="primary"
					/>
				</Dropdown>
			</Tooltip>
		</Container>
	);
};
