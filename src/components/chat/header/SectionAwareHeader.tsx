import React from 'react';
import { createUseStyles } from 'react-jss';
import { MessageInterface, SectionHeadingData } from '@/components/chat/Chat';
import { COLORS } from '@/theme';
import type { JSX } from 'react';

interface SectionAwareHeaderProps {
  changeIsExpanded: () => void;
  agentName: string | undefined;
  agentAvatar?: JSX.Element;
  messages: MessageInterface[];
  currentVisibleSection?: { title: string; data: SectionHeadingData } | null;
}

const useStyles = createUseStyles({
  header: {
    height: '4rem',
    borderRadius: '20px 20px 0 0',
    borderBottom: '1px solid #EEEEEE',
    display: 'flex',
    alignItems: 'center',
    paddingInline: '20px',
    fontSize: '1.2rem',
    // Enhanced transitions for ALL changing properties
    transition: 'background 0.6s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    willChange: 'background, color',
  },
  headerContent: {
    fontSize: '1rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    // Add smooth text transitions
    transition: 'color 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out',
    willChange: 'color, opacity',
  },
  // Fallback/default state - shows agent name
  fallbackTheme: {
    background: 'white',
    color: COLORS.primaryText,
  },
  // Agent initials avatar (matching ChatHeader)
  agentInitials: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'white',
    backgroundColor: COLORS.darkGrey,
    borderRadius: '6.5px',
    paddingInline: '7.8px',
    paddingBlock: '5px',
    marginInlineEnd: '18px',
    lineHeight: '100%',
    width: 'fit-content',
  },
  // Theme-based styles matching SectionHeading component
  supportTheme: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  focusTheme: {
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    color: 'white',
  },
  explorationTheme: {
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    color: 'white',
  },
  insightTheme: {
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    color: 'white',
  },
  reflectionTheme: {
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    color: 'white',
  },
  actionTheme: {
    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    color: '#333',
  },
  defaultTheme: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
});

const getThemeClass = (theme: string | undefined, classes: any): string => {
  switch (theme) {
    case 'support':
      return classes.supportTheme;
    case 'focus':
      return classes.focusTheme;
    case 'exploration':
      return classes.explorationTheme;
    case 'insight':
      return classes.insightTheme;
    case 'reflection':
      return classes.reflectionTheme;
    case 'action':
      return classes.actionTheme;
    default:
      return classes.defaultTheme;
  }
};

const SectionAwareHeader: React.FC<SectionAwareHeaderProps> = ({ 
  changeIsExpanded, 
  agentName,
  agentAvatar, 
  messages, 
  currentVisibleSection 
}) => {
  const classes = useStyles();

  // Use the currentVisibleSection prop instead of calculating from messages
  const visibleSection = currentVisibleSection;

  // Determine which theme to use: section theme or fallback
  const themeClass = visibleSection 
    ? getThemeClass(visibleSection.data?.theme, classes) 
    : classes.fallbackTheme;

  return (
    <header 
      className={`${classes.header} ${themeClass}`}
      role="banner"
      aria-labelledby="section-header-title"
    >
      <div 
        className={classes.headerContent} 
        id="section-header-title"
      >
        {visibleSection ? (
          <div>{visibleSection.title}</div>
        ) : (
          <>
            {agentAvatar || (agentName && (
              <div className={classes.agentInitials} aria-hidden="true">
                {agentName[0]?.toUpperCase()}
              </div>
            ))}
            {agentName && <div>{agentName}</div>}
          </>
        )}
      </div>
    </header>
  );
};

export default SectionAwareHeader;