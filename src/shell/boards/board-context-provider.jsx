/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, { useCallback, useMemo, useReducer } from 'react';

import { pickBy, trim } from 'lodash';
import { useTranslation } from 'react-i18next';

import { BoardValueContext, BoardSetterContext } from './board-context';
import { useBridge } from '../../store/context-bridge';

function getRandomKey() {
	return String(Date.now() * (Math.floor(Math.random() * 1000) + 1));
}
// eslint-disable-next-line sonarjs/cognitive-complexity
const reducer = (state, action) => {
	switch (action.type) {
		case 'ADD_BOARD': {
			return {
				...state,
				boards: {
					[action.payload.boardKey]: {
						url: action.payload.url,
						title: action.payload.title,
						context: action.payload.context,
						app: action.payload.app
					},
					...state.boards
				},
				currentBoard: action.payload.boardKey,
				minimized: false
			};
		}
		case 'REMOVE_BOARD': {
			let newCurrentBoard = state.currentBoard;
			const boardKeys = Object.keys(state.boards);
			const boardToRemove = (action.payload && action.payload.key) || state.currentBoard;
			if (state.currentBoard === boardToRemove) {
				const removedBoardIndex = boardKeys.indexOf(boardToRemove);
				newCurrentBoard = boardKeys[removedBoardIndex > 0 ? removedBoardIndex - 1 : 1];
			}
			return {
				...state,
				boards: pickBy(state.boards, (board, key) => key !== boardToRemove),
				largeView: boardKeys.length === 1 ? false : state.largeView,
				currentBoard: newCurrentBoard
			};
		}
		case 'REMOVE_ALL_BOARDS': {
			return {
				...state,
				boards: {},
				largeView: false
			};
		}
		case 'UPDATE_BOARD': {
			if (!state.boards[action.payload.key]) return state;
			const updatedBoards = { ...state.boards };
			if (action.payload.url) updatedBoards[action.payload.key].url = action.payload.url;
			if (action.payload.title) updatedBoards[action.payload.key].title = action.payload.title;
			return {
				...state,
				boards: updatedBoards
			};
		}
		case 'UPDATE_CURRENT_BOARD': {
			const updatedBoards = { ...state.boards };
			if (action.payload.url) updatedBoards[state.currentBoard].url = action.payload.url;
			if (action.payload.title) updatedBoards[state.currentBoard].title = action.payload.title;
			return {
				...state,
				boards: updatedBoards
			};
		}
		case 'SET_CURRENT_BOARD': {
			return {
				...state,
				currentBoard: action.payload.key
			};
		}
		case 'TOGGLE_LARGE_VIEW': {
			return {
				...state,
				largeView: !state.largeView
			};
		}
		case 'TOGGLE_MINIMIZED': {
			return {
				...state,
				minimized: !state.minimized
			};
		}
		default:
			console.warn('Unrecognized action type in BoardContext');
			return state;
	}
};

export default function BoardContextProvider({ children }) {
	const [t] = useTranslation();
	const [boardState, dispatch] = useReducer(reducer, {
		boards: {},
		currentBoard: 0,
		largeView: false,
		minimized: false
	});

	const addBoard = useCallback(
		(url, context, app) => {
			const boardKey = getRandomKey();
			dispatch({
				type: 'ADD_BOARD',
				payload: {
					url: `/${trim(url, '/')}`,
					title: context?.title ?? t('new_tab', 'New Tab'),
					context,
					boardKey,
					app
				}
			});
			return boardKey;
		},
		[t]
	);
	const removeBoard = useCallback((key) => {
		dispatch({ type: 'REMOVE_BOARD', payload: { key } });
	}, []);
	const removeCurrentBoard = useCallback(() => {
		dispatch({ type: 'REMOVE_BOARD' });
	}, []);
	const removeAllBoards = useCallback(() => {
		dispatch({ type: 'REMOVE_ALL_BOARDS' });
	}, []);
	const updateBoard = useCallback((key, url, title) => {
		dispatch({ type: 'UPDATE_BOARD', payload: { key, url, title } });
	}, []);
	const updateCurrentBoard = useCallback((url, title) => {
		dispatch({ type: 'UPDATE_CURRENT_BOARD', payload: { url, title } });
	}, []);
	const setCurrentBoard = useCallback((key) => {
		dispatch({ type: 'SET_CURRENT_BOARD', payload: { key } });
	}, []);
	const toggleLargeView = useCallback(() => {
		dispatch({ type: 'TOGGLE_LARGE_VIEW' });
	}, []);
	const toggleMinimized = useCallback(() => {
		dispatch({ type: 'TOGGLE_MINIMIZED' });
	}, []);

	const boardSetters = useMemo(
		() => ({
			addBoard,
			removeBoard,
			removeCurrentBoard,
			removeAllBoards,
			updateBoard,
			setCurrentBoard,
			toggleLargeView,
			toggleMinimized,
			updateCurrentBoard
		}),
		[
			addBoard,
			removeAllBoards,
			removeBoard,
			removeCurrentBoard,
			setCurrentBoard,
			toggleLargeView,
			toggleMinimized,
			updateBoard,
			updateCurrentBoard
		]
	);

	const cbFunctions = useMemo(
		() => ({
			packageDependentFunctions: {
				addBoard: (pkg) => (path, context) => {
					addBoard(path, context, context?.app ?? pkg);
				}
			},
			functions: {
				removeBoard,
				removeCurrentBoard,
				updateBoard,
				setCurrentBoard,
				updateCurrentBoard,
				toggleMinimizedBoard: toggleMinimized
			}
		}),
		[
			addBoard,
			removeBoard,
			removeCurrentBoard,
			setCurrentBoard,
			toggleMinimized,
			updateBoard,
			updateCurrentBoard
		]
	);
	useBridge(cbFunctions);

	return (
		<BoardValueContext.Provider value={boardState}>
			<BoardSetterContext.Provider value={boardSetters}>{children}</BoardSetterContext.Provider>
		</BoardValueContext.Provider>
	);
}
