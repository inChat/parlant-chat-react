import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Chat from './components/chat/chat';
import { ClassNameValue } from 'tailwind-merge';
import './App.css'
import './index.css'
import { JSX, ReactNode } from 'react';
// import './parlant-chat-react.css'
// import ShadowRoot from './components/ui/shadow-wrapper';

export interface ChatProps {
  route: string;
  sessionId: string;
  classNames?: {
      chatbox?: ClassNameValue;
      messagesArea?: ClassNameValue;
      agentMessage?: ClassNameValue;
      customerMessage?: ClassNameValue;
      textarea?: ClassNameValue;
  }
}

const queryClient = new QueryClient();

export const Chatbot = ({route, sessionId, classNames = {}}: ChatProps): JSX.Element => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* <ShadowRoot> */}
          {/* <Chat route={'http://localhost:8800'} sessionId={'l-Zo2YFSqi'}/> */}
          <Chat route={route} sessionId={sessionId} classNames={classNames}/>
        {/* </ShadowRoot> */}
      </QueryClientProvider>
    </>
  )
}