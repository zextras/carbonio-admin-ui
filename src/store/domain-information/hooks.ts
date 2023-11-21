/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useMemo } from 'react';

import { useDomainInformationStore } from './store';
import { DomainInformationState } from '../../../types';

export const useDomainInformation = (): DomainInformationState => {
	const info: DomainInformationState = useDomainInformationStore((s: any) => s);
	return useMemo(() => info || {}, [info]);
};
