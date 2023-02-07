/*
 * SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useMemo } from 'react';
import { useLoginConfigStore } from '../store/login/store';
import { DarkReaderPropValues } from '../../types';

export function useDarkReaderResultValue(): undefined | DarkReaderPropValues {
	const { carbonioWebUiDarkMode } = useLoginConfigStore();

	const darkReaderResultValue = useMemo(
		() => (carbonioWebUiDarkMode && 'enabled') || 'disabled',
		[carbonioWebUiDarkMode]
	);

	return darkReaderResultValue;
}
