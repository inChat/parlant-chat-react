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
import ParlantChatbot from 'parlant-chat-react';

function App() {
  return (
    <div>
      <h1>My Application</h1>      
      <ParlantChatbot 
        sessionId="SESSION_ID" 
        route="ROUTE" 
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
<ParlantChatbot 
  sessionId="SESSION_ID" 
  route="ROUTE" 
/>
```

### Popup Chat

Display the chat as a popup that can be toggled with a button:

```jsx
<ParlantChatbot 
  asPopup 
  sessionId="SESSION_ID" 
  route="ROUTE" 
/>
```

### Customized Popup Button

Use a custom button component:

```jsx
import { Send } from 'lucide-react';

<ParlantChatbot 
  asPopup 
  sessionId="SESSION_ID" 
  route="ROUTE"
  popupButton={<Send color="white" size={24} />} 
/>
```

### Advanced Styling

Apply custom class names to various parts of the chat:

```jsx
<ParlantChatbot 
  sessionId="SESSION_ID" 
  route="ROUTE"
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
<ParlantChatbot 
  sessionId="SESSION_ID" 
  route="ROUTE"
  components={{
    popupButton: ({ toggleChatOpen }) => (
      <button onClick={toggleChatOpen}>Chat with us</button>
    ),
    agentMessage: ({ message }) => (
      <div>
        <p>{message.data.message}</p>
        <span>Agent</span>
      </div>
    ),
    customerMessage: ({ message }) => (
      <div>
        <p>{message.data.message}</p>
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
| `popupButton` | JSX.Element | No | - | Custom button element for popup mode |
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
| `agentMessage` | Custom agent message component | `{ message }` |
| `customerMessage` | Custom customer message component | `{ message }` |


## License

MIT © Emcie-co