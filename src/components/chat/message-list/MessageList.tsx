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
}

const useStyles = createUseStyles({
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
      background: COLORS.accent,
      borderRadius: '3px',
    },
  },
  messageAreagExpanded: {
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
    marginInline: '20px',
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

const defaultChatDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquet et magna nec imperdiet.';

const MessageList = ({
  messages,
  showInfo,
  agentName,
  agentAvatar,
  components,
  isExpanded,
  classNames,
  chatDescription,
}: MessageListProps): JSX.Element => {
  const classes = useStyles();
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (agentName) messageListRef?.current?.scrollTo({top: messageListRef.current.scrollHeight});
  }, [agentName])

  useEffect(() => {
    if (showInfo !== 'Typing...') {
      messageListRef?.current?.scrollTo({top: messageListRef.current.scrollHeight, behavior: !messageListRef.current.scrollTop ? 'auto' : 'smooth'});
    }
  }, [messages?.length, showInfo]);

  return (
    <div 
      className={clsx('fixed-scroll', classes.messagesArea, isExpanded && classes.messageAreagExpanded, classNames?.messagesArea)}
      role="log"
      ref={messageListRef}
      aria-live="polite"
      aria-label="Chat messages"
      aria-relevant="additions"
    >
      <div className={clsx(classes.chatDescription, classNames?.chatDescription)}>
        {chatDescription || defaultChatDescription}
      </div>
      <div role="list">
        {messages.map((message, index) => {
          const Component = (message?.source === 'customer' ? components?.customerMessage : components?.agentMessage) || Message;

          return (
            <div key={message.id || index}>
              <Component
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
        <div 
          className={classes.bubblesWrapper} 
          aria-hidden="true"
        >
          <div className={classes.bubbles} />
          <span style={{position: 'absolute', left: '-9999px'}} aria-live="polite">{showInfo}</span>
        </div>
      )}
    </div>
  );
};

export default MessageList; 