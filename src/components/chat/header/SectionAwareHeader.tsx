import React from 'react';
import { createUseStyles } from 'react-jss';
import { MessageInterface, SectionHeadingData } from '@/components/chat/Chat';

interface SectionAwareHeaderProps {
  changeIsExpanded: () => void;
  agentName: string | undefined;
  messages: MessageInterface[];
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
    transition: 'all 0.3s ease-in-out',
  },
  headerContent: {
    fontSize: '1rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
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
  // Empty state when no section heading exists
  empty: {
    background: 'transparent',
    borderBottom: 'none',
    height: '0',
    padding: '0',
    overflow: 'hidden',
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
  messages 
}) => {
  const classes = useStyles();

  // Find the most recent section heading message
  const mostRecentSectionHeading = React.useMemo(() => {
    // Iterate through messages in reverse order to find the most recent section heading
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.data && typeof message.data === 'object' && 'section_heading' in message.data) {
        // The message title is in the data.message field for section headings
        const messageData = message.data as { message?: string; section_heading: SectionHeadingData };
        return {
          title: messageData.message || '',
          data: messageData.section_heading
        };
      }
    }
    return null;
  }, [messages]);

  // If no section heading exists, render empty header
  if (!mostRecentSectionHeading) {
    return <div className={classes.empty} />;
  }

  const themeClass = getThemeClass(mostRecentSectionHeading.data?.theme, classes);

  return (
    <header 
      className={`${classes.header} ${themeClass}`}
      role="banner"
      aria-labelledby="section-header-title"
    >
      <div className={classes.headerContent} id="section-header-title">
        <div>{mostRecentSectionHeading.title}</div>
      </div>
    </header>
  );
};

export default SectionAwareHeader;