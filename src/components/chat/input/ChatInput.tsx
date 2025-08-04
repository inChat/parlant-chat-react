import { createUseStyles } from 'react-jss';
import type { JSX } from 'react';
import { useRef, useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/Textarea';
import PenIcon from '@/assets/icons/pen.svg';
import clsx from 'clsx';
import { COLORS } from '@/theme';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  sendIcon?: JSX.Element;
  className?: string;
  float?: boolean;
  focusTrigger?: boolean;
}

const useStyles = createUseStyles({
  textareaWrapper: {
    marginInline: '20px',
    flex: 'none',
    position: 'relative',
    border: `1px solid #EEEEEE`,
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    lineHeight: '3rem',
    paddingInlineStart: '1.125rem',
    marginTop: '1rem',
    boxShadow: '0px 3px 3px 0px #00000005',
    paddingRight: '0',
    height: '3.375rem',
    maxWidth: '1000px',
    gap: '4px',
  },
  textArea: {
    boxShadow: 'none',
    color: 'black',
    resize: 'none',
    border: 'none',
    height: '100%',
    borderRadius: '0',
    minHeight: 'unset',
    padding: '0',
    whiteSpace: 'nowrap',
    fontFamily: 'Inter',
    fontSize: '1rem',
    lineHeight: '52px',
    backgroundColor: 'white',
    fontWeight: '300',
    '&::placeholder': {
      color: COLORS.darkGrey,
      fontSize: '14px',
      fontWeight: '500'
    },
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  penIcon: {
    width: '20px',
    height: '20px',
    marginRight: '8px',
    color: COLORS.darkGrey,
  },
  sendButton: {
    marginRight: '10px',
    maxWidth: '60px',
    background: 'none',
    borderRadius: '100%',
    border: 'none !important',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    cursor: 'pointer',
    padding: 0,
    '&:hover': {
      background: 'white !important',
      border: 'none !important',
    },
    '&:focus': {
      outline: `2px solid ${COLORS.accent}`,
      borderRadius: '4px',
    },
    '&[disabled]': {
      opacity: 0.5,
      cursor: 'default',
    },
  },
});

const ChatInput = ({
  onSendMessage,
  sendIcon,
  className,
  float,
  focusTrigger,
}: ChatInputProps): JSX.Element => {
  const classes = useStyles();
  const [message, setMessage] = useState('');
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (float || focusTrigger) {
      textareaRef?.current?.focus();
    }
  }, [float, focusTrigger]);

  const handleTextareaKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitButtonRef?.current?.click();
    } else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e?: React.FormEvent): Promise<void> => {
    if (e) e.preventDefault();
    if (!message.trim()) return;
    await onSendMessage(message);
    setMessage('');
    // Refocus the textarea after sending for better UX
    textareaRef?.current?.focus();
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit}
      className={clsx(classes.textareaWrapper, className)}
      aria-label="Message input form"
    >
      <Textarea
        role="textbox"
        ref={textareaRef}
        placeholder="Message..."
        value={message}
        onKeyDown={handleTextareaKeydown}
        onChange={(e) => setMessage(e.target.value)}
        rows={1}
        className={classes.textArea}
        aria-label="Type your message"
        aria-multiline="false"
        aria-autocomplete="none"
      />
      <button
        type="submit"
        ref={submitButtonRef}
        className={classes.sendButton}
        disabled={!message.trim()}
        aria-label="Send message"
      >
        {sendIcon || (
          <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path
              d="M0.533203 0.333373L22.5332 10.3334L0.533202 20.3334L2.40554 12.3334L9.42682 10.3334L2.40554 8.33337L0.533203 0.333373Z"
              fill={COLORS.darkGrey}
            />
          </svg>
        )}
      </button>
    </form>
  );
};

export default ChatInput; 