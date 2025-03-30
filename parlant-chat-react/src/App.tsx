import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClassNameValue } from 'tailwind-merge';
import { JSX, ReactElement, useEffect, useRef, useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import Chat, { MessageInterface } from './components/chat/chat';
import { Button } from './components/ui/button';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

import WebFont from 'webfontloader';

export const loadFonts = () => {
  WebFont.load({
    google: {
      families: ['Ubuntu Sans:400,700']
    }
  });
};

const useStyles = createUseStyles({
  root: {
    fontFamily: 'Ubuntu Sans',
    '& .fixed-scroll': {
      scrollbarWidth: 'thin',
	    scrollbarColor: '#ebecf0 transparent',
    }
  },
  popupButton: {
    backgroundColor: 'black',
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
  },
  chatWrapper: {
    position: 'fixed',
    transform: 'translateX(-100%) translateY(-100%)',
  }
});

interface MessageComponentProps {
  message: MessageInterface;
  className?: ClassNameValue;
}

interface PopupButtonComponentProps {
  toggleChatOpen: () => void;
}

export interface ChatProps {
  route: string;
  sessionId: string;
  asPopup?: boolean;
  popupButton?: JSX.Element;
  sendIcon?: JSX.Element;
  classNames?: {
    chatbox?: ClassNameValue;
    messagesArea?: ClassNameValue;
    agentMessage?: ClassNameValue;
    customerMessage?: ClassNameValue;
    textarea?: ClassNameValue;
    defaultPopupButton?: ClassNameValue;
    defaultPopupButtonIcon?: ClassNameValue;
  };
  components?: {
    popupButton?: (props: PopupButtonComponentProps) => ReactElement;
    agentMessage?: (props: MessageComponentProps) => ReactElement;
    customerMessage?: (props: MessageComponentProps) => ReactElement;
  };
}

const queryClient = new QueryClient();

export const Chatbot = ({
  route,
  sessionId,
  asPopup = false,
  popupButton,
  components,
  sendIcon,
  classNames,
}: ChatProps): JSX.Element => {
  const classes = useStyles();
  const buttonRef = useRef<HTMLDivElement>(null);
  
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  
  const buttonRect = buttonRef?.current?.getBoundingClientRect();
  
  const IconComponent = chatOpen ? X : MessageSquare;

  useEffect(() => {
    loadFonts();
  }, []);

  const toggleChat = (): void => {
    setChatOpen(prevState => !prevState);
  };

  const PopupButtonComponent = components?.popupButton && <components.popupButton toggleChatOpen={toggleChat} />;

  return (
    <QueryClientProvider client={queryClient}>
      <span className={classes.root}>
        {asPopup ? (
          <>
            <div ref={buttonRef}>
              {PopupButtonComponent || 
              <Button
                onClick={toggleChat} 
                className={clsx(
                  classes.popupButton,
                  classNames?.defaultPopupButton
                )}
              >
                {popupButton || (
                  <IconComponent 
                    size={30} 
                    color="white" 
                    className={clsx(
                      classes.iconComponent,
                      classNames?.defaultPopupButtonIcon
                    )}
                  />
                )}
              </Button>}
            </div>
            
            {chatOpen && (
              <div 
                className={classes.chatWrapper}
                style={{
                  top: `${buttonRect?.y || 0}px`, 
                  left: `${buttonRect?.x || 0}px`
                }}
              >
                <Chat 
                  route={route}
                  asPopup={asPopup}
                  sessionId={sessionId} 
                  classNames={classNames} 
                  components={components} 
                  sendIcon={sendIcon}
                />
              </div>
            )}
          </>
        ) : (
          <Chat 
            route={route} 
            sessionId={sessionId} 
            classNames={classNames} 
            components={components} 
            sendIcon={sendIcon}
          />
        )}
      </span>
    </QueryClientProvider>
  );
};

export default Chatbot;