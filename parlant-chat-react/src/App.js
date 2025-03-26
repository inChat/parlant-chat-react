import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Chat from './components/chat/chat';
const queryClient = new QueryClient();
function App({ route, sessionId, classNames }) {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(Chat, { route: route, sessionId: sessionId, classNames: classNames }) }));
}
export default App;
