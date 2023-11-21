/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useMemo } from 'react';

import { useAllConfigStore } from './store';
import { Attribute } from '../../../types';

export const useAllConfig = (): Array<Attribute> => {
	const config = useAllConfigStore((s) => s.a);
	return useMemo(() => config || [], [config]);
};
