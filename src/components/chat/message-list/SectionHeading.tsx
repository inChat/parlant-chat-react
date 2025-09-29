import React from 'react';
import { createUseStyles } from 'react-jss';
import clsx from 'clsx';
import type { SectionHeadingData } from '../Chat';

const useStyles = createUseStyles({
  sectionHeading: {
    width: '100%',
    padding: '20px 16px',
    margin: '16px 0 8px 0',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    borderRadius: '12px',
    border: '1px solid #dee2e6',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontFamily: 'Inter, sans-serif',
  },
  iconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontSize: '18px',
    color: 'white',
  },
  textContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#212529',
    margin: 0,
    lineHeight: '1.4',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6c757d',
    margin: 0,
    lineHeight: '1.3',
  },
  // Theme variations
  focusTheme: {
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    borderColor: '#90caf9',
    '& $iconContainer': {
      background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
    },
  },
  emotionTheme: {
    background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)',
    borderColor: '#f48fb1',
    '& $iconContainer': {
      background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
    },
  },
  patternsTheme: {
    background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
    borderColor: '#ce93d8',
    '& $iconContainer': {
      background: 'linear-gradient(135deg, #9c27b0 0%, #6a1b9a 100%)',
    },
  },
  supportTheme: {
    background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
    borderColor: '#a5d6a7',
    '& $iconContainer': {
      background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
    },
  },
});

interface SectionHeadingProps {
  title: string;
  data?: SectionHeadingData;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, data }) => {
  const classes = useStyles();

  const getThemeClass = (theme?: string) => {
    switch (theme) {
      case 'focus':
        return classes.focusTheme;
      case 'emotion':
        return classes.emotionTheme;
      case 'patterns':
        return classes.patternsTheme;
      case 'support':
        return classes.supportTheme;
      default:
        return '';
    }
  };

  const getDefaultIcon = (theme?: string) => {
    switch (theme) {
      case 'focus':
        return '🎯';
      case 'emotion':
        return '💭';
      case 'patterns':
        return '🔍';
      case 'support':
        return '🌟';
      default:
        return '💬';
    }
  };

  return (
    <div className={clsx(classes.sectionHeading, getThemeClass(data?.theme))}>
      <div className={classes.iconContainer}>
        {data?.icon || getDefaultIcon(data?.theme)}
      </div>
      <div className={classes.textContent}>
        <h3 className={classes.title}>{title}</h3>
        {data?.subtitle && (
          <p className={classes.subtitle}>{data.subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default SectionHeading;