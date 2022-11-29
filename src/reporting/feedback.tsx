/*
 * SPDX-FileCopyrightText: 2021 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, {
	useEffect,
	useState,
	useCallback,
	useReducer,
	useMemo,
	FC,
	useContext
} from 'react';
import {
	Text,
	Button,
	Select,
	Container,
	Row,
	Icon,
	SnackbarManagerContext,
	Padding
} from '@zextras/carbonio-design-system';
import { Severity, Event } from '@sentry/browser';
import { filter, find, map } from 'lodash';
import styled from 'styled-components';
import { TFunction, useTranslation } from 'react-i18next';
import { useUserAccount, useAccountStore } from '../store/account';
import { useRemoveCurrentBoard } from '../shell/boards/board-hooks';
import { feedback } from './functions';
import { useAppList } from '../store/app';
import Logo from '../../assets/carbonio_feedback.svg';
import { useAllConfigStore } from '../store/config/store';
import { getCarbonioBackendVersion } from '../network/fetch';

const TextArea = styled.textarea<{ size?: string }>`
	width: 100%;
	height: 96%;
	min-height: 96%;
	box-sizing: border-box;
	outline: none;
	border: none;
	background: ${({ theme }): string => theme.palette.gray4.regular};
	resize: none;
	transition: height 0.4s ease;
	color: ${({ theme }): string => theme.palette.text.regular};
	font-family: ${({ theme }): string => theme.fonts.default};
	font-size: ${({ theme, size }): string => theme.sizes.font[size ?? 'medium']};
	&:focus {
		background: ${({ theme }): string => theme.palette.gray4.regular};
		outline: none;
	}
`;

const TextContainer = styled(Container)`
	text-align: justify;
	align-items: left;
	width: 80%;
`;

const ButtonContainer = styled(Container)`
	width: 100%;
	position: relative;
	padding-bottom: 32px;
`;

const TAContainer = styled(Container)`
	background: ${({ theme }): string => theme.palette.gray4.regular};
	border-radius: 2px 2px 0 0;
	padding: 8px;
	width: 100%;
	transition: height 0.4s ease;
	height: 100%;
	max-height: 100%;
	&:focus-within {
		background: ${({ theme }): string => theme.palette.gray4.regular};
		outline: none;
		border-bottom: 1px solid ${({ theme }): string => theme.palette.primary.regular};
	}
`;

const SubHeadingText = styled(Text)`
	border-radius: 2px 2px 0 0;
	line-height: 21px;
	font-size: 14px;
	font-weight: 300;
	margin-top: 10px;
	line-height: ${(props): string => props.lineHeight};
`;

const LabelContainer = styled(Container)`
	border-bottom: 1px solid ${(props): string => (props.disabled ? 'red' : '#cfd5dc')};
`;

const emptyEvent: Event = {
	message: '',
	level: Severity.Info,
	release: 'unknown',
	extra: {
		app: '0',
		topic: '0'
	},
	user: {}
};

function reducer(state: Event, { type, payload }: { type: string; payload: any }): Event {
	switch (type) {
		case 'set-user':
			return { ...state, user: payload };
		case 'reset':
			return emptyEvent;
		case 'set-message':
			return { ...state, message: payload };
		case 'select-app':
			return {
				...state,
				release: payload.version,
				extra: { ...state.extra, app: payload.app }
			};
		case 'select-topic':
			return { ...state, extra: { ...state.extra, topic: payload } };
		default:
			return state;
	}
}

const getTopics = (t: TFunction): Array<{ label: string; value: string }> => [
	{ label: t('feedback.user_interface', 'User interface'), value: 'UserInterface' },
	{ label: t('feedback.behaviors', 'Behaviors'), value: 'Behaviors' },
	{ label: t('feedback.missing_features', 'Missing features'), value: 'MissingFeatures' },
	{ label: t('feedback.other', 'Other'), value: 'Other' }
];

const Feedback: FC = () => {
	const [t] = useTranslation();
	const topics = useMemo(() => getTopics(t), [t]);
	const allApps = useAppList();
	const [feedbackPermission, setFeedbackPermission] = useState(false);
	const [feedbackSentData, setFeedbackSentData] = useState('');
	const [toggleFeedback, setToggleFeedback] = useState(false);
	const [carbonioBackendVersion, setCarbonioBackendVersion] = useState('');
	const configs = useAllConfigStore((c) => c.a);

	useEffect(() => {
		if (configs && configs.length > 0) {
			const carbonioSendFullErrorStack = configs.find(
				(item: any) => item?.n === 'carbonioSendFullErrorStack'
			);
			const carbonioSendAnalytics = configs.find(
				(item: any) => item?.n === 'carbonioSendAnalytics'
			);
			const carbonioAllowFeedback = configs.find(
				(item: any) => item?.n === 'carbonioAllowFeedback'
			);
			if (
				carbonioSendFullErrorStack?._content === 'TRUE' &&
				carbonioSendAnalytics?._content === 'TRUE' &&
				carbonioAllowFeedback?._content === 'TRUE'
			) {
				setFeedbackPermission(true);
			}
		}
	}, [configs]);
	const apps = useMemo(
		() => filter(allApps, (app) => !!app.sentryDsn),

		[allApps]
	);
	const appItems = useMemo(
		() =>
			map(apps, (app) => ({
				label: app.display,
				value: app.name
			})),
		[apps]
	);
	const acct = useUserAccount();
	const accountStore = useAccountStore();

	const [event, dispatch] = useReducer(reducer, emptyEvent);
	const [showErr, setShowErr] = useState(false);
	const [limit, setLimit] = useState(0);

	const onAppSelect = useCallback(
		(ev) =>
			dispatch({
				type: 'select-app',
				payload: {
					app: ev,
					version: find(apps, ['name', ev])?.version
				}
			}),
		[apps]
	);

	const onTopicSelect = useCallback((ev) => {
		setShowErr(false);
		dispatch({ type: 'select-topic', payload: ev });
	}, []);

	const getBackendVersion = useCallback(() => {
		getCarbonioBackendVersion().then((data) => {
			if (data?.Body?.response?.content) {
				const versionResponse = JSON.parse(data?.Body?.response?.content);
				setCarbonioBackendVersion(versionResponse?.response?.currentVersion);
			}
		});
	}, []);

	const onInputChange = useCallback((ev) => {
		// eslint-disable-next-line no-param-reassign
		ev.target.style.height = 'auto';
		// eslint-disable-next-line no-param-reassign
		// ev.target.style.height = `${25 + ev.target.scrollHeight}px`;
		if (ev.target.value.length <= 500) {
			setLimit(ev.target.value.length);
			dispatch({ type: 'set-message', payload: ev.target.value });
		}
	}, []);

	const checkTopicSelect = useCallback(
		(ev) => {
			if (event.extra?.topic === '0') setShowErr(true);
			else setShowErr(false);
			if (ev.keyCode === 8) {
				if (event.message?.length === 0) {
					setShowErr(false);
				}
			}
		},
		[setShowErr, event]
	);

	const closeBoard = useRemoveCurrentBoard();

	const createSnackbar = useContext(SnackbarManagerContext) as (snackbar: any) => void;

	const confirmHandler = useCallback(() => {
		const feedbackData = feedback(event, carbonioBackendVersion);
		setToggleFeedback(true);
		setFeedbackSentData(feedbackData);
		// closeBoard();
	}, [carbonioBackendVersion, event]);

	// const confirmCountMeInHandler = useCallback(() => {
	// 	const eventObj: any = { ...event };
	// 	eventObj.email = acct.displayName;
	// 	eventObj.name = acct.name;
	// 	eventObj.comments = `Participate for testing : ${acct.name}`;
	// 	const feedbackId = feedback(eventObj);
	// 	setToggleFeedback(true);
	// 	closeBoard();
	// }, [event, closeBoard, acct]);

	useEffect(() => {
		dispatch({
			type: 'set-user',
			payload: { id: acct.id, name: acct.displayName ?? acct.name }
		});
	}, [acct]);

	useEffect(() => {
		getBackendVersion();
	}, [getBackendVersion]);

	const disabledSend = useMemo(() => (event?.message?.length ?? 0) <= 0, [event?.message]);

	return (
		<>
			{!feedbackPermission ? (
				<>
					<Container
						padding={{ top: 'extralarge' }}
						mainAlignment="space-between"
						crossAlignment="flex-start"
					>
						<Container>
							<Text overflow="break-word" weight="normal" size="large">
								<Padding top="small" />
								<Logo />
							</Text>
							<Padding vertical="large" horizontal="medium" width="294px" />
							<Text
								color="gray1"
								overflow="break-word"
								weight="normal"
								size="large"
								width="60%"
								style={{ whiteSpace: 'pre-line', textAlign: 'center', paddingBottom: '123px' }}
							>
								<Padding bottom="large" />
								<Text>
									{t(
										'label.allow_permission_to_send_data_to_zextras',
										`Allow permission from privacy to send feedback`
									)}
								</Text>
								<Padding top="large" />
							</Text>
						</Container>
					</Container>
				</>
			) : (
				<></>
			)}
			{feedbackPermission && !toggleFeedback && (
				<Container
					padding={{ top: 'extralarge' }}
					mainAlignment="space-between"
					crossAlignment="flex-start"
				>
					<TAContainer crossAlignment="flex-end">
						<TextArea
							value={event.message}
							onKeyUp={checkTopicSelect}
							onChange={onInputChange}
							placeholder={t(
								'feedback.write_here_placeholder_text',
								'Hey! Start writing here your feedback :) \n\n\nThis will be sent anonymously so let us know what we did good \nor wrong with no filter'
							)}
						/>
						<Text size="medium" color="secondary">
							{limit}/500
						</Text>
					</TAContainer>
					<Container orientation="horizontal" height="fit" padding={{ top: 'large' }} width="100%">
						<ButtonContainer crossAlignment="flex-end" mainAlignment="baseline">
							<Button
								width="fill"
								label={t('feedback.send_feedback', 'SHARE YOUR FEEDBACK WITH US')}
								onClick={confirmHandler}
								disabled={disabledSend}
							/>
						</ButtonContainer>
					</Container>
				</Container>
			)}
			{feedbackPermission && toggleFeedback && (
				<Container
					padding={{ top: 'extralarge' }}
					mainAlignment="space-between"
					crossAlignment="flex-start"
				>
					<Container>
						<Text overflow="break-word" weight="normal" size="large">
							<Padding top="small" />
							<Logo />
						</Text>
						<Padding vertical="large" horizontal="medium" width="294px" />
						<Text
							color="gray1"
							overflow="break-word"
							weight="normal"
							size="large"
							width="60%"
							style={{ whiteSpace: 'pre-line', textAlign: 'center', paddingBottom: '123px' }}
						>
							<Text weight="bold">
								{t('label.thank_you_for_feedback', `Thank you for the feedback!`)}
							</Text>
							<Padding bottom="large" />
							<Text>{t('label.feedback_request_data', `Feedback request data:`)}</Text>
							<Text overflow="break-word" size="small">
								{feedbackSentData}
							</Text>
							<Padding bottom="large" />
							{/* <Text>
								{t(
									'label.post_feedback_send_helper_text_line_2',
									`To improve Carbonio we’re running continuos testing sessions,`
								)}
							</Text>
							<Text>
								{t(
									'label.post_feedback_send_helper_text_line_3',
									`you can be the voice we’d love to hear right now!`
								)}
							</Text> */}
							<Padding top="large" />
							{/* <Text>{t('label.feedback_helper_text', `Would you like to participate?`)}</Text> */}
						</Text>
					</Container>

					{/* <Container
						orientation="horizontal"
						height="fit"
						padding={{ top: 'extralarge' }}
						width="100%"
					>
						<ButtonContainer crossAlignment="flex-end" mainAlignment="baseline">
							<Button
								width="fill"
								label={t('feedback.count_user_in_helper_button_text', 'YES, COUNT ME IN!')}
								onClick={confirmCountMeInHandler}
							/>
						</ButtonContainer>
					</Container> */}
				</Container>
			)}
		</>
	);
};

export default Feedback;
