import { groupBy } from "@/utils/object";
import { useQuery } from "@tanstack/react-query";
import { ParlantClient } from "parlant-client";
import { Event } from "parlant-client/src/api";
import { JSX, useEffect, useRef, useState } from "react";
import Message from "./message/message";
import { Textarea } from "../ui/textarea";
import { ChatProps } from "@/App";
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

const useStyles = createUseStyles({
  chatbox: {
    background: '#1e1e2e',
    height: 'min(600px,70vh)',
    borderRadius: '10px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    width: '500px',
  },
  messagesArea: {
    flex: 1,
    overflow: 'auto',
  },
  textareaWrapper: {
    width: '80%',
    margin: 'auto',
    flex: 'none',
    position: 'relative',
    border: '1px solid lightgray',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    lineHeight: '3rem',
    paddingLeft: '0.85rem',
    marginTop: '1rem',
    paddingRight: '0',
    height: '3rem',
    maxWidth: '1000px',
    marginBottom: '1.25rem',
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
    left: '0.25em',
    bottom: '-54px',
    fontSize: '14px',
    fontWeight: '300',
    color: '#A9AFB7',
  },
  statusVisible: {
    visibility: 'visible',
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
      border: 'none !important'
    }
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

/**
 * Creates an empty pending message with default values
 * @returns A partial Event object
 */
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

/**
 * Chat component responsible for handling message interactions
 */
const Chat = ({
  route,
  sessionId,
  components,
  sendIcon,
  classNames,
  asPopup
}: ChatProps): JSX.Element => {
  const classes = useStyles();

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

  const { data } = useQuery<Event[]>({
    queryKey: ['events', lastOffset],
    queryFn: () => parlantClient.sessions.listEvents(
      sessionId, 
      { waitForData: 60, minOffset: lastOffset }
    ),
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
      data: { message: content }
    }));
    
    setMessage('');
    
    await parlantClient.sessions.createEvent(
      sessionId, 
      {
        kind: 'message', 
        message: content, 
        source: 'customer'
      }
    );
  };
  
  const formatMessagesFromEvents = (): void => {
    const lastEvent = data?.at(-1);
    const lastStatusEvent = data?.findLast((e) => e.kind === 'status');
    
    if (!lastEvent) return;

    const offset = lastEvent?.offset;
    if (offset !== undefined) setLastOffset(offset + 1);

    const correlationsMap = groupBy(
      data || [], 
      (item: Event) => item?.correlationId.split('::')[0]
    );

    const newMessages = data?.filter((e) => e.kind === 'message') || [];
    const withStatusMessages = newMessages.map((newMessage, i) => {
      const messageData: MessageInterface = { ...newMessage, status: '' };
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
      
      if ((pendingMessage?.data as { message?: string })?.message) {
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
      (!!messages?.length && lastStatusEventStatus === 'processing') 
        ? 'Thinking...' 
        : lastStatusEventStatus === 'typing' 
          ? 'Typing...' 
          : ''
    );
  };

  useEffect(() => {
    if (asPopup) textareaRef?.current?.focus()
    }, []);

  useEffect(() => {
    formatMessagesFromEvents();
  }, [data?.length]);

  useEffect(() => {
    setTimeout(() => lastMessageRef?.current?.scrollIntoView({ block: 'nearest' }), 0);
  }, [messages?.length]);

  return (
    <div className={clsx(
      classes.chatbox, 
      classNames?.chatbox
    )}>
      <div className={clsx('fixed-scroll', classes.messagesArea, classNames?.messagesArea)}>
        {messages.map((message) => {
          const Component = (message?.source === 'customer' 
            ? components?.customerMessage 
            : components?.agentMessage) || Message;
            
          return (
              <Component 
                key={message.id}
                message={message} 
                className={message?.source === 'customer' 
                  ? classNames?.customerMessage 
                  : classNames?.agentMessage
                }
              />
          );
        })}
        <div ref={lastMessageRef} />
      </div>
      
      <div className={clsx(
        classes.textareaWrapper,
        classNames?.textarea
      )}>
        <Textarea
          role='textbox'
          ref={textareaRef}
          placeholder='Message...'
          value={message}
          onKeyDown={handleTextareaKeydown}
          onChange={(e) => setMessage(e.target.value)}
          rows={1}
          className={clsx(classes.textArea, classNames?.textarea)}
        />
        
        <p className={clsx(
          classes.status,
          showInfo && classes.statusVisible,
        )}>
          {showInfo}
        </p>
        
        <div 
          role="button"
          style={{pointerEvents: message?.trim() ? 'all' : 'none', cursor: message?.trim() ? 'pointer' : 'default', opacity: !message?.trim() ? 0.5 : 1}}
          className={classes.sendButton}
          ref={submitButtonRef} 
          tabIndex={!message?.trim() ? -1 : 0}
          onClick={() => !!message?.trim() && postMessage(message)}
        >
          {sendIcon || 
            <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M0.533203 0.333373L22.5332 10.3334L0.533202 20.3334L2.40554 12.3334L9.42682 10.3334L2.40554 8.33337L0.533203 0.333373Z" 
                fill="#282828"
              />
            </svg>
          }
        </div>
      </div>
    </div>
  );
};

export default Chat;