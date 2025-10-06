import { useEffect, useState } from 'react';
import type { ReactElement, JSX } from 'react';
import Chatbox, { type ChatProps } from './App';
import SectionAwareHeader from './components/chat/header/SectionAwareHeader';
import type { MessageInterface } from './components/chat/Chat';

const STORAGE_KEY = 'sep_parlant_session_data';

interface StoredSessionData {
  customerId: string;
  sessionId: string;
  lastAccessed: number;
}

interface SEPChatProps extends ChatProps {
  persistSession?: boolean;
  sessionExpiryDays?: number;
}

const SEPChatbox = ({ 
  persistSession = true,
  sessionExpiryDays = 30,
  customerId: providedCustomerId,
  sessionId: providedSessionId,
  onSessionCreated,
  ...chatboxProps 
}: SEPChatProps): JSX.Element => {
  const [persistedData, setPersistedData] = useState<StoredSessionData | null>(null);

  // Load persisted session data on mount
  useEffect(() => {
    if (!persistSession) return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StoredSessionData = JSON.parse(stored);
        
        // Check if session has expired
        const daysSinceLastAccess = (Date.now() - data.lastAccessed) / (1000 * 60 * 60 * 24);
        if (daysSinceLastAccess < sessionExpiryDays) {
          setPersistedData(data);
        } else {
          // Clear expired session
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to load persisted session:', error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [persistSession, sessionExpiryDays]);

  // Handle session creation with persistence
  const handleSessionCreated = (sessionId: string) => {
    if (persistSession) {
      const customerIdToStore = providedCustomerId || persistedData?.customerId || `customer-${Date.now()}`;
      
      const sessionData: StoredSessionData = {
        customerId: customerIdToStore,
        sessionId: sessionId,
        lastAccessed: Date.now()
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
        setPersistedData(sessionData);
      } catch (error) {
        console.error('Failed to persist session:', error);
      }
    }

    // Call the original callback if provided
    onSessionCreated?.(sessionId);
  };

  // Determine which customerId and sessionId to use
  const customerIdToUse = providedCustomerId || persistedData?.customerId;
  const sessionIdToUse = providedSessionId || persistedData?.sessionId;

  return (
    <Chatbox
      {...chatboxProps}
      customerId={customerIdToUse}
      sessionId={sessionIdToUse}
      onSessionCreated={handleSessionCreated}
    />
  );
};

// Helper function to create a section-aware header component
export const createSectionAwareHeader = () => 
  ({ changeIsExpanded, agentName, messages, currentVisibleSection }: {
    changeIsExpanded: () => void; 
    agentName: string | undefined; 
    messages?: MessageInterface[];
    currentVisibleSection?: { title: string; data: any } | null;
  }): ReactElement => (
    <SectionAwareHeader 
      changeIsExpanded={changeIsExpanded}
      agentName={agentName}
      messages={messages || []}
      currentVisibleSection={currentVisibleSection}
    />
  );

export default SEPChatbox;
export type { SEPChatProps };
