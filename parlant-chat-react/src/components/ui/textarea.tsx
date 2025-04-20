import * as React from 'react';

import { createUseStyles } from 'react-jss';
import clsx from 'clsx';

const useStyles = createUseStyles({
  textArea: {
    display: 'flex',
    minHeight: '80px',
    width: '100%',
    borderRadius: '6px',
    border: '1px solid',
    paddingInline: '0.75rem',
    paddingBlock: '0.5rem',
    fontSize: '0.875rem',
    fontFamily: 'Inter !important',
    outline: 'none',
  }
});

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const classes = useStyles();
    return (
      <textarea
        className={clsx(classes.textArea, className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
