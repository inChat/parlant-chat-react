import { createUseStyles } from 'react-jss';
import type { JSX } from 'react';
import clsx from 'clsx';
import ParlantLogoFull from '../../../assets/parlant-logo-full.svg';

interface ChatFooterProps {
  showInfo?: string;
  className?: string;
}

const useStyles = createUseStyles({
  bottomLine: {
    paddingInline: '25px',
    left: '1rem',
    bottom: '-20px',
    margin: 0,
    lineHeight: 'normal',
    fontSize: '11px',
    fontWeight: '500',
    color: '#A9A9A9',
    alignItems: 'center',
    height: '37px',
    display: 'flex',
    '& > div': {
      flex: 1,
    }
  },
  statusInvisible: {
    visibility: 'hidden',
  },
  statusVisible: {
    visibility: 'visible',
  },
  poweredBy: {
    fontSize: '12px',
    fontWeight: '400',
    color: '#A9A9A9',
    lineHeight: '18px',
    textAlign: 'center',
    width: 'fit-content',
    margin: 'auto',
    marginBottom: '0.5rem',
  },
  poweredByContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    gap: '0.375rem',
  },
});

const ChatFooter = ({ showInfo, className }: ChatFooterProps): JSX.Element => {
  const classes = useStyles();

  return (
    <footer className={clsx(classes.bottomLine, className)}>
      <div 
        className={clsx(classes.statusInvisible, showInfo && classes.statusVisible)}
        aria-live="polite"
      >
        {showInfo}
      </div>
      <div className={classes.poweredBy}>
        <div className={classes.poweredByContainer}>
          Powered by
          <img 
            src={ParlantLogoFull} 
            alt="Parlant" 
            height={17} 
            width={68} 
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </footer>
  );
};

export default ChatFooter; 