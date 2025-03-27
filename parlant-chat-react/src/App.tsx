import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Chat, { MessageInterface } from './components/chat/chat';
import { ClassNameValue, twMerge } from 'tailwind-merge';
import './App.css'
import './index.css'
import { JSX, ReactElement, useRef, useState } from 'react';
import { Button } from './components/ui/button';
import { MessageSquare, X } from 'lucide-react';
// import './parlant-chat-react.css'
// import ShadowRoot from './components/ui/shadow-wrapper';

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
  },
  components?: {
      agentMessage?: (props: {message: MessageInterface}) => ReactElement;
      customerMessage?: (props: {message: MessageInterface}) => ReactElement;
  }
}

const queryClient = new QueryClient();

export const Chatbot = ({route, sessionId, asPopup, popupButton, components, sendIcon, classNames}: ChatProps): JSX.Element => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const rect = buttonRef?.current?.getBoundingClientRect();
  const Icon = chatOpen ? X : MessageSquare;
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {asPopup ? (
          <>
            <Button ref={buttonRef} onClick={() => setChatOpen(val => !val)} className={twMerge("bg-black !border-none !outline-0 rounded-full min-w-fit size-[50px] p-[10px] m-[10px]", classNames?.defaultPopupButton)}>
              {popupButton || <Icon size={30} color='white' className={twMerge('min-w-[30px] min-h-[30px]', classNames?.defaultPopupButtonIcon)}/>}
            </Button>
            {chatOpen && <div className='fixed !-translate-[100%]' style={{top: `${(rect?.y || 0)}px`, left: `${rect?.x}px`}}><Chat route={route} sessionId={sessionId} classNames={classNames} components={components} sendIcon={sendIcon}/></div>}
          </>
        ) : <Chat route={route} sessionId={sessionId} classNames={classNames} components={components} sendIcon={sendIcon}/>}
      </QueryClientProvider>
    </>
  )
}