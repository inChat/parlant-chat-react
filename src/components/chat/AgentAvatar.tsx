import { useState } from 'react';
import type { JSX } from 'react';
import { createUseStyles } from 'react-jss';
import { COLORS } from '@/theme';

interface AgentAvatarProps {
  avatarUrl: string;
  agentName?: string;
  size?: number;
  className?: string;
}

const useStyles = createUseStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '6.5px',
    backgroundColor: COLORS.darkGrey,
    overflow: 'hidden',
    flexShrink: 0,
    marginInlineEnd: '8px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  fallbackLetter: {
    color: 'white',
    fontWeight: '700',
    lineHeight: '100%',
    userSelect: 'none',
  },
});

const AgentAvatar = ({ avatarUrl, agentName, size = 26, className }: AgentAvatarProps): JSX.Element => {
  const classes = useStyles();
  const [imgFailed, setImgFailed] = useState(false);

  const containerStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const letterStyle = {
    fontSize: `${Math.round(size * 0.55)}px`,
  };

  return (
    <div
      className={`${classes.container} ${className || ''}`}
      style={containerStyle}
      aria-hidden="true"
    >
      {!imgFailed ? (
        <img
          src={avatarUrl}
          alt=""
          className={classes.image}
          onError={() => setImgFailed(true)}
          draggable={false}
        />
      ) : (
        <span className={classes.fallbackLetter} style={letterStyle}>
          {agentName?.[0]?.toUpperCase() || '?'}
        </span>
      )}
    </div>
  );
};

export default AgentAvatar;
