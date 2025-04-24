import {groupBy} from '@/utils/object';
import {useQuery} from '@tanstack/react-query';
import {ParlantClient} from 'parlant-client';
import type {Agent, Event, Session} from 'parlant-client/src/api';
import {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import type {JSX} from 'react';
import type {ChatProps} from '@/App';
import {createUseStyles} from 'react-jss';
import clsx from 'clsx';
import ChatHeader from './header/ChatHeader';
import MessageList from './message-list/MessageList';
import ChatInput from './input/ChatInput';
import ChatFooter from './footer/ChatFooter';

const useStyles = createUseStyles({
	chatbox: {
		background: 'white',
		height: 'min(48.75rem,70vh)',
		borderRadius: '20px',
		display: 'flex',
		fontFamily: 'Inter',
		flexDirection: 'column',
		transition: 'all 0.3s ease-in-out',
		width: '27.75rem',
	},
	expandedChatbot: {
		width: '899px',
		height: 'min(880px,80vh)',
		maxWidth: '95vw',
	}
});

export interface MessageInterface extends Event {
	status: string | null;
	error?: string;
}

interface StatusEventData {
	status?: string;
	exception?: string;
}

export const createEmptyPendingMessage = (): Partial<Event & {serverStatus: string}> => ({
	kind: 'message',
	source: 'customer',
	creationUtc: new Date(),
	serverStatus: 'pending',
	offset: 0,
	correlationId: '',
	data: {
		message: '',
	},
});

const Chat = ({route, sessionId, agentName, agentAvatar, components, sendIcon, classNames, asPopup, changeIsExpanded, chatDescription}: ChatProps & {changeIsExpanded?: () => void;}): JSX.Element => {
	const classes = useStyles();

	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [messages, setMessages] = useState<MessageInterface[]>([]);
	const [lastOffset, setLastOffset] = useState<number>(0);
	const [showInfo, setShowInfo] = useState<string>('');
	const [pendingMessage, setPendingMessage] = useState<Partial<Event>>(createEmptyPendingMessage());
	const [message, setMessage] = useState<string>('');

	const submitButtonRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const lastMessageRef = useRef<HTMLDivElement>(null);

	const parlantClient = new ParlantClient({
		environment: route,
	});

	const {data} = useQuery<Event[]>({
		queryKey: ['events', lastOffset],
		queryFn: () => parlantClient.sessions.listEvents(sessionId, {waitForData: 60, minOffset: lastOffset}),
	});
	const {data: sessionData} = useQuery<Session>({
		queryKey: ['session'],
		queryFn: () => parlantClient.sessions.retrieve(sessionId),
	});

	const {data: agentData} = useQuery<Partial<Agent> | null>({
		queryKey: ['agent'],
		queryFn: () => agentName ? {name: agentName} : sessionData?.agentId ? fetch(`${route}/agents/${sessionData.agentId}`).then(res => res.json()) : null,
		enabled: !!sessionData?.agentId,
	});

	const correlationsMap = useMemo(
		() => groupBy(data || [], (item: Event) => item?.correlationId.split('::')[0]),
		[data]
	);
	const messageEvents = useMemo(
		() => data?.filter((e) => e.kind === 'message') || [],
		[data]
	);
	const withStatusMessages = useMemo(
		() => messageEvents.map((newMessage, i) => {
			const messageData: MessageInterface = { ...newMessage, status: '' };
			const correlationItems = correlationsMap[newMessage.correlationId.split('::')[0]];
			const lastCorrelationItem = (correlationItems?.at(-1)?.data) as StatusEventData | undefined;
			messageData.status = lastCorrelationItem?.status || (messageEvents[i + 1] ? 'ready' : null);
			if (messageData.status === 'error') {
				messageData.error = lastCorrelationItem?.exception;
			}
			return messageData;
		}),
		[messageEvents, correlationsMap]
	);

	const handleTextareaKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			submitButtonRef?.current?.click();
		} else if (e.key === 'Enter' && e.shiftKey) {
			e.preventDefault();
		}
	};

	const postMessage = async (content: string): Promise<void> => {
		if (!content.trim()) return;

		setPendingMessage((prev) => ({
			...prev,
			sessionId,
			data: {message: content},
		}));

		setMessage('');

		await parlantClient.sessions.createEvent(sessionId, {
			kind: 'message',
			message: content,
			source: 'customer',
		});
	};

	const formatMessagesFromEvents = useCallback((): void => {
		const lastEvent = data?.at(-1);
		const lastStatusEvent = data?.findLast((e) => e.kind === 'status');

		if (!lastEvent) return;

		const offset = lastEvent?.offset;
		if (offset !== undefined) setLastOffset(offset + 1);

		setMessages((currentMessages: MessageInterface[]) => {
			const lastMessage = currentMessages.at(-1);

			if (lastMessage?.source === 'customer' && correlationsMap[lastMessage.correlationId]) {
				const lastCorrelationItem = (correlationsMap[lastMessage.correlationId].at(-1)?.data) as StatusEventData;
				lastMessage.status = lastCorrelationItem?.status || lastMessage.status;

				if (lastMessage.status === 'error') {
					lastMessage.error = lastCorrelationItem?.exception;
				}
			}

			if (!withStatusMessages.length) return [...currentMessages];

			if ((pendingMessage?.data as {message?: string})?.message) {
				setPendingMessage(createEmptyPendingMessage());
			}

			const mergedMessages: (Event | undefined)[] = [];

			for (const messageArray of [currentMessages, withStatusMessages]) {
				for (const message of messageArray) {
					mergedMessages[message.offset] = message;
				}
			}

			return mergedMessages.filter((message): message is MessageInterface => !!message);
		});

		const lastStatusEventStatus = (lastStatusEvent?.data as StatusEventData)?.status;
		setShowInfo(
			!!messages.length && lastStatusEventStatus === 'processing'
				? 'Thinking...'
				: lastStatusEventStatus === 'typing'
				? 'Typing...'
				: ''
		);
	}, [data, pendingMessage, withStatusMessages, correlationsMap]);

	useEffect(() => {
		formatMessagesFromEvents();
	}, [data, formatMessagesFromEvents]);

	useEffect(() => {
		if (showInfo !== 'Typing...') lastMessageRef?.current?.scrollIntoView({block: 'nearest'});
	}, [messages.length, showInfo]);

	const changeIsExpandedFn = (): void => {
		setIsExpanded(!isExpanded);
		changeIsExpanded?.();
	};

	return (
		<div className={clsx(classes.chatbox, isExpanded && classes.expandedChatbot, classNames?.chatbox)}>
			{components?.header ?
				<components.header changeIsExpanded={changeIsExpandedFn} /> :
				<ChatHeader
					agentName={agentData?.name}
					agentAvatar={agentAvatar}
					changeIsExpanded={changeIsExpandedFn}
					isExpanded={isExpanded}
				/>}
				<MessageList
					messages={messages}
					showInfo={showInfo}
					agentName={agentData?.name}
					agentAvatar={agentAvatar}
					components={components}
					classNames={classNames}
					chatDescription={chatDescription}
				/>

			<ChatInput
				onSendMessage={postMessage}
				sendIcon={sendIcon}
				className={classNames?.textarea}
				asPopup={asPopup}
				focusTrigger={isExpanded}
			/>
			<ChatFooter
				showInfo={showInfo}
				className={classNames?.bottomLine}
			/>
		</div>
	);
};

export default Chat;
