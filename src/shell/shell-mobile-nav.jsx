/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React from 'react';

import { Accordion, Collapse, Container, Padding } from '@zextras/carbonio-design-system';
import { reduce, find, get, sortBy } from 'lodash';
import { useHistory } from 'react-router-dom';

import AppContextProvider from '../boot/app/app-context-provider';
import { useAppStore } from '../store/app';

const SidebarComponent = ({ item }) =>
	item.secondary ? (
		<AppContextProvider pkg={item.id}>
			<item.secondary />
		</AppContextProvider>
	) : null;

export default function ShellMobileNav({ mobileNavIsOpen, menuTree }) {
	const history = useHistory();
	const views = useAppStore((s) => {
		const sortedRoutes = sortBy(
			sortBy(s.routes, (item) => get(item, 'position', 0)),
			(item) => get(item, 'primarybarSection.position', 0)
		);
		return reduce(
			sortedRoutes,
			(acc, val) => {
				const primary = find(s.views.primaryBar, (item) => item.id === val.id);
				const secondary = find(s.views.secondaryBar, (item) => item.id === val.id);
				if (primary && primary.visible) {
					acc.push({
						id: `${val.app}-wrap`,
						label: primary.label,
						icon:
							typeof primary.component === 'string' || typeof primary.component === 'function'
								? primary.component
								: 'Cube',
						onClick: () => history.push(`/${val.route}`),
						items: secondary
							? [
									{
										id: secondary.id,
										label: secondary.id,
										icon: 'Cube',
										secondary: secondary.component,
										CustomComponent: SidebarComponent
									}
							  ]
							: []
					});
				}
				return acc;
			},
			[]
		);
	});

	return (
		<Container
			height="fill"
			width="fit"
			background="gray5"
			style={{
				position: 'absolute',
				left: 0,
				top: 0,
				zIndex: 3
			}}
		>
			<Collapse orientation="horizontal" open={mobileNavIsOpen} crossSize="100%">
				<Container
					width={256 + 48 + 12}
					height="fill"
					orientation="vertical"
					mainAlignment="space-between"
					style={{
						maxHeight: 'calc(100vh - 48px)',
						overflowY: 'auto'
					}}
				>
					<Container width="fill" height="fit" orientation="vertical" mainAlignment="space-between">
						<Accordion items={views} />
					</Container>
					<Container width="fill" height="fit" orientation="vertical" mainAlignment="flex-end">
						<Accordion items={menuTree} />
						<Padding vertical="medium">{/* <UserQuota mobileView={true}/> */}</Padding>
					</Container>
				</Container>
			</Collapse>
		</Container>
	);
}
