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
    color: '#151515',
    paddingBlock: '1rem'
  },
  customerWrapper: {
    justifyContent: 'end',
  },
  messageWrapper: {
    width: '50%',
    border: '1px solid #e8e8e8',
    borderRadius: '12px',
    lineHeight: '1.35rem',
    padding: '10px',
    position: 'relative',
    margin: '10px',
    background: '#FFFFFF',
    color: '#151515',
    '& .message-metadata': {
      position: 'absolute',
      top: '-23px',
      display: 'flex',
      justifyContent: 'space-between',
      color: '#151515',
      width: 'calc(100% - 15px)',
      fontSize: '0.8rem',
    }
  },
  customerMessageWrapper: {
    // background: '#4a90e2',
    // color: 'white',
  }
});

const timeAgo = (date: Date): string => {
	date = new Date(date);
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	if (hours < 24) return date.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: false});
	else return date.toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false});
};

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
        <div className='message-metadata'>
            <div>
              {(message?.data as any)?.participant?.display_name}
            </div>
            <div>
              {timeAgo(new Date(message?.creationUtc))}
            </div>
          </div>
        <div>
          {messageContent}
        </div>
      </div>
    </div>
  );
};

export default Message;