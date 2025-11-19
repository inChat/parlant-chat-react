import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import SEPChatbox, { createSectionAwareHeader } from './SEPChatbox';
import type { MessageInterface } from './components/chat/Chat';
import './index.css';

// Mock conversation data for SEP MVP - Symptom Story Builder
const createMockConversation = (): MessageInterface[] => {
  const baseTime = new Date();
  const messages: MessageInterface[] = [
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 310000),
      id: 'section-1',
      deleted: false,
      offset: 0,
      correlationId: 'section-1',
      data: { 
        message: 'I\'m here to help you think through your lived experience so you can clarify and validate your thoughts. Let\'s get started!',
        section_heading: {
          title: 'Welcome & Initial Exploration',
          subtitle: 'Let\'s start by understanding what brought you here',
          theme: 'support',
          icon: '🌟'
        }
      },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'human_agent_on_behalf_of_ai_agent',
      creationUtc: new Date(baseTime.getTime() - 300000),
      id: 'msg-1',
      deleted: false,
      offset: 1,
      correlationId: 'init-1',
      data: { message: 'Hello! I\'m here to help you explore and understand your experiences. This is a safe space to reflect on what you\'ve been going through. What brought you here today?' },
      status: 'ready',
    },
    /*{
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 290000),
      id: 'msg-2',
      deleted: false,
      offset: 2,
      correlationId: 'cust-1',
      data: { message: 'Hi... I\'ve been struggling a lot with my studies lately. I can\'t seem to focus, and I keep missing deadlines even though I really want to do well. A friend mentioned I might have ADHD, but I\'m not sure.' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 280000),
      id: 'msg-3',
      deleted: false,
      offset: 3,
      correlationId: 'agent-1',
      data: { message: 'Thank you for sharing that with me. It takes courage to reach out when you\'re struggling. Focus and deadline challenges are experiences many people have, and it\'s completely valid to want to understand them better. Can you tell me more about when you first started noticing these difficulties?' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 270000),
      id: 'msg-4',
      deleted: false,
      offset: 4,
      correlationId: 'cust-2',
      data: { message: 'I think it\'s been worse since I started university, but looking back, I remember having trouble in secondary school too. I was always the one who forgot homework or got distracted during lessons.' },
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
      data: { message: 'It sounds like you\'ve been dealing with these challenges for quite a while. University can definitely intensify existing difficulties because of the increased independence and workload. When you mention getting distracted, what does that typically look like for you? Are there particular situations where it happens more?' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 255000),
      id: 'section-2',
      deleted: false,
      offset: 5,
      correlationId: 'section-2',
      data: { 
        message: 'Now let\'s dive deeper into what you\'re experiencing day-to-day.',
        section_heading: {
          title: 'Understanding Your Challenges',
          subtitle: 'Let\'s explore what focus and attention feel like for you',
          theme: 'focus',
          icon: '🎯'
        }
      },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 250000),
      id: 'msg-6',
      deleted: false,
      offset: 6,
      correlationId: 'cust-3',
      data: { message: 'In lectures, my mind just wanders. I\'ll start thinking about something completely unrelated, or I\'ll notice sounds around me that others don\'t seem bothered by. At home, I\'ll sit down to study and end up cleaning my room or scrolling my phone for hours instead.' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 240000),
      id: 'msg-7',
      deleted: false,
      offset: 7,
      correlationId: 'agent-3',
      data: { message: 'What you\'re describing - the mind wandering, sensitivity to sounds, and difficulty initiating tasks you intend to do - these are all very real experiences that many people with attention difficulties share. It\'s not about lack of willpower or intelligence. How do you feel after these situations happen?' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'customer',
      creationUtc: new Date(baseTime.getTime() - 230000),
      id: 'msg-8',
      deleted: false,
      offset: 8,
      correlationId: 'cust-4',
      data: { message: 'Frustrated, mainly. And guilty. I feel like I should be able to just... do better? Like other people don\'t seem to have such a hard time with basic things. Sometimes I wonder if I\'m just lazy or making excuses.' },
      status: 'ready',
    },
    {
      kind: 'message',
      source: 'ai_agent',
      creationUtc: new Date(baseTime.getTime() - 220000),
      id: 'msg-9',
      deleted: false,
      offset: 9,
      correlationId: 'agent-4',
      data: { message: 'Those feelings are so common and understandable. Many people with ADHD experience that internal criticism and self-doubt. But what you\'re describing isn\'t laziness - it sounds like your brain might be wired differently, which isn\'t your fault. Have you noticed if certain environments or times of day make focusing easier or harder?' },
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
      data: { message: 'Actually, yes! I focus much better late at night when it\'s quiet. And if I\'m really interested in something, I can hyperfocus for hours - sometimes I even forget to eat. But that doesn\'t happen with coursework usually.' },
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
      data: { message: 'That\'s a really important observation! The late-night focus and hyperfocus experiences you describe are very characteristic patterns. It shows your brain can focus intensely - it\'s just selective about when and on what. This interest-based attention is something many people with ADHD experience. How does this affect your daily routine and sleep?' },
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
      data: { message: 'My sleep schedule is all over the place. I often stay up until 3 or 4 AM because that\'s when I finally feel productive, then I\'m exhausted the next day. I\'ve tried going to bed earlier but I just lie awake with racing thoughts.' },
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
      data: { message: 'Sleep difficulties and racing thoughts at bedtime are very common experiences for people with ADHD. Your brain might be most calm and focused when the world is quiet, but this creates that cycle you described. Beyond focus and sleep, have you noticed challenges with things like organization, time management, or emotional regulation?' },
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
      data: { message: 'Oh yes, definitely. I\'m constantly running late even though I hate being late. I lose things all the time - keys, phone, important papers. And I can go from fine to overwhelmed really quickly, especially if plans change suddenly.' },
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
      data: { message: 'You\'re building a really comprehensive picture of your experiences. Time blindness, difficulty with organization, and sensitivity to changes - these all fit into a pattern that many people with ADHD recognize. The fact that you hate being late but still struggle with it shows this isn\'t about not caring. How has this been affecting your relationships and university experience?' },
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
      data: { message: 'I worry my friends think I\'m unreliable. And I feel like I\'m not living up to my potential at uni. I know I\'m smart, but my grades don\'t reflect that. I\'ve even thought about dropping out because I feel so behind and overwhelmed.' },
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
      data: { message: 'Thank you for sharing something so personal. That disconnect between knowing you\'re capable and not seeing it reflected in your performance is heartbreaking and exhausting. Please know that considering dropping out doesn\'t mean you\'re not strong enough - it means you\'re recognizing you need different support. Have you been able to talk to anyone at university about these struggles?' },
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
      data: { message: 'I\'ve thought about it, but I don\'t really know where to start. I\'m worried they\'ll think I\'m just making excuses or that I can\'t handle university. What if I\'m wrong about the ADHD thing?' },
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
      data: { message: 'Those concerns make complete sense. Seeking help can feel vulnerable, especially when you\'ve been struggling for a while. But what you\'ve shared with me today - the specific patterns, the impact on your life, the timeline - these aren\'t excuses, they\'re valid experiences that deserve attention regardless of what the outcome might be.' },
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
      data: { message: 'I hadn\'t thought about it that way. This conversation has helped me realize I\'m not just imagining things. What would you suggest as a next step?' },
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
      data: { message: 'I\'m so glad this has been helpful. You\'ve articulated your experiences really clearly today, which is exactly the kind of self-reflection that will serve you well. Consider reaching out to your university\'s disability services or student counseling - they\'re there to support you, not judge you. You might also keep a brief daily log of your experiences to share with a healthcare provider. Remember, seeking answers is a sign of strength, not weakness.' },
      status: 'ready',
    },
    */
  ];
  
  return messages;
};

// Mock Chat Component that uses predefined messages
const MockChatbox = ({ float = false }: { float?: boolean }) => {
  const mockMessages = createMockConversation();

  return (
    <SEPChatbox 
      server="mock://demo" 
      agentName="SEP Support Assistant"
      chatDescription="Smart Encouragement Platform - ADHD Support"
      float={float}
      mockMessages={mockMessages}
      // Use a mock sessionId to prevent real server calls
      sessionId="mock-session-12345"
      persistSession={false}
      components={{
        header: createSectionAwareHeader()
      }}
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
            <SEPChatbox 
              server="https://demo.parlant.io" 
              agentId="demo-agent"
              agentName="Demo Agent"
              chatDescription="Chat with our demo agent"
              persistSession={true}
              components={{
                header: createSectionAwareHeader()
              }}
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
          <SEPChatbox 
            float
            server="https://demo.parlant.io" 
            agentId="demo-agent"
            agentName="Demo Agent"
            chatDescription="Chat with our demo agent"
            persistSession={true}
            components={{
              header: createSectionAwareHeader()
            }}
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