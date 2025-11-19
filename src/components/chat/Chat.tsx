import {groupBy} from '@/utils/object';
import {useQuery} from '@tanstack/react-query';
import {ParlantClient} from 'parlant-client';
import type {Agent, Event, EventCreationParams, Session} from 'parlant-client/src/api';
import {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import React, {type JSX} from 'react';
import type {ChatProps} from '@/App';
import {createUseStyles} from 'react-jss';
import clsx from 'clsx';
import ChatHeader from '@/components/chat/header/ChatHeader';
import MessageList from '@/components/chat/message-list/MessageList';
import ChatInput from '@/components/chat/input/ChatInput';
import ChatFooter from '@/components/chat/footer/ChatFooter';
import { messageSound } from '@/utils/utils';

const useStyles = createUseStyles({
        chatbox: {
                background: 'white',
                height: 'min(48.75rem,70vh)',
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
                height: 'min(880px,80vh)',
                maxWidth: '95vw',
        }
});

export interface MessageInterface extends Event {
        status: string | null;
        error?: string;
}

export interface SectionHeadingData {
        title?: string;
        subtitle?: string;
        image_url?: string;
        theme?: string;
        icon?: string;
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

export const getInitialMessages = (agentOpeningMessage?: string): MessageInterface[] => {
        if (!agentOpeningMessage) return [];
        return [
                {
                        kind:'message',
                        source: 'human_agent_on_behalf_of_ai_agent',
                        creationUtc: new Date(),
                        id: '',
                        deleted: false,
                        offset: 0,
                        correlationId: '',
                        data: {
                                message: agentOpeningMessage,
                        },
                        status: 'ready',
                },
        ];
}

const Chat = ({server, sessionId, agentId, agentName, agentAvatar, components, agentOpeningMessage, sendIcon, createSession, classNames, float, changeIsExpanded, chatDescription, messages, setMessages}: ChatProps & {changeIsExpanded?: () => void; createSession: (message: EventCreationParams) => void; messages: MessageInterface[]; setMessages: React.Dispatch<React.SetStateAction<MessageInterface[]>>}): JSX.Element => {
        const classes = useStyles();

        const [isExpanded, setIsExpanded] = useState<boolean>(false);
        const [lastOffset, setLastOffset] = useState<number>(0);
        const [showInfo, setShowInfo] = useState<string>('');
        const [pendingMessage, setPendingMessage] = useState<Partial<Event>>(createEmptyPendingMessage());
        const [currentVisibleSection, setCurrentVisibleSection] = useState<{ title: string; data: SectionHeadingData } | null>(null);

        const parlantClient = new ParlantClient({
                environment: server,
        });

        const {data} = useQuery<Event[]>({
                enabled: !!sessionId,
                queryKey: ['events', lastOffset],
                queryFn: () => parlantClient.sessions.listEvents(sessionId || '', {waitForData: 60, minOffset: lastOffset}),
        });
        const {data: sessionData} = useQuery<Session>({
                enabled: !!sessionId,
                queryKey: ['session'],
                queryFn: () => parlantClient.sessions.retrieve(sessionId || ''),
        });

        const agentIdToFetch = sessionData?.agentId || agentId;
        const {data: agentData} = useQuery<Partial<Agent> | null>({
                queryKey: ['agent'],
                queryFn: () => agentName ? {name: agentName} : agentIdToFetch ? fetch(`${server}/agents/${agentIdToFetch}`).then(res => res.json()) : null,
                enabled: !!agentIdToFetch,
        });

        const correlationsMap = useMemo(
                () => groupBy(data || [], (item: Event) => item?.correlationId.split('::')[0]),
                [data]
        );
        const messageEvents = useMemo(
                () => data?.filter((e) => e.kind === 'message') || [],
                [data]
        );
        const withStatusMessages = useMemo(() => messageEvents.map((newMessage, i) => {
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

        const postMessage = async (content: string): Promise<void> => {
                if (!content.trim()) return;

                setPendingMessage((prev) => ({
                        ...prev,
                        sessionId,
                        data: {message: content},
                }));

                const message: EventCreationParams = {
                        kind: 'message',
                        message: content,
                        source: 'customer',
                };
                
                if (sessionId) {
                        await parlantClient.sessions.createEvent(sessionId, message);
                        // messageSound();
                } else createSession(message);
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

                        const newMessages = mergedMessages.filter((message): message is MessageInterface => !!message);
                        // if (currentMessages.length && newMessages.length > currentMessages.length && newMessages[newMessages.length - 1].source === 'ai_agent') {
                        //      messageSound(true);
                        // }
                        return newMessages;
                });

                const lastStatusEventStatus = (lastStatusEvent?.data as StatusEventData)?.status;
                setShowInfo(
                        !!messages.length && lastStatusEventStatus === 'processing'
                                ? `${(lastStatusEvent?.data as any)?.data?.stage || 'Thinking'}...`
                                : lastStatusEventStatus === 'typing'
                                ? 'Typing...'
                                : ''
                );
        }, [data, pendingMessage, withStatusMessages, correlationsMap]);

        useEffect(() => {
                formatMessagesFromEvents();
        }, [data, formatMessagesFromEvents]);

        const changeIsExpandedFn = (): void => {
                setIsExpanded(!isExpanded);
                changeIsExpanded?.();
        };

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
                                        messages={!messages?.length && agentOpeningMessage? getInitialMessages(agentOpeningMessage) : messages}
                                        showInfo={showInfo}
                                        agentName={agentData?.name}
                                        agentAvatar={agentAvatar}
                                        components={components}
                                        classNames={classNames}
                                        isExpanded={isExpanded}
                                        chatDescription={chatDescription}
                                        onCurrentSectionChange={setCurrentVisibleSection}
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
