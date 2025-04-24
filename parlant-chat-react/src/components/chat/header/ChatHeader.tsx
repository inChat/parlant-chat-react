import { createUseStyles } from 'react-jss';
import type { JSX } from 'react';
import ExpandIcon from '../../../assets/icons/expand.svg';
import { COLORS } from '../../../theme';

interface ChatHeaderProps {
  agentName?: string;
  agentAvatar?: JSX.Element;
  changeIsExpanded: () => void;
  isExpanded?: boolean;
  className?: string;
}

const useStyles = createUseStyles({
  header: {
    height: '4rem',
    borderRadius: `20px 20px 0 0`,
    borderBottom: `1px solid #EEEEEE`,
    color: 'white',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    paddingInline: '20px',
    fontSize: '1.2rem',
  },
  headerAgentName: {
    fontSize: '1rem',
    fontWeight: '500',
    color: COLORS.primaryText,
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  headerAgentNameInitials: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'white',
    backgroundColor: COLORS.darkGrey,
    borderRadius: '6.5px',
    paddingInline: '7.8px',
    paddingBlock: '5px',
    lineHeight: '100%',
    width: 'fit-content',
  },
  expandButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:focus': {
      outline: 'none',
    },
    '&:focus-visible': {
      outline: 'none',
    },
  },
  expandIcon: {
    width: '20px',
    height: '20px',
    objectFit: 'contain',
    '&:focus-visible': {
      outline: 'none',
    },
  },
});

const ChatHeader = ({
  agentName,
  agentAvatar,
  changeIsExpanded,
  isExpanded,
  className
}: ChatHeaderProps): JSX.Element => {
  const classes = useStyles();

  return (
    <header className={`${classes.header} ${className || ''}`}>
      <div className={classes.headerAgentName}>
        {agentAvatar || (agentName && (
          <div className={classes.headerAgentNameInitials}>
            {agentName[0]?.toUpperCase()}
          </div>
        ))}
        {agentName && <div>{agentName}</div>}
      </div>
      <button
        type="button"
        className={classes.expandButton}
        onClick={changeIsExpanded}
        aria-label={isExpanded ? 'Collapse chat window' : 'Expand chat window'}
      >
        <img src={ExpandIcon} alt="" className={classes.expandIcon} />
      </button>
    </header>
  );
};

export default ChatHeader; 