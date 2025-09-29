import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useEffect, useRef, useState} from 'react';
import type {JSX, ReactElement} from 'react';
import {ChevronDown, ChevronUp} from 'lucide-react';
import Chat from '@/components/chat/Chat';
import type {MessageInterface} from '@/components/chat/Chat';
import SectionAwareHeader from '@/components/chat/header/SectionAwareHeader';
import {Button} from '@/components/ui/Button';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/Popover';
import {createUseStyles} from 'react-jss';
import clsx from 'clsx';

import { COLORS } from '@/theme';
import { ParlantClient } from 'parlant-client';
import { EventCreationParams, SessionCreationParams } from 'parlant-client/src/api';
import { messageSound } from './utils/utils';

const useStyles = createUseStyles({
        root: {
                fontFamily: 'Inter',
                '& .fixed-scroll': {
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#ebecf0 transparent',
                },
        },
        popupButton: {
                background: COLORS.primaryText,
                border: 'none',
                outline: '0 !important',
                borderRadius: '50%',
                minWidth: 'fit-content',
                height: '50px',
                width: '50px',
                padding: '10px',
                margin: '10px',
        },
        iconComponent: {
                minWidth: '30px',
                minHeight: '30px',
                userSelect: 'none',
        },
        chatWrapper: {
                width: '27.75rem',
                boxShadow: '0px 8px 36px 0px #0000001A',
                transition: 'width 0.3s ease-in-out',
                background: '#FBFBFB',
                borderRadius: '20px',
                padding: '0',
        },
        expandedChatWrapper: {
                width: '920px',
                maxWidth: '95vw',
        }
});

interface MessageComponentProps {
        message: MessageInterface;
        className?: string;
}

interface PopupButtonComponentProps {
        toggleChatOpen: () => void;
}

export interface ChatProps {
        server: string;
        sessionId?: string;
        agentName?: string;
        agentAvatar?: JSX.Element;
        chatDescription?: string;
        float?: boolean;
        onPopupButtonClick?: () => void;
        agentOpeningMessage?: string;
        titleFn?: () => string;
        popupButton?: JSX.Element;
        sendIcon?: JSX.Element;
        agentId?: string;
        customerId?: string;
        mockMessages?: MessageInterface[];
        classNames?: {
                chatboxWrapper?: string;
                chatbox?: string;
                messagesArea?: string;
                agentMessage?: string;
                customerMessage?: string;
                textarea?: string;
                popupButton?: string;
                popupButtonIcon?: string;
                chatDescription?: string;
                bottomLine?: string;
        };
        components?: {
                popupButton?: (props: PopupButtonComponentProps) => ReactElement;
                agentMessage?: (props: MessageComponentProps) => ReactElement;
                customerMessage?: (props: MessageComponentProps) => ReactElement;
                header?: ({changeIsExpanded, agentName, messages}: {changeIsExpanded: () => void; agentName: string | undefined; messages?: MessageInterface[];}) => ReactElement;
        };
        onSessionCreated?: (sessionId: string) => void;
}

const queryClient = new QueryClient();

// Helper function to create a section-aware header component
export const createSectionAwareHeader = () => 
  ({ changeIsExpanded, agentName, messages }: {
    changeIsExpanded: () => void; 
    agentName: string | undefined; 
    messages?: MessageInterface[];
  }) => (
    <SectionAwareHeader 
      changeIsExpanded={changeIsExpanded}
      agentName={agentName}
      messages={messages || []}
    />
  );

const Chatbox = ({server, titleFn, agentId, customerId, sessionId, agentName, agentAvatar, onPopupButtonClick, agentOpeningMessage, chatDescription, float = false, popupButton, components, sendIcon, classNames, onSessionCreated, mockMessages}: ChatProps): JSX.Element => {
        const classes = useStyles();
        const [sessionIdToUse, setSessionIdToUse] = useState(sessionId);
        const popupButtonRef = useRef<HTMLButtonElement>(null);
        const [open, setOpen] = useState<boolean>(false);
        const [isClosing, setIsClosing] = useState<boolean>(false);
        const [isExpanded, setIsExpanded] = useState<boolean>(false);
        const [origin, setOrigin] = useState<string>('bottom right');
        const isOriginInBottom = origin.includes('bottom');
        const [messages, setMessages] = useState<MessageInterface[]>(mockMessages || []);
        const IconComponent = open ?  (isOriginInBottom ? ChevronUp : ChevronDown) : (isOriginInBottom ? ChevronDown : ChevronUp);

        const parlantClient = new ParlantClient({
                environment: server,
        });

        const setTransformOrigin = (): void => {
                if (!popupButtonRef.current) return;
                const rect = popupButtonRef.current.getBoundingClientRect();
                const vertical = rect.top < window.innerHeight / 2 ? 'top' : 'bottom';
                const horizontal = rect.left < window.innerWidth / 2 ? 'left' : 'right';
                setOrigin(`${vertical} ${horizontal}`);
        };

        useEffect(setTransformOrigin, []);
        

        const toggleChat = (): void => {
                        if (open) {
                                setIsClosing(true);
                                setTimeout(() => {
                                        setIsClosing(false);
                                        setOpen(false);
                                }, 0);
                        } else {
                                setOpen(true);
                        }
                        onPopupButtonClick?.();
        };

        const handleOnOpenChange = (open: boolean): void => {
                setOpen(open);
                setIsExpanded(false);
        };

        const createSession = async (message: EventCreationParams) => {
                // If using mock messages, just simulate adding a customer message
                if (mockMessages && mockMessages.length > 0) {
                        const newMessage: MessageInterface = {
                                kind: 'message',
                                source: 'customer',
                                creationUtc: new Date(),
                                id: `mock-msg-${Date.now()}`,
                                deleted: false,
                                offset: messages.length,
                                correlationId: `cust-${Date.now()}`,
                                data: { message: message.message || '' },
                                status: 'ready',
                        };
                        setMessages(prev => [...prev, newMessage]);
                        return;
                }
                
                if (!agentId) {
                        console.error('agentId is required when sessionId is not provided');
                        return;
                }
                const newSessionData: SessionCreationParams = {agentId, allowGreeting: false, title: titleFn?.() || `New Session - ${new Date().toISOString()}`};
                if (customerId) newSessionData.customerId = customerId;
                const newSession = await parlantClient.sessions.create(newSessionData);
                if (!newSession?.id) {
                        console.error('session was not created');
                        return;

                }
                if (agentOpeningMessage) {
                        await parlantClient.sessions.createEvent(newSession.id, {kind: 'message', message: agentOpeningMessage, source: 'human_agent_on_behalf_of_ai_agent'});
                }
                const event = await parlantClient.sessions.createEvent(newSession.id, message);
                if (event?.id) {
                        setSessionIdToUse(newSession.id);
                        onSessionCreated?.(newSession.id);
                }
                // messageSound();
        }

        const PopupButtonComponent = components?.popupButton && <components.popupButton toggleChatOpen={toggleChat} />;
        const sessionToUse = sessionId || sessionIdToUse;

        return (
                <QueryClientProvider client={queryClient}>
                        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
                        <span className={classes.root}>
                                {float ? (
                                        <Popover open={open || isClosing} onOpenChange={handleOnOpenChange}>
                                                <PopoverTrigger ref={popupButtonRef} asChild>
                                                        <div>
                                                                {PopupButtonComponent || (
                                                                        <Button onClick={() => toggleChat()} className={clsx(classes.popupButton, classNames?.popupButton)}>
                                                                                {popupButton || <IconComponent size={30} color="white" className={clsx(classes.iconComponent, classNames?.popupButtonIcon)} />}
                                                                        </Button>
                                                                )}
                                                        </div>
                                                </PopoverTrigger>
                                                <PopoverContent className={clsx(classes.chatWrapper, isExpanded && classes.expandedChatWrapper, classNames?.chatboxWrapper)} style={{transformOrigin: origin, margin: '0 10px'}} sideOffset={18}>
                                                        <Chat createSession={createSession} agentId={agentId} server={server} float={float} sessionId={sessionToUse} agentName={agentName} agentAvatar={agentAvatar} agentOpeningMessage={agentOpeningMessage} chatDescription={chatDescription} classNames={classNames} components={components} sendIcon={sendIcon} changeIsExpanded={() => setIsExpanded(!isExpanded)} messages={messages} setMessages={setMessages} />
                                                </PopoverContent>
                                        </Popover>
                                ) : (
                                        <div className={clsx(classes.chatWrapper, isExpanded && classes.expandedChatWrapper, classNames?.chatboxWrapper)}>
                                                <Chat createSession={createSession} agentId={agentId} server={server} sessionId={sessionToUse} agentName={agentName} agentAvatar={agentAvatar} agentOpeningMessage={agentOpeningMessage} chatDescription={chatDescription} classNames={classNames} components={components} sendIcon={sendIcon} changeIsExpanded={() => setIsExpanded(!isExpanded)} messages={messages} setMessages={setMessages} />
                                        </div>
                                )}
                        </span>
                </QueryClientProvider>
        );
};

export default Chatbox;
