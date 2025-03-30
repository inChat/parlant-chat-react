import { ClassNameValue } from 'tailwind-merge';
import { MessageInterface } from '../chat';
import { JSX } from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

const useStyles = createUseStyles({
  wrapper: {
    width: '100%',
    textAlign: 'start',
    display: 'flex',
    color: '#A9A9A9',
  },
  customerWrapper: {
    justifyContent: 'end',
  },
  messageWrapper: {
    width: '50%',
    borderRadius: '12px',
    padding: '10px',
    margin: '10px',
    background: '#2c2f36',
    color: '#d1d1e9'
  },
  customerMessageWrapper: {
    background: '#4a90e2',
    color: 'white',
  }
});

interface MessageProps {
  message: MessageInterface;
  className?: ClassNameValue;
}

const Message = ({ message, className }: MessageProps): JSX.Element => {
  const classes = useStyles();
  const isCustomerMessage = message?.source === 'customer';
  
  const messageContent = (message.data as { message?: string })?.message || '';

  return (
    <div 
      className={clsx(
        classes.wrapper,
        isCustomerMessage && classes.customerWrapper
      )}
    >
      <div 
        className={clsx(
          classes.messageWrapper,
          isCustomerMessage && classes.customerMessageWrapper,
          className
        )}
      >
        <div>
          {messageContent}
        </div>
      </div>
    </div>
  );
};

export default Message;