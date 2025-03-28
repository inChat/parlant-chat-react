import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClassNameValue, twMerge } from 'tailwind-merge';
import { JSX, ReactElement, useRef, useState } from 'react';
import { Component, MessageSquare, X } from 'lucide-react';
import Chat, { MessageInterface } from './components/chat/chat';
import { Button } from './components/ui/button';
import './App.css';
import './index.css';

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
  const buttonRef = useRef<HTMLDivElement>(null);
  
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  
  const buttonRect = buttonRef?.current?.getBoundingClientRect();
  
  const IconComponent = chatOpen ? X : MessageSquare;

  const toggleChat = (): void => {
    setChatOpen(prevState => !prevState);
  };

  const PopupButtonComponent = components?.popupButton && <components.popupButton toggleChatOpen={toggleChat} />;

  return (
    <QueryClientProvider client={queryClient}>
      {asPopup ? (
        <>
          <div ref={buttonRef}>
            {PopupButtonComponent || 
            <Button
              onClick={toggleChat} 
              className={twMerge(
                "bg-black !border-none !outline-0 rounded-full min-w-fit size-[50px] p-[10px] m-[10px]", 
                classNames?.defaultPopupButton
              )}
            >
              {popupButton || (
                <IconComponent 
                  size={30} 
                  color="white" 
                  className={twMerge(
                    'min-w-[30px] min-h-[30px]', 
                    classNames?.defaultPopupButtonIcon
                  )}
                />
              )}
            </Button>}
          </div>
          
          {chatOpen && (
            <div 
              className="fixed !-translate-[100%]" 
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
    </QueryClientProvider>
  );
};

export default Chatbot;