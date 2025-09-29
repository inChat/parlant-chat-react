import { createUseStyles } from 'react-jss';
import type { JSX } from 'react';
import type { MessageInterface, SectionHeadingData } from '@/components/chat/Chat';
import Message from '@/components/chat/message/Message';
import SectionHeading from './SectionHeading';
import clsx from 'clsx';
import { useEffect, useRef, useState, useCallback } from 'react';
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
  onCurrentSectionChange?: (section: { title: string; data: SectionHeadingData } | null) => void;
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
    fontSize: '11px',
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

// Helper function to check if a message is a section heading
const isSectionHeading = (message: MessageInterface): boolean => {
  return !!(message.data as any)?.section_heading;
};

// Helper function to get section heading data
const getSectionHeadingData = (message: MessageInterface): SectionHeadingData | undefined => {
  return (message.data as any)?.section_heading;
};

const MessageList = ({
  messages,
  showInfo,
  agentName,
  agentAvatar,
  components,
  isExpanded,
  classNames,
  chatDescription,
  onCurrentSectionChange,
}: MessageListProps): JSX.Element => {
  const classes = useStyles();
  const messageListRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [currentVisibleSection, setCurrentVisibleSection] = useState<{ title: string; data: SectionHeadingData } | null>(null);

  // Function to determine which section is currently visible
  const getCurrentVisibleSection = useCallback(() => {
    if (!messageListRef.current) return null;

    const container = messageListRef.current;
    const containerRect = container.getBoundingClientRect();
    const containerTop = container.scrollTop;

    // Get all section headings in order
    const sectionMessages = messages.filter(isSectionHeading);
    let visibleSection = null;

    // Check which section is currently visible in the viewport
    // We want to find the section that is currently "active" based on scroll position
    for (let i = sectionMessages.length - 1; i >= 0; i--) {
      const sectionMessage = sectionMessages[i];
      const sectionKey = sectionMessage.id || `section-${i}`;
      const sectionElement = sectionRefs.current.get(sectionKey);
      
      if (sectionElement) {
        // Use getBoundingClientRect for more accurate position calculation
        const sectionRect = sectionElement.getBoundingClientRect();
        const sectionTop = sectionRect.top - containerRect.top + containerTop;
        
        // If this section is above or at the current scroll position, it's the active one
        if (sectionTop <= containerTop + 100) { // 100px offset for better UX
          const messageText = (sectionMessage.data as any)?.message || '';
          const sectionData = getSectionHeadingData(sectionMessage);
          
          if (sectionData) {
            visibleSection = {
              key: sectionKey,
              title: messageText,
              data: sectionData
            };
          }
          break;
        }
      }
    }

    return visibleSection;
  }, [messages]);

  // Handle scroll events with throttling using requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (!messageListRef.current) return;
    
    requestAnimationFrame(() => {
      const newVisibleSection = getCurrentVisibleSection();
      
      // Compare by unique key instead of just title for better change detection
      const currentKey = (currentVisibleSection as any)?.key;
      const newKey = (newVisibleSection as any)?.key;
      
      if (newKey !== currentKey) {
        setCurrentVisibleSection(newVisibleSection);
        onCurrentSectionChange?.(newVisibleSection);
      }
    });
  }, [getCurrentVisibleSection, currentVisibleSection, onCurrentSectionChange]);

  // Add scroll event listener with passive option for better performance
  useEffect(() => {
    const container = messageListRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check after a brief delay to ensure refs are set
    setTimeout(handleScroll, 50);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    // const top = messageListRef?.current?.scrollHeight;
    setTimeout(() => {
      messageListRef?.current?.scrollTo({top: messageListRef?.current?.scrollHeight})
    }, 0);
    setTimeout(() => {
      messageListRef?.current?.scrollTo({top: messageListRef?.current?.scrollHeight})
    }, 500);
    // setTimeout(() => messageListRef?.current?.scrollTo({top}), 500);
  }, [agentName])

  useEffect(() => {
    setTimeout(() => {
      messageListRef?.current?.scrollTo({top: messageListRef.current.scrollHeight, behavior: !messageListRef.current.scrollTop ? 'auto' : 'smooth'});
    }, 100);
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
          // Check if this is a section heading
          if (isSectionHeading(message)) {
            const messageText = (message.data as any)?.message || '';
            const sectionData = getSectionHeadingData(message);
            
            const sectionKey = message.id || `section-${index}`;
            
            return (
              <div 
                key={sectionKey} 
                style={{ padding: '0 16px' }}
                ref={(el) => {
                  if (el) {
                    sectionRefs.current.set(sectionKey, el);
                  }
                }}
              >
                <SectionHeading 
                  title={messageText}
                  data={sectionData}
                />
              </div>
            );
          }
          
          // Regular message rendering
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
