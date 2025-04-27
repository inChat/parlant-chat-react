import { createUseStyles } from 'react-jss';
import type { JSX } from 'react';
import type { MessageInterface } from '../Chat';
import Message from '../message/Message';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { COLORS } from '../../../theme';

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
  classNames,
  chatDescription,
}: MessageListProps): JSX.Element => {
  const classes = useStyles();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showInfo !== 'Typing...') {
      lastMessageRef?.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [messages?.length, showInfo]);

  return (
    <div 
      className={clsx('fixed-scroll', classes.messagesArea, classNames?.messagesArea)}
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      <div className={clsx(classes.chatDescription, classNames?.chatDescription)}>
        {chatDescription || defaultChatDescription}
      </div>
      {messages.map((message) => {
        const Component = (message?.source === 'customer' ? components?.customerMessage : components?.agentMessage) || Message;

        return (
          <Component
            agentAvatar={agentAvatar}
            agentName={agentName}
            key={message.id}
            message={message}
            className={message?.source === 'customer' ? classNames?.customerMessage : classNames?.agentMessage}
          />
        );
      })}
      {showInfo && (
        <div className={classes.bubblesWrapper} aria-hidden="true">
          <div className={classes.bubbles} />
        </div>
      )}
      <div ref={lastMessageRef} />
    </div>
  );
};

export default MessageList; 