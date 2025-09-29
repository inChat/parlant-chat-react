import React from 'react';
import { createUseStyles } from 'react-jss';
import { MessageInterface, SectionHeadingData } from '@/components/chat/Chat';

interface SectionAwareHeaderProps {
  changeIsExpanded: () => void;
  agentName: string | undefined;
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
    transition: 'background 0.6s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1), height 0.3s ease, padding 0.3s ease, border-bottom-color 0.3s ease',
    willChange: 'background, color, height, padding, border-bottom-color',
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
  // New collapsed state (replaces empty element)
  collapsed: {
    height: '0',
    paddingInline: '0',
    paddingBlock: '0',
    overflow: 'hidden',
    borderBottomColor: 'transparent',
  },
  // New content hidden state
  contentHidden: {
    opacity: 0,
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
  messages, 
  currentVisibleSection 
}) => {
  const classes = useStyles();

  // Use the currentVisibleSection prop instead of calculating from messages
  const visibleSection = currentVisibleSection;

  // Always render the same header element, use classes to control appearance
  const isCollapsed = !visibleSection;
  const themeClass = visibleSection ? getThemeClass(visibleSection.data?.theme, classes) : '';

  return (
    <header 
      className={`${classes.header} ${isCollapsed ? classes.collapsed : themeClass}`}
      role="banner"
      aria-labelledby="section-header-title"
    >
      <div 
        className={`${classes.headerContent} ${isCollapsed ? classes.contentHidden : ''}`} 
        id="section-header-title"
      >
        <div>{visibleSection?.title || ''}</div>
      </div>
    </header>
  );
};

export default SectionAwareHeader;