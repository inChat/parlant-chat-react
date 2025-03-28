import { ClassNameValue, twJoin, twMerge } from 'tailwind-merge';
import { MessageInterface } from '../chat';
import { JSX } from 'react';

/**
 * Message component props interface
 */
interface MessageProps {
  message: MessageInterface;
  className?: ClassNameValue;
}

/**
 * Message component that displays a chat message
 * Handles different styling for customer vs agent messages
 */
const Message = ({ message, className }: MessageProps): JSX.Element => {
  // Determine if this is a customer message for styling purposes
  const isCustomerMessage = message?.source === 'customer';
  
  // Extract message content safely with type definition
  const messageContent = (message.data as { message?: string })?.message || '';

  return (
    <div 
      className={twJoin(
        "message w-full text-start flex text-[#A9A9A9]", 
        isCustomerMessage && 'justify-end'
      )}
    >
      <div 
        className={twMerge(
          'w-[50%] rounded-[12px] p-[10px] m-[10px]',
          isCustomerMessage 
            ? 'bg-[#4a90e2] text-white' 
            : 'bg-[#2c2f36] text-[#d1d1e9]',
          className
        )}
      >
        <div className="message-content">
          {messageContent}
        </div>
      </div>
    </div>
  );
};

export default Message;