import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Chat from './components/chat/chat';
const queryClient = new QueryClient();
function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(Chat, { route: 'http://localhost:8800', sessionId: 'l-Zo2YFSqi' }) }));
}
export default App;
