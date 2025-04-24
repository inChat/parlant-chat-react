import {groupBy} from '@/utils/object';
import {useQuery} from '@tanstack/react-query';
import {ParlantClient} from 'parlant-client';
import type {Agent, Event, Session} from 'parlant-client/src/api';
import {useEffect, useRef, useState} from 'react';
import type {JSX} from 'react';
import Message from './message/message';
import {Textarea} from '../ui/textarea';
import type {ChatProps} from '@/App';
import {createUseStyles} from 'react-jss';
import clsx from 'clsx';
import ExpandIcon from '../../assets/icons/expand.svg';
import PenIcon from '../../assets/icons/pen.svg';
import ParlantLogoFull from '../../assets/parlant-logo-full.svg';
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
	},
	header: {
		height: '4rem',
		borderRadius: '20px 20px 0 0',
		borderBottom: '1px solid #EEEEEE',
		color: 'white',
		justifyContent: 'space-between',
		display: 'flex',
		alignItems: 'center',
		paddingInline: '20px',
		fontSize: '1.2rem',
	},
	headerAgentName: {
		fontSize: '1rem',
		fontWeight: '500',
		color: '#151515',
		display: 'flex',
		alignItems: 'center',
		gap: '18px',
	},
	headerAgentNameInitials: {
		fontSize: '20px',
		fontWeight: '700',
		color: '#FFFFFF',
		backgroundColor: '#282828',
		borderRadius: '6.5px',
		paddingInline: '7.8px',
		paddingBlock: '5px',
		lineHeight: '100%',
		width: 'fit-content',
	},
	messagesArea: {
		flex: 1,
		overflow: 'auto',
		scrollbarWidth: 'thin',
		scrollbarColor: 'gray transparent',
		marginTop: '10px',
		'&::-webkit-scrollbar': {
			width: '6px',
		},
		'&::-webkit-scrollbar-track': {
			background: 'transparent',
		},
		'&::-webkit-scrollbar-thumb': {
			background: '#006E53',
			borderRadius: '3px',
		},
	},
	textareaWrapper: {
		marginInline: '20px',
		flex: 'none',
		position: 'relative',
		border: '1px solid #F2F2F2',
		borderRadius: '10px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'white',
		lineHeight: '3rem',
		paddingLeft: '0.85rem',
		marginTop: '1rem',
		boxShadow: '0px 3px 3px 0px #00000005',
		paddingRight: '0',
		height: '3.375rem',
		maxWidth: '1000px',
		gap: '4px',
	},
	textArea: {
		boxShadow: 'none',
		color: 'black',
		resize: 'none',
		border: 'none',
		height: '100%',
		borderRadius: '0',
		minHeight: 'unset',
		padding: '0',
		whiteSpace: 'nowrap',
		fontFamily: 'Inter',
		fontSize: '1rem',
		lineHeight: '52px',
		backgroundColor: 'white',
		fontWeight: '300',
		'&::placeholder': {
			color: '#282828',
			fontSize: '14px',
			fontWeight: '500'
		},
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	bottomLine: {
		paddingInline: '25px',
		left: '1rem',
		bottom: '-20px',
		margin: 0,
		lineHeight: 'normal',
		fontSize: '11px',
		fontWeight: '500',
		color: '#A9A9A9',
		alignItems: 'center',
		height: '37px',
		display: 'flex',
		'& > div': {
			flex: 1,
		}
	},
	statusInvisible: {
		visibility: 'hidden',
	},
	statusVisible: {
		visibility: 'visible',
	},
	expandIcon: {
		width: '20px',
		height: '20px',
		cursor: 'pointer',
	},
	sendButton: {
		maxWidth: '60px',
		background: 'none',
		borderRadius: '100%',
		border: 'none !important',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '40px',
		'&:hover': {
			background: 'white !important',
			border: 'none !important',
		},
	},
	poweredBy: {
		fontSize: '12px',
		fontWeight: '400',
		color: '#A9A9A9',
		lineHeight: '18px',
		textAlign: 'center',
		width: 'fit-content',
		margin: 'auto',
		marginBottom: '0.5rem',
	},
	poweredByContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'end',
		gap: '0.375rem',
	},
	penIcon: {
		width: '20px',
		height: '20px',
		marginRight: '8px',
		color: '#282828',
	},
	chatDescription: {
		width: '340px',
		marginTop: '20px',
		marginBottom: '30px',
		margin: 'auto',
		textAlign: 'center',
		fontSize: '14px',
		fontWeight: '400',
		color: '#A9A9A9',
		lineHeight: '22px',
	},
	bubblesWrapper: {
		height: 'fit-content',
		width: 'fit-content',
		backgroundColor: '#F5F9F7',
		padding: '10px',
		margin: '10px',
		marginInline: '20px',
		borderRadius: '15px',
	},
	bubbles: {
		height: '15px',
		width: '31px',
		aspectRatio: '2.5',
		'--_g': 'no-repeat radial-gradient(farthest-side,#282828 90%,#0000)',
		background: 'var(--_g), var(--_g), var(--_g)',
		backgroundSize: '25% 50%',
		animation: '$l43 1s infinite linear'
	},
	'@keyframes l43': {
		'0%': {
			backgroundPosition: 'calc(0*100%/2) 50%, calc(1*100%/2) 50%, calc(2*100%/2) 50%'
		},
		'20%': {
			backgroundPosition: 'calc(0*100%/2) 0, calc(1*100%/2) 50%, calc(2*100%/2) 50%'
		},
		'40%': {
			backgroundPosition: 'calc(0*100%/2) 100%, calc(1*100%/2) 0, calc(2*100%/2) 50%'
		},
		'60%': {
			backgroundPosition: 'calc(0*100%/2) 50%, calc(1*100%/2) 100%, calc(2*100%/2) 0'
		},
		'80%': {
			backgroundPosition: 'calc(0*100%/2) 50%, calc(1*100%/2) 50%, calc(2*100%/2) 100%'
		},
		'100%': {
			backgroundPosition: 'calc(0*100%/2) 50%, calc(1*100%/2) 50%, calc(2*100%/2) 50%'
		}
	},
});

const defaultChatDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquet et magna nec imperdiet.';

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

	const formatMessagesFromEvents = (): void => {
		const lastEvent = data?.at(-1);
		const lastStatusEvent = data?.findLast((e) => e.kind === 'status');

		if (!lastEvent) return;

		const offset = lastEvent?.offset;
		if (offset !== undefined) setLastOffset(offset + 1);

		const correlationsMap = groupBy(data || [], (item: Event) => item?.correlationId.split('::')[0]);

		const newMessages = data?.filter((e) => e.kind === 'message') || [];
		const withStatusMessages = newMessages.map((newMessage, i) => {
			const messageData: MessageInterface = {...newMessage, status: ''};
			const correlationItems = correlationsMap?.[newMessage.correlationId.split('::')[0]];
			const lastCorrelationItem = correlationItems?.at(-1)?.data as StatusEventData | undefined;

			messageData.status = lastCorrelationItem?.status || (newMessages[i + 1] ? 'ready' : null);

			if (messageData.status === 'error') {
				messageData.error = lastCorrelationItem?.exception;
			}

			return messageData;
		});

		setMessages((currentMessages: MessageInterface[]) => {
			const lastMessage = currentMessages.at(-1);

			if (lastMessage?.source === 'customer' && correlationsMap?.[lastMessage?.correlationId]) {
				const lastCorrelationItem = correlationsMap[lastMessage.correlationId].at(-1)?.data as StatusEventData;
				lastMessage.status = lastCorrelationItem?.status || lastMessage.status;

				if (lastMessage.status === 'error') {
					lastMessage.error = lastCorrelationItem?.exception;
				}
			}

			if (!withStatusMessages?.length) return [...currentMessages];

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
		setShowInfo(!!messages?.length && lastStatusEventStatus === 'processing' ? 'Thinking...' : lastStatusEventStatus === 'typing' ? 'Typing...' : '');
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (asPopup) textareaRef?.current?.focus();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		formatMessagesFromEvents();
	}, [data?.length]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (showInfo !== 'Typing...') lastMessageRef?.current?.scrollIntoView({block: 'nearest'});
	}, [messages?.length, showInfo]);

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
			/>
			<ChatFooter
				showInfo={showInfo}
				className={classNames?.bottomLine}
			/>
		</div>
	);
};

export default Chat;
