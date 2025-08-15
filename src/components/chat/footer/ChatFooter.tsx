import { createUseStyles } from 'react-jss';
import type { JSX } from 'react';
import clsx from 'clsx';
import ParlantLogoFull from '@/assets/parlant-logo-full.svg';
import { COLORS } from '@/theme';

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
    color: COLORS.mutedText,
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
    color: COLORS.mutedText,
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
    whiteSpace: 'nowrap',
    gap: '0.375rem',
    height: '20px'
  },
});

const ChatFooter = ({ showInfo, className }: ChatFooterProps): JSX.Element => {
  const classes = useStyles();

  return (
    <footer className={clsx(classes.bottomLine, className)} role="contentinfo">
      <div 
        role="status"
        aria-live="polite"
        className={clsx(classes.statusInvisible)}
      >
        {showInfo}
      </div>
      <div className={classes.poweredBy}>
        <div className={classes.poweredByContainer}>
          Powered by open-source
          <a href="https://parlant.io" target="_blank" style={{width: 'max-content'}}>
            <img 
              src={ParlantLogoFull} 
              alt="" 
              height={15} 
              width={65} 
              style={{ objectFit: 'contain', marginTop: '2px' }}
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default ChatFooter; 