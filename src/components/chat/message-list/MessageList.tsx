import { createUseStyles } from 'react-jss';
import type { JSX } from 'react';
import type { MessageInterface } from '@/components/chat/Chat';
import Message from '@/components/chat/message/Message';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { COLORS } from '@/theme';

interface MessageListProps {
  messages: MessageInterface[];
  showInfo?: string;
  agentName?: string;
  agentAvatar?: JSX.Element;
  components?: {
    customerMessage?: typeof Message;
    agentMessage?: typeof Message;
  };
  classNames?: {
    messagesArea?: string;
    customerMessage?: string;
    agentMessage?: string;
    chatDescription?: string;
  };
  chatDescription?: string;
  isExpanded?: boolean;
  hasActiveStreaming?: boolean;
}

const useStyles = createUseStyles({
  messagesArea: {
    flex: 1,
    overflow: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: 'gray transparent',
    scrollbarGutter: 'stable',
    marginTop: '10px',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: COLORS.accent,
      borderRadius: '3px',
    },
  },
  messageAreaExpanded: {
    marginInline: '20px'
  },
  chatDescription: {
    width: '340px',
    marginTop: '20px',
    marginBottom: '30px',
    margin: 'auto',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '400',
    color: COLORS.mutedText,
    lineHeight: '22px',
  },
  bubblesWrapper: {
    height: 'fit-content',
    width: 'fit-content',
    backgroundColor: COLORS.backgroundLight,
    padding: '10px',
    margin: '10px',
    marginInlineStart: '20px',
    marginInlineEnd: '0px',
    borderRadius: '15px',
  },
  bubbles: {
    height: '15px',
    width: '31px',
    aspectRatio: '2.5',
    '--_g': `no-repeat radial-gradient(farthest-side, ${COLORS.darkGrey} 90%,#0000)`,
    background: 'var(--_g), var(--_g), var(--_g)',
    backgroundSize: '25% 50%',
    animation: '$l43 1s infinite linear',
  },
  statusInfoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '-25px'
  },
  infoText: {
    fontSize: '13px',
    color: COLORS.mutedText,
  },
  '@keyframes l43': {
    '0%': {
      backgroundPosition: 'calc(0*100%/2) 50%, calc(1*100%/2) 50%, calc(2*100%/2) 50%',
    },
    '20%': {
      backgroundPosition: 'calc(0*100%/2) 0, calc(1*100%/2) 50%, calc(2*100%/2) 50%',
    },
    '40%': {
      backgroundPosition: 'calc(0*100%/2) 100%, calc(1*100%/2) 0, calc(2*100%/2) 50%',
    },
    '60%': {
      backgroundPosition: 'calc(0*100%/2) 50%, calc(1*100%/2) 100%, calc(2*100%/2) 0',
    },
    '80%': {
      backgroundPosition: 'calc(0*100%/2) 50%, calc(1*100%/2) 50%, calc(2*100%/2) 100%',
    },
    '100%': {
      backgroundPosition: 'calc(0*100%/2) 50%, calc(1*100%/2) 50%, calc(2*100%/2) 50%',
    },
  },
});

const defaultChatDescription = 'I’m an AI-powered agent here to help you with your questions. Let me know if I can help!';

const MessageList = ({
  messages,
  showInfo,
  agentName,
  agentAvatar,
  components,
  isExpanded,
  classNames,
  chatDescription,
  hasActiveStreaming,
}: MessageListProps): JSX.Element => {
  const classes = useStyles();
  const messageListRef = useRef<HTMLDivElement>(null);
  const listContentRef = useRef<HTMLDivElement>(null);

  // Scroll with content growth (e.g. typing animation revealing text) when user is near bottom
  useEffect(() => {
    const container = messageListRef.current;
    const listContent = listContentRef.current;
    if (!container || !listContent) return;

    const resizeObserver = new ResizeObserver(() => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop - clientHeight < 100) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'auto' });
      }
    });
    resizeObserver.observe(listContent);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      messageListRef?.current?.scrollTo({top: messageListRef?.current?.scrollHeight})
    }, 0);
    setTimeout(() => {
      messageListRef?.current?.scrollTo({top: messageListRef?.current?.scrollHeight})
    }, 500);
  }, [agentName])

  useEffect(() => {
    setTimeout(() => {
      messageListRef?.current?.scrollTo({top: messageListRef?.current?.scrollHeight, behavior: !messageListRef?.current?.scrollTop ? 'auto' : 'smooth'});
    }, 100);
  }, [messages?.length, showInfo]);

  // Auto-scroll when the last message content grows (message or chunks), including when streaming ends (final null chunk)
  const lastMessageContentKey = (() => {
    const last = messages.at(-1);
    if (!last?.data) return '';
    const d = last.data as { message?: string; chunks?: (string | null)[] };
    if (d.message !== undefined) return `msg-${d.message.length}`;
    if (d.chunks?.length) {
      const textLen = d.chunks.filter((c): c is string => c !== null).join('').length;
      return `chunks-${d.chunks.length}-${textLen}`;
    }
    return '';
  })();
  useEffect(() => {
    const container = messageListRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop - clientHeight >= 100) return;
    // Defer until after layout so scrollHeight includes the latest chunk content
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        container.scrollTo({ top: container.scrollHeight, behavior: 'auto' });
      });
    });
    return () => cancelAnimationFrame(rafId);
  }, [lastMessageContentKey, hasActiveStreaming]);

  return (
    <div 
      className={clsx('fixed-scroll', classes.messagesArea, isExpanded && classes.messageAreaExpanded, classNames?.messagesArea)}
      role="log"
      ref={messageListRef}
      aria-live="polite"
      aria-label="Chat messages"
      aria-relevant="additions"
    >
      <div className={clsx(classes.chatDescription, classNames?.chatDescription)}>
        {chatDescription || defaultChatDescription}
      </div>
      <div ref={listContentRef} role="list">
        {messages.map((message, index) => {
          const Component = (message?.source === 'customer' ? components?.customerMessage : components?.agentMessage) || Message;

          return (
            <div key={message.id || index}>
              <Component
                isSameSourceAsPrevious={message?.source === messages[index - 1]?.source}
                isNextSourceSame={message?.source === messages[index + 1]?.source}
                agentAvatar={agentAvatar}
                agentName={agentName}
                message={message}
                className={message?.source === 'customer' ? classNames?.customerMessage : classNames?.agentMessage}
              />
            </div>
          );
        })}
      </div>
      {showInfo && (
        <div className={classes.statusInfoWrapper}>
          <div 
            className={classes.bubblesWrapper} 
            aria-hidden="true"
          >
            <div className={classes.bubbles} />
          </div>
          <span className={classes.infoText} aria-live="polite">{showInfo}</span>
        </div>
      )}
    </div>
  );
};

export default MessageList; 
