/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useMemo } from 'react';
import { DomainInformationState } from '../../../types';
import { useDomainInformationStore } from './store';

export const useDomainInformation = (): DomainInformationState => {
	const info: DomainInformationState = useDomainInformationStore((s: any) => s);
	return useMemo(() => info || {}, [info]);
};
