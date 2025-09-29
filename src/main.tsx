import React from 'react';
import ReactDOM from 'react-dom/client';
import Chatbox from './App';
import './index.css';

// Development demo of the Parlant Chat React component
function App() {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1>Parlant Chat React - Development Demo</h1>
      <p>This is a development environment for the Parlant Chat React component.</p>
      
      <div style={{ marginTop: '40px' }}>
        <h2>Embedded Chat (non-floating)</h2>
        <div style={{ maxWidth: '500px', margin: '20px 0' }}>
          <Chatbox 
            server="https://demo.parlant.io" 
            agentId="demo-agent"
            agentName="Demo Agent"
            chatDescription="Chat with our demo agent"
          />
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Floating Chat Button</h2>
        <p>Look for the floating chat button in the bottom right corner.</p>
        <Chatbox 
          float
          server="https://demo.parlant.io" 
          agentId="demo-agent"
          agentName="Demo Agent"
          chatDescription="Chat with our demo agent"
        />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);