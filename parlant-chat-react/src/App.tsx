import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Chat from './components/chat/chat';
import { ClassNameValue } from 'tailwind-merge';
import './App.css'
import './index.css'
import { JSX, useRef, useState } from 'react';
import { Button } from './components/ui/button';
import { MessageSquare, X } from 'lucide-react';
// import './parlant-chat-react.css'
// import ShadowRoot from './components/ui/shadow-wrapper';

export interface ChatProps {
  route: string;
  sessionId: string;
  asPopup?: boolean;
  classNames?: {
      chatbox?: ClassNameValue;
      messagesArea?: ClassNameValue;
      agentMessage?: ClassNameValue;
      customerMessage?: ClassNameValue;
      textarea?: ClassNameValue;
  }
}

const queryClient = new QueryClient();

export const Chatbot = ({route, sessionId, asPopup, classNames = {}}: ChatProps): JSX.Element => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const rect = buttonRef?.current?.getBoundingClientRect();
  const Icon = chatOpen ? X : MessageSquare;
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {asPopup ? (
          <>
            <Button ref={buttonRef} onClick={() => setChatOpen(val => !val)} className="bg-black rounded-full size-[50px] p-[10px] m-[10px]">
              {<Icon size={30} color='white' className='min-w-[30px] min-h-[30px]'/>}
            </Button>
            {chatOpen && <div className='fixed !-translate-[100%]' style={{top: `${(rect?.y || 0)}px`, left: `${rect?.x}px`}}><Chat route={route} sessionId={sessionId} classNames={classNames}/></div>}
          </>
        ) : <Chat route={route} sessionId={sessionId} classNames={classNames}/>}
      </QueryClientProvider>
    </>
  )
}