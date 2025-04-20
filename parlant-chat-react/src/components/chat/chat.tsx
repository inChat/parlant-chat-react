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
		border: '1px solid #e7e6e6',
	},
	expandedChatbot: {
		width: '60rem',
		maxWidth: '90vw',
		height: 'min(80rem,80vh)',
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
		height: '3rem',
		maxWidth: '1000px',
		marginBottom: '1.25rem',
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
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	status: {
		position: 'absolute',
		visibility: 'hidden',
		left: '1rem',
		bottom: '-20px',
		margin: 0,
		lineHeight: 'normal',
		fontSize: '11px',
		fontWeight: '500',
		color: '#A9A9A9',
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
		padding: '2.5px 6px 3.5px 6px',
		width: 'fit-content',
		margin: 'auto',
		marginBottom: '0.5rem',
	},
	poweredByContainer: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '0.375rem',
	},
	penIcon: {
		width: '20px',
		height: '20px',
		marginRight: '8px',
		color: '#282828',
	},
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

const Chat = ({route, sessionId, components, sendIcon, classNames, asPopup, changeIsExpanded}: ChatProps): JSX.Element => {
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

	const {data: agentData} = useQuery<Agent | null>({
		queryKey: ['agent'],
		queryFn: () => sessionData?.agentId ? fetch(`${route}/agents/${sessionData.agentId}`).then(res => res.json()) : null,
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
		setTimeout(() => lastMessageRef?.current?.scrollIntoView({block: 'nearest'}), 0);
	}, [messages?.length]);

	const changeIsExpandedFn = (): void => {
		setIsExpanded(!isExpanded);
		changeIsExpanded?.();
	};

	return (
		<div className={clsx(classes.chatbox, isExpanded && classes.expandedChatbot, classNames?.chatbox)}>
			{components?.header ?
				<components.header /> :
				<div className={classes.header}>
					<div className={classes.headerAgentName}>
						{agentData?.name && <div className={classes.headerAgentNameInitials}>{agentData.name[0]?.toUpperCase()}</div>}
						{agentData?.name && <div>{agentData.name}</div>}
					</div>
					<img src={ExpandIcon} alt="expand" className={classes.expandIcon} height={40} width={40} onClick={changeIsExpandedFn} style={{objectFit: 'contain'}}/>
					{/* <Expand className={classes.expandIcon}/> */}
				</div>}
			<div className={clsx('fixed-scroll', classes.messagesArea, classNames?.messagesArea)}>
				{messages.map((message) => {
					const Component = (message?.source === 'customer' ? components?.customerMessage : components?.agentMessage) || Message;

					return <Component key={message.id} message={message} className={message?.source === 'customer' ? classNames?.customerMessage : classNames?.agentMessage} />;
				})}
				<div ref={lastMessageRef} />
			</div>

			<div className={clsx(classes.textareaWrapper, classNames?.textarea)}>
				<img src={PenIcon} alt="pen" className={classes.penIcon} />
				<Textarea
					role="textbox"
					ref={textareaRef}
					placeholder="Message..."
					value={message}
					onKeyDown={handleTextareaKeydown}
					onChange={(e) => setMessage(e.target.value)}
					rows={1}
					className={clsx(classes.textArea, classNames?.textarea)}
				/>

				<p className={clsx(classes.status, showInfo && classes.statusVisible)}>{showInfo}</p>

				<div
					role="button"
					style={{pointerEvents: message?.trim() ? 'all' : 'none', cursor: message?.trim() ? 'pointer' : 'default', opacity: !message?.trim() ? 0.5 : 1}}
					className={classes.sendButton}
					ref={submitButtonRef}
					tabIndex={!message?.trim() ? -1 : 0}
					onClick={() => !!message?.trim() && postMessage(message)}
					onKeyDown={(e) => e.key === 'Enter' && !!message?.trim() && postMessage(message)}
				>
					{sendIcon || (
						<svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
							<title>Send message</title>
							<path d="M0.533203 0.333373L22.5332 10.3334L0.533202 20.3334L2.40554 12.3334L9.42682 10.3334L2.40554 8.33337L0.533203 0.333373Z" fill="#282828" />
						</svg>
					)}
				</div>
			</div>
			<div className={classes.poweredBy}>
				<div className={classes.poweredByContainer}>
					Powered by
					<img src={ParlantLogoFull} alt="Parlant"  height={17} width={68} style={{objectFit: 'contain'}}/>
				</div>
			</div>
		</div>
	);
};

export default Chat;
