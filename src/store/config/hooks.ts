/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import { useMemo } from 'react';
import { Attribute } from '../../../types';
import { useAllConfigStore } from './store';

export const useAllConfig = (): Array<Attribute> => {
	const config = useAllConfigStore((s) => s.a);
	return useMemo(() => config || [], [config]);
};
