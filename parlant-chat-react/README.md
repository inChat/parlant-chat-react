# parlant-chat-react

A flexible and customizable React chat component that can be embedded directly in your application or used as a popup chat interface.

## Installation

```bash
npm install parlant-chat-react
# or
yarn add parlant-chat-react
```

## Quick Start

Here's how to quickly add the chat component to your React application:

```jsx
import React from 'react';
import { Chatbot } from 'parlant-chat-react';

function App() {
  return (
    <div>
      <h1>My Application</h1>
      
      {/* Basic embedded chat */}
      <Chatbot 
        sessionId="user-123" 
        route="/api/chat" 
      />
    </div>
  );
}

export default App;
```

## Usage Examples

### Basic Embedded Chat

Add a chat interface directly in your page layout:

```jsx
<Chatbot 
  sessionId="user-123" 
  route="/api/chat" 
/>
```

### Popup Chat

Display the chat as a popup that can be toggled with a button:

```jsx
<Chatbot 
  asPopup 
  sessionId="user-123" 
  route="/api/chat" 
/>
```

### Customized Popup Button

Use a custom button component:

```jsx
import { Send } from 'lucide-react';

<Chatbot 
  asPopup 
  sessionId="user-123" 
  route="/api/chat"
  popupButton={<Send color="white" size={24} />} 
/>
```

### Advanced Styling

Apply custom class names to various parts of the chat:

```jsx
<Chatbot 
  sessionId="user-123" 
  route="/api/chat"
  classNames={{
    chatbox: "my-chatbox-class",
    messagesArea: "my-messages-class",
    agentMessage: "agent-bubble",
    customerMessage: "customer-bubble",
    textarea: "my-input-class",
    defaultPopupButton: "my-button-class",
    defaultPopupButtonIcon: "my-icon-class"
  }}
/>
```

### Custom Component Replacement

Replace default UI components with your own:

```jsx
<Chatbot 
  sessionId="user-123" 
  route="/api/chat"
  components={{
    popupButton: ({ toggleChatOpen }) => (
      <button onClick={toggleChatOpen}>Chat with us</button>
    ),
    agentMessage: ({ message, className }) => (
      <div className={className}>
        <p>{message.content}</p>
        <span>Agent: {message.sender}</span>
      </div>
    ),
    customerMessage: ({ message, className }) => (
      <div className={className}>
        <p>{message.content}</p>
        <span>You</span>
      </div>
    )
  }}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `route` | string | Yes | - | API endpoint for chat communication |
| `sessionId` | string | Yes | - | Unique identifier for the chat session |
| `asPopup` | boolean | No | `false` | Whether to display as a popup chat |
| `popupButton` | JSX.Element | No | `<MessageSquare />` | Custom button element for popup mode |
| `sendIcon` | JSX.Element | No | - | Custom send message icon |
| `classNames` | object | No | - | Custom CSS class names for styling |
| `components` | object | No | - | Custom React components to replace defaults |

### ClassNames Object Properties

| Property | Description |
|----------|-------------|
| `chatbox` | Main chat container |
| `messagesArea` | Messages list container |
| `agentMessage` | Agent message bubble |
| `customerMessage` | Customer message bubble |
| `textarea` | Message input field |
| `defaultPopupButton` | Default popup toggle button |
| `defaultPopupButtonIcon` | Icon in the default popup button |

### Components Object Properties

| Property | Description | Props Passed |
|----------|-------------|--------------|
| `popupButton` | Custom popup button component | `{ toggleChatOpen }` |
| `agentMessage` | Custom agent message component | `{ message, className }` |
| `customerMessage` | Custom customer message component | `{ message, className }` |


## License

MIT © Emcie-co