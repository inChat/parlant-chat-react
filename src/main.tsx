import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Chatbox from './App';
import type { MessageInterface } from './components/chat/Chat';
import './index.css';

// Mock conversation data for development testing
const createMockConversation = (): MessageInterface[] => {
  const baseTime = new Date();
  const messages: MessageInterface[] = [
    {
      kind: 'message',
      source: 'human_agent_on_behalf_of_ai_agent',
      creationUtc: new Date(baseTime.getTime() - 300000), // 5 minutes ago
      id: 'msg-1',
      deleted: false,
      offset: 0,
      correlationId: 'init-1',
      data: { message: 'Hello! I\'m Sarah, your customer support agent. How can I help you today?' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 290000),
      id: 'msg-2',
      deleted: false,
      offset: 1,
      correlationId: 'cust-1',
      data: { message: 'Hi! I\'m having trouble with my recent order. It was supposed to arrive yesterday but I haven\'t received it yet.' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 280000),
      id: 'msg-3',
      deleted: false,
      offset: 2,
      correlationId: 'agent-1',
      data: { message: 'I\'m sorry to hear about the delay with your order. Let me help you track that down. Could you please provide me with your order number?' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 270000),
      id: 'msg-4',
      deleted: false,
      offset: 3,
      correlationId: 'cust-2',
      data: { message: 'Sure, it\'s #ORD-2024-789456' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 260000),
      id: 'msg-5',
      deleted: false,
      offset: 4,
      correlationId: 'agent-2',
      data: { message: 'Thank you! Let me look that up for you right away. I can see your order for the wireless headphones was shipped on Monday via standard delivery. According to our tracking system, there appears to have been a delay at the sorting facility due to high volume.' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 250000),
      id: 'msg-6',
      deleted: false,
      offset: 5,
      correlationId: 'cust-3',
      data: { message: 'Oh no, that\'s frustrating. Do you know when I can expect to receive it?' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 240000),
      id: 'msg-7',
      deleted: false,
      offset: 6,
      correlationId: 'agent-3',
      data: { message: 'I completely understand your frustration. The good news is that your package is now back on track and should arrive by tomorrow afternoon. I\'ve also applied a 15% discount to your account as an apology for the inconvenience. You\'ll see this credit reflected in your next purchase.' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 230000),
      id: 'msg-8',
      deleted: false,
      offset: 7,
      correlationId: 'cust-4',
      data: { message: 'That\'s very thoughtful, thank you! I appreciate the discount. Will I get a tracking notification when it\'s out for delivery?' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 220000),
      id: 'msg-9',
      deleted: false,
      offset: 8,
      correlationId: 'agent-4',
      data: { message: 'Absolutely! You\'ll receive both an email and SMS notification when your package is out for delivery. Plus, I\'ve set up a premium tracking alert so you\'ll get real-time updates throughout the day.' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 210000),
      id: 'msg-10',
      deleted: false,
      offset: 9,
      correlationId: 'cust-5',
      data: { message: 'Perfect! One more question - if the headphones don\'t fit well, what\'s your return policy?' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 200000),
      id: 'msg-11',
      deleted: false,
      offset: 10,
      correlationId: 'agent-5',
      data: { message: 'Great question! We offer a 30-day return policy with free return shipping. If they don\'t fit perfectly or you\'re not completely satisfied, just initiate a return through your account dashboard or contact us directly. We want you to love your purchase!' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 190000),
      id: 'msg-12',
      deleted: false,
      offset: 11,
      correlationId: 'cust-6',
      data: { message: 'Excellent! That gives me peace of mind. I think that covers all my questions.' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 180000),
      id: 'msg-13',
      deleted: false,
      offset: 12,
      correlationId: 'agent-6',
      data: { message: 'Wonderful! I\'m so glad I could help resolve this for you. Just to recap: your headphones will arrive tomorrow afternoon, you\'ll get delivery notifications, there\'s a 15% credit on your account, and you have 30 days to return if needed. Is there anything else I can assist you with today?' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 170000),
      id: 'msg-14',
      deleted: false,
      offset: 13,
      correlationId: 'cust-7',
      data: { message: 'Actually, yes! I was thinking about ordering a phone case to go with my phone. Do you have any recommendations for iPhone 15 Pro?' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 160000),
      id: 'msg-15',
      deleted: false,
      offset: 14,
      correlationId: 'agent-7',
      data: { message: 'Absolutely! For the iPhone 15 Pro, I\'d highly recommend our TechGuard Pro series. It offers military-grade drop protection, wireless charging compatibility, and comes in several stylish colors. We also have a more budget-friendly option called FlexiCase that still provides excellent protection. Would you like me to show you both options?' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 150000),
      id: 'msg-16',
      deleted: false,
      offset: 15,
      correlationId: 'cust-8',
      data: { message: 'The TechGuard Pro sounds interesting! What colors are available and what\'s the price?' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 140000),
      id: 'msg-17',
      deleted: false,
      offset: 16,
      correlationId: 'agent-8',
      data: { message: 'The TechGuard Pro is $49.99 and comes in Midnight Black, Ocean Blue, Forest Green, and Rose Gold. It features a raised camera bump protection, precision cutouts for all buttons and ports, and a lifetime warranty against manufacturer defects. Plus, with your existing 15% discount, it would be just $42.49!' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 130000),
      id: 'msg-18',
      deleted: false,
      offset: 17,
      correlationId: 'cust-9',
      data: { message: 'Ocean Blue sounds perfect! Can I add that to my account for my next order?' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 120000),
      id: 'msg-19',
      deleted: false,
      offset: 18,
      correlationId: 'agent-9',
      data: { message: 'Absolutely! I\'ve added the TechGuard Pro in Ocean Blue to your wishlist and applied the 15% discount. You can complete the purchase anytime from your account dashboard. The case would ship within 1-2 business days with free standard shipping, or next-day delivery for $4.99.' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 110000),
      id: 'msg-20',
      deleted: false,
      offset: 19,
      correlationId: 'cust-10',
      data: { message: 'Perfect! Thank you so much for all your help today. You\'ve been incredibly helpful and patient.' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 100000),
      id: 'msg-21',
      deleted: false,
      offset: 20,
      correlationId: 'agent-10',
      data: { message: 'It was my absolute pleasure helping you today! I\'m so glad we could get everything sorted out. Enjoy your new headphones when they arrive tomorrow, and don\'t hesitate to reach out if you have any questions about them or anything else. Have a wonderful day! 😊' },
      status: 'ready',
    },
  ];
  
  return messages;
};

// Mock Chat Component that uses predefined messages
const MockChatbox = ({ float = false }: { float?: boolean }) => {
  const mockMessages = createMockConversation();
  
  return (
    <Chatbox 
      server="mock://demo" 
      agentName="Sarah (Support Agent)"
      chatDescription="Customer Support Chat"
      float={float}
      mockMessages={mockMessages}
      // Use a mock sessionId to prevent real server calls
      sessionId="mock-session-12345"
    />
  );
};

// Development demo of the Parlant Chat React component
function App() {
  const [useMockData, setUseMockData] = useState(true);
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1>Parlant Chat React - Development Demo</h1>
      <p>This is a development environment for the Parlant Chat React component.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={useMockData} 
            onChange={(e) => setUseMockData(e.target.checked)}
          />
          Use mock conversation data (for UI testing)
        </label>
      </div>
      
      <div style={{ marginTop: '40px' }}>
        <h2>Embedded Chat (non-floating)</h2>
        <div style={{ maxWidth: '500px', margin: '20px 0' }}>
          {useMockData ? (
            <MockChatbox />
          ) : (
            <Chatbox 
              server="https://demo.parlant.io" 
              agentId="demo-agent"
              agentName="Demo Agent"
              chatDescription="Chat with our demo agent"
            />
          )}
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Floating Chat Button</h2>
        <p>Look for the floating chat button in the bottom right corner.</p>
        {useMockData ? (
          <MockChatbox float />
        ) : (
          <Chatbox 
            float
            server="https://demo.parlant.io" 
            agentId="demo-agent"
            agentName="Demo Agent"
            chatDescription="Chat with our demo agent"
          />
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);