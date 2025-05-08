# parlant-chat-react

<!-- ![Build Status](https://img.shields.io/github/actions/workflow/status/menachembrich/parlant-chat-react/ci.yml?branch=main)
![License](https://img.shields.io/github/license/menachembrich/parlant-chat-react)
![npm version](https://img.shields.io/npm/v/parlant-chat-react) -->

a flexible and customizable React chat component for integrating Parlant's chatbot seamlessly into your website.

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
import Chatbot from 'parlant-chat-react';

function App() {
  return (
    <div>
      <h1>My Application</h1>      
      <Chatbot 
        sessionId="SESSION_ID" 
        server="ROUTE" 
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
  sessionId="SESSION_ID" 
  server="ROUTE" 
/>
```

### Popup Chat

Display the chat as a popup that can be toggled with a button:

```jsx
<Chatbot 
  float 
  sessionId="SESSION_ID" 
  server="ROUTE" 
/>
```

### Customized Popup Button

Use a custom button component:

```jsx
import { Send } from 'lucide-react';

<Chatbot 
  float 
  sessionId="SESSION_ID" 
  server="ROUTE"
  popupButton={<Send color="white" size={24} />} 
/>
```

### Advanced Styling

Apply custom class names to various parts of the chat:

```jsx
<Chatbot 
  sessionId="SESSION_ID" 
  server="ROUTE"
  classNames={{
    chatboxWrapper: "my-chatbox-wrapper-class",
    chatbox: "my-chatbox-class",
    messagesArea: "my-messages-class",
    agentMessage: "agent-bubble",
    customerMessage: "customer-bubble",
    textarea: "my-input-class",
    defaultPopupButton: "my-button-class",
    defaultPopupButtonIcon: "my-icon-class",
    chatDescription: "my-description-class",
    bottomLine: "my-footer-class"
  }}
/>
```

### Custom Component Replacement

Replace default UI components with your own:

```jsx
<ParlantChatbox 
  sessionId="SESSION_ID" 
  server="ROUTE"
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
    ),
    header: ({ changeIsExpanded }) => (
      <div>
        <h2>Custom Header</h2>
        <button onClick={changeIsExpanded}>Toggle Expanded</button>
      </div>
    )
  }}
/>
```

## Props

| Prop                   | Type           | Required | Default | Description                                                                 |
|------------------------|----------------|----------|---------|-----------------------------------------------------------------------------|
| `server`               | string         | Yes      | -       | API endpoint for chat communication                                         |
| `sessionId`            | string         | No       | -       | Unique identifier for an existing chat session                              |
| `titleFn`              | function       | No       | -       | Function that returns a string to generate dynamic chat session titles       |
| `agentId`              | string         | No       | -       | Unique identifier for creating a new chat session with a specific agent     |
| `agentName`            | string         | No       | -       | Name of the chat agent                                                      |
| `agentAvatar`          | JSX.Element    | No       | -       | Custom avatar for the agent                                                 |
| `chatDescription`      | string         | No       | -       | Description text shown at the top of the chat                               |
| `float`                | boolean        | No       | `false` | Whether to display as a popup chat                                          |
| `popupButton`          | JSX.Element    | No       | -       | Custom button element for popup mode                                        |
| `sendIcon`             | JSX.Element    | No       | -       | Custom send message icon                                                    |
| `classNames`           | object         | No       | -       | Custom CSS class names for styling                                          |
| `components`           | object         | No       | -       | Custom React components to replace defaults                                 |
| `onPopupButtonClick`   | function       | No       | -       | Callback fired when the popup button is clicked (in popup mode)             |
| `agentOpeningMessage`  | string         | No       | -       | Message shown as the first message from the agent when starting a session   |

### ClassNames Object Properties

| Property                | Description                        |
|-------------------------|------------------------------------|
| `chatboxWrapper`        | Wrapper around the main chatbox    |
| `chatbox`               | Main chat container                |
| `messagesArea`          | Messages list container            |
| `agentMessage`          | Agent message bubble               |
| `customerMessage`       | Customer message bubble            |
| `textarea`              | Message input field                |
| `defaultPopupButton`    | Default popup toggle button        |
| `defaultPopupButtonIcon`| Icon in the default popup button   |
| `chatDescription`       | Chat description container         |
| `bottomLine`            | Footer of the chat                 |

### Components Object Properties

| Property         | Description                      | Props Passed                  |
|------------------|----------------------------------|-------------------------------|
| `popupButton`    | Custom popup button component    | `{ toggleChatOpen }`          |
| `agentMessage`   | Custom agent message component   | `{ message }`                 |
| `customerMessage`| Custom customer message component| `{ message }`                 |
| `header`         | Custom header component          | `{ changeIsExpanded }`        |

## License

MIT © Emcie-co
