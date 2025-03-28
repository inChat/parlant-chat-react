import { groupBy } from "@/utils/object";
import { useQuery } from "@tanstack/react-query";
import { ParlantClient } from "parlant-client";
import { Event } from "parlant-client/src/api";
import { JSX, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Message from "./message/message";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ChatProps } from "@/App";

/**
 * Message interface extending Event with status information
 */
export interface MessageInterface extends Event {
  status: string | null;
  error?: string;
}

/**
 * Status event data interface
 */
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
  // State management
  const [messages, setMessages] = useState<MessageInterface[]>([]);
  const [lastOffset, setLastOffset] = useState<number>(0);
  const [showInfo, setShowInfo] = useState<string>('');
  const [pendingMessage, setPendingMessage] = useState<Partial<Event>>(createEmptyPendingMessage());
  const [message, setMessage] = useState<string>('');
  
  // Refs
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Initialize Parlant client
  const parlantClient = new ParlantClient({
    environment: route,
  });

  // Fetch events query
  const { data } = useQuery<Event[]>({
    queryKey: ['events', lastOffset],
    queryFn: () => parlantClient.sessions.listEvents(
      sessionId, 
      { waitForData: 60, minOffset: lastOffset }
    ),
  });

  /**
   * Handles textarea key events to submit on Enter
   * @param e - Keyboard event
   */
  const handleTextareaKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitButtonRef?.current?.click();
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
    }
  };

  /**
   * Posts a new message to the session
   * @param content - Message content
   */
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
  
  /**
   * Formats and processes events into messages
   */
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
    <div className={twMerge(
      "bg-[#1e1e2e] h-[min(600px,70vh)] rounded-[10px] p-[10px] flex flex-col w-[500px]", 
      classNames?.chatbox
    )}>
      <div className={twMerge("flex-1 overflow-auto fixed-scroll", classNames?.messagesArea)}>
        {messages.map((message) => {
          const Component = (message?.source === 'customer' 
            ? components?.customerMessage 
            : components?.agentMessage) || Message;
            
          return (
            <div key={message.id}>
              <Component 
                message={message} 
                className={message?.source === 'customer' 
                  ? classNames?.customerMessage 
                  : classNames?.agentMessage
                }
              />
            </div>
          );
        })}
        <div ref={lastMessageRef} />
      </div>
      
      <div className={twMerge(
        'group w-[80%] m-auto flex-[none] relative border border-muted border-solid rounded-[16px] ' +
        'flex flex-row justify-center items-center bg-white leading-[3rem] ps-[14px] mt-[1rem] ' +
        'pe-0 h-[48.67px] max-w-[1000px] mb-[20px]', 
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
          className={twMerge(
            'box-shadow-none placeholder:text-[#282828] text-black resize-none border-none ' +
            'h-full rounded-none min-h-[unset] p-0 whitespace-nowrap no-scrollbar font-inter ' +
            'font-light text-[16px] leading-[47px] bg-white', 
            classNames?.textarea
          )}
        />
        
        <p className={twMerge(
          'absolute invisible left-[0.25em] -bottom-[40px] font-normal text-[#A9AFB7] ' +
          'text-[14px] font-inter', 
          showInfo && 'visible'
        )}>
          {showInfo}
        </p>
        
        <Button 
          variant='ghost' 
          data-testid='submit-button' 
          className='max-w-[60px] bg-none rounded-full hover:bg-white !border-0 hover:!border-0' 
          ref={submitButtonRef} 
          disabled={!message?.trim()} 
          onClick={() => postMessage(message)}
        >
          {sendIcon || 
            <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M0.533203 0.333373L22.5332 10.3334L0.533202 20.3334L2.40554 12.3334L9.42682 10.3334L2.40554 8.33337L0.533203 0.333373Z" 
                fill="#282828"
              />
            </svg>
          }
        </Button>
      </div>
    </div>
  );
};

export default Chat;