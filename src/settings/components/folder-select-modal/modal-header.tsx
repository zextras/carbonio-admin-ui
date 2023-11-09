/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import React from 'react';

import { Divider, Text, Row, IconButton, Padding } from '@zextras/carbonio-design-system';

type ModalHeaderProps = {
	title: string;
	onClose: () => void;
};

const ModalHeader = ({
	title,
	onClose
}: ModalHeaderProps): React.ReactElement<ModalHeaderProps> => (
	<Row orientation="horizontal" mainAlignment="space-between" takeAvailableSpace width="100%">
		<Text weight="bold" size="large">
			{title}
		</Text>
		<IconButton
			size="medium"
			style={{ padding: 0, margin: 0 }}
			onClick={onClose}
			icon="CloseOutline"
		/>
		<Divider />
		<Padding bottom="medium" />
	</Row>
);

export default ModalHeader;
