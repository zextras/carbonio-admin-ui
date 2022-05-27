/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
	Container,
	IconButton,
	Row,
	Tooltip,
	Text,
	Padding,
	Icon
} from '@zextras/carbonio-design-system';
import { map, isEmpty, trim, filter, sortBy } from 'lodash';
import React, { useContext, FC, useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
// TODO: convert boards management to ts (and maybe a zustand store)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { BoardValueContext, BoardSetterContext } from './boards/board-context';
import { useAppStore } from '../store/app';
import { AppRoute, PrimaryAccessoryView, PrimaryBarView } from '../../types';
import BadgeWrap from './badge-wrap';
import AppContextProvider from '../boot/app/app-context-provider';
import { checkRoute } from '../utility-bar/utils';
import { useUtilityBarStore } from '../utility-bar';
import { Collapser } from './collapser';

const PrimaryContainer = styled(Container)<{ active: boolean }>`
	background: ${({ theme, active }): string => theme.palette[active ? 'gray4' : 'gray6'].regular};
	cursor: pointer;
	transition: background 0.2s ease-out;
	&:hover {
		background: ${({ theme, active }): string => theme.palette[active ? 'gray4' : 'gray6'].hover};
	}
	&:focus {
		background: ${({ theme, active }): string => theme.palette[active ? 'gray4' : 'gray6'].focus};
	}
`;

const ContainerWithDivider = styled(Container)`
	border-right: 1px solid ${({ theme }): string => theme.palette.gray3.regular};
`;

const PrimaryBarContainer = styled(Container)`
	min-width: 48px;
	max-width: 192px;
	width: ${({ sidebarIsOpen }): number => (sidebarIsOpen ? 192 : 48)}px;
	transition: width 300ms;
	overflow-x: hidden;
`;

const PrimaryBarRow = styled(Row)<{ active: boolean }>`
	backgroundcolor: ${({ active }): string => (active ? 'gray4' : 'gray6')};
	&:hover {
		background: ${({ theme, active }): string => theme.palette[active ? 'gray4' : 'gray6'].hover};
	}
`;

const ToggleBoardIcon: FC = () => {
	const { boards, minimized } = useContext(BoardValueContext);
	const { toggleMinimized } = useContext(BoardSetterContext);

	if (isEmpty(boards)) return null;
	return (
		<IconButton
			iconColor="primary"
			icon={minimized ? 'BoardOpen' : 'BoardCollapse'}
			onClick={toggleMinimized}
			size="large"
		/>
	);
};

type PrimaryBarItemProps = {
	view: PrimaryBarView;
	active: boolean;
	onClick: () => void;
};

type PrimaryBarAccessoryItemProps = {
	view: PrimaryAccessoryView;
};

// Alternative layout for the primary bar
// const AdminPrimaryBarElement: FC<PrimaryBarItemProps> = ({ view, active, onClick }) => (
// 	<PrimaryContainer
// 		orientation="horizontal"
// 		mainAlignment="flex-start"
// 		height="48px"
// 		onClick={onClick}
// 	>
// 		<BadgeWrap badge={view.badge}>
// 			{typeof view.component === 'string' ? (
// 				<Icon icon={view.component} color={active ? 'primary' : 'text'} size="large" />
// 			) : (
// 				<view.component active={active} />
// 			)}
// 		</BadgeWrap>
// 		<Padding right="large">
// 			<Text color={active ? 'primary' : 'text'}>{view.label}</Text>
// 		</Padding>
// 	</PrimaryContainer>
// );

const PrimaryBarElement: FC<PrimaryBarItemProps> = ({ view, active, onClick }) => (
	<Tooltip label={view.label} placement="right" key={view.id}>
		<BadgeWrap badge={view.badge}>
			{typeof view.component === 'string' ? (
				<Row>
					<IconButton
						icon={view.component}
						backgroundColor={active ? 'gray4' : 'gray6'}
						iconColor={active ? 'primary' : 'text'}
						onClick={onClick}
						size="large"
					/>
					<Text>{view.label}</Text>
				</Row>
			) : (
				<view.component active={active} />
			)}
		</BadgeWrap>
	</Tooltip>
);

const PrimaryBarExpandElement: FC<PrimaryBarItemProps> = ({ view, active, onClick }) => (
	<Tooltip label={view.label} placement="right" key={view.id}>
		{typeof view.component === 'string' ? (
			<PrimaryBarRow width="fill" mainAlignment="flex-start" active={active} onClick={onClick}>
				<BadgeWrap badge={view.badge}>
					<IconButton icon={view.component} iconColor={active ? 'primary' : 'text'} size="large" />
				</BadgeWrap>
				<Text>{view.label}</Text>
			</PrimaryBarRow>
		) : (
			<BadgeWrap badge={view.badge}>
				<view.component active={active} />
			</BadgeWrap>
		)}
	</Tooltip>
);

const PrimaryBarAccessoryElement: FC<PrimaryBarAccessoryItemProps> = ({ view }) => (
	<Tooltip label={view.label} placement="right" key={view.id}>
		<AppContextProvider key={view.id} pkg={view.app}>
			{typeof view.component === 'string' ? (
				<IconButton
					icon={view.component}
					backgroundColor="gray6"
					iconColor="text"
					onClick={view.onClick}
					size="large"
				/>
			) : (
				<view.component />
			)}
		</AppContextProvider>
	</Tooltip>
);

const ShellPrimaryBar: FC<{ activeRoute: AppRoute }> = ({ activeRoute }) => {
	const isOpen = useUtilityBarStore((s) => s.primaryBarState);
	const setIsOpen = useUtilityBarStore((s) => s.setPrimaryBarState);
	const onCollapserClick = useCallback(() => setIsOpen(!isOpen), [isOpen, setIsOpen]);
	const primaryBarViews = useAppStore((s) => s.views.primaryBar);
	const primarybarSections = useAppStore((s) => s.views.primarybarSections);
	console.log('primaryBarViews =>', primaryBarViews);
	console.log('primarybarSections =>', primarybarSections);
	const [routes, setRoutes] = useState<Record<string, string>>({});
	const history = useHistory();

	useEffect(() => {
		setRoutes((r) =>
			primaryBarViews.reduce((acc, v) => {
				// eslint-disable-next-line no-param-reassign
				if (!acc[v.id]) acc[v.id] = v.route;
				return acc;
			}, r)
		);
	}, [primaryBarViews]);
	useEffect(() => {
		if (activeRoute) {
			setRoutes((r) => ({ ...r, [activeRoute.id]: trim(history.location.pathname, '/') }));
		}
	}, [activeRoute, history.location.pathname, primaryBarViews]);
	const primaryBarAccessoryViews = useAppStore((s) => s.views.primaryBarAccessories);
	const accessories = useMemo(
		() =>
			sortBy(
				filter(primaryBarAccessoryViews, (v) => checkRoute(v, activeRoute)),
				'position'
			),
		[activeRoute, primaryBarAccessoryViews]
	);
	return (
		<>
			<PrimaryBarContainer
				sidebarIsOpen={isOpen}
				role="menu"
				height="fill"
				background="gray6"
				orientation="vertical"
				mainAlignment="space-between"
				onClick={isOpen ? undefined : onCollapserClick}
				style={{
					maxHeight: 'calc(100vh - 48px)',
					overflowY: 'auto'
				}}
			>
				<Container mainAlignment="flex-start">
					{map(primaryBarViews, (view) =>
						// eslint-disable-next-line no-nested-ternary
						view.visible ? (
							!isOpen ? (
								<PrimaryBarElement
									key={view.id}
									onClick={(): void => history.push(`/${routes[view.id]}`)}
									view={view}
									active={activeRoute?.id === view.id}
								/>
							) : (
								<PrimaryBarExpandElement
									key={view.id}
									onClick={(): void => history.push(`/${routes[view.id]}`)}
									view={view}
									active={activeRoute?.id === view.id}
								/>
							)
						) : null
					)}
				</Container>
				<Container mainAlignment="flex-end" height="fit">
					{accessories.map((v) => (
						<PrimaryBarAccessoryElement view={v} key={v.id} />
					))}
					<ToggleBoardIcon />
				</Container>
			</PrimaryBarContainer>
			<Collapser onClick={onCollapserClick} open={isOpen} />
		</>
	);
};

export default ShellPrimaryBar;
