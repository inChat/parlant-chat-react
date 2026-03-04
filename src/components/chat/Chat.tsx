import {useQuery} from '@tanstack/react-query';
import {ParlantClient} from 'parlant-client';
import type {Agent, Event, EventCreationParams, Session} from 'parlant-client/src/api';
import React, {useState, type JSX} from 'react';
import type {ChatProps} from '@/App';
import {createUseStyles} from 'react-jss';
import clsx from 'clsx';
import ChatHeader from '@/components/chat/header/ChatHeader';
import MessageList from '@/components/chat/message-list/MessageList';
import ChatInput from '@/components/chat/input/ChatInput';
import ChatFooter from '@/components/chat/footer/ChatFooter';
import {useSessionEvents, isMessageStreaming} from '@/components/chat/hooks/useSessionEvents';
import type {MessageInterface} from '@/components/chat/types';
export type {MessageInterface};

const useStyles = createUseStyles({
        chatbox: {
                background: 'white',
                height: 'min(48.75rem,70dvh)',
                maxHeight: '100dvh',
                borderRadius: '20px',
                display: 'flex',
                fontFamily: 'Inter',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                width: '27.75rem',
                overflow: 'hidden',
                '@media (max-width: 768px)': {
                        height: '100dvh',
                        maxHeight: '100dvh',
                        width: '100vw',
                        borderRadius: 0,
                },
        },
        expandedChatbox: {
                width: '920px',
                height: 'min(880px,80dvh)',
                maxWidth: '95vw',
        }
});

export interface SectionHeadingData {
	title?: string;
	subtitle?: string;
	image_url?: string;
	theme?: string;
	icon?: string;
}

export const getInitialMessages = (agentOpeningMessage?: string): MessageInterface[] => {
	if (!agentOpeningMessage) return [];
	return [
		{
			kind: 'message' as Event['kind'],
			source: 'human_agent_on_behalf_of_ai_agent' as Event['source'],
			creationUtc: new Date(),
			id: '',
			deleted: false,
			offset: 0,
			correlationId: '',
			data: {message: agentOpeningMessage},
			status: 'ready',
		},
	];
};

const Chat = ({server, sessionId, agentId, agentName, agentAvatar, components, agentOpeningMessage, initialCustomerMessage, sendIcon, createSession, classNames, float, changeIsExpanded, chatDescription, messages, setMessages}: ChatProps & {changeIsExpanded?: () => void; createSession: (message: EventCreationParams) => void; messages: MessageInterface[]; setMessages: React.Dispatch<React.SetStateAction<MessageInterface[]>>}): JSX.Element => {
	const classes = useStyles();

	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [currentVisibleSection, setCurrentVisibleSection] = useState<{ title: string; data: SectionHeadingData } | null>(null);

	const {showInfo} = useSessionEvents({server, sessionId, messages, setMessages});

	const parlantClient = new ParlantClient({environment: server});

	const {data: sessionData} = useQuery<Session>({
		enabled: !!sessionId,
		queryKey: ['session', sessionId],
		queryFn: () => parlantClient.sessions.retrieve(sessionId || ''),
	});

	const agentIdToFetch = sessionData?.agentId || agentId;
	const {data: agentData} = useQuery<Partial<Agent> | null>({
		queryKey: ['agent', agentIdToFetch],
		queryFn: () => agentName ? {name: agentName} : agentIdToFetch ? fetch(`${server}/agents/${agentIdToFetch}`).then(res => res.json()) : null,
		enabled: !!agentIdToFetch,
	});

	const postMessage = async (content: string): Promise<void> => {
		if (!content.trim()) return;

		const message: EventCreationParams = {kind: 'message', message: content, source: 'customer'};

		if (sessionId) {
			await parlantClient.sessions.createEvent(sessionId, message);
		} else {
			createSession(message);
		}
	};

	const changeIsExpandedFn = (): void => {
		setIsExpanded(!isExpanded);
		changeIsExpanded?.();
	};

	const hasActiveStreaming = messages.some(isMessageStreaming);

	return (
		<div className={clsx(classes.chatbox, isExpanded && classes.expandedChatbox, classNames?.chatbox)}>
			{(!sessionId && !agentId) ?
			<div className='flex justify-center mt-[20px] h-full text-[20px] font-medium'>
				<h1>Either sessionId or agentId is required</h1>
			</div>
			:
			<>
			{components?.header ?
				<components.header changeIsExpanded={changeIsExpandedFn} agentName={agentData?.name || agentName} agentAvatar={agentAvatar} messages={messages} currentVisibleSection={currentVisibleSection} /> :
				<ChatHeader
					agentName={agentData?.name || agentName}
					agentAvatar={agentAvatar}
					changeIsExpanded={changeIsExpandedFn}
					isExpanded={isExpanded}
				/>}
				<MessageList
					messages={!messages?.length && agentOpeningMessage ? getInitialMessages(agentOpeningMessage) : messages}
					showInfo={showInfo}
					agentName={agentData?.name}
					agentAvatar={agentAvatar}
					components={components}
					classNames={classNames}
					isExpanded={isExpanded}
					chatDescription={chatDescription}
					onCurrentSectionChange={setCurrentVisibleSection}
					hasActiveStreaming={hasActiveStreaming}
				/>
			<ChatInput
				onSendMessage={postMessage}
				sendIcon={sendIcon}
				className={classNames?.textarea}
				float={float}
				focusTrigger={isExpanded}
			/>
			<ChatFooter
				showInfo={showInfo}
				className={classNames?.bottomLine}
			/>
			</>}
		</div>
	);
};

export default Chat;
