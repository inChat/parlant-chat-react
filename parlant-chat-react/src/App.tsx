import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './App.css';
import Chat from './components/chat/chat';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Chat route={'http://localhost:8800'} sessionId={'l-Zo2YFSqi'}/>
    </QueryClientProvider>
  )
}

export default App;