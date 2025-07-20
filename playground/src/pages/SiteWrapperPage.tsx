import React from 'react';
import { Typography, Box, Alert, List, Button } from '@mui/material';
import { SiteWrapper, NavItem, UserHelper, Locale } from '@churchapps/apphelper';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import { ErrorBoundary } from '../ErrorBoundary';

export default function SiteWrapperPage() {
  const context = React.useContext(UserContext) as any;
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = React.useState('dashboard');

  // Helper function to get localized labels with English fallbacks
  const getLabel = (key: string, fallback: string): string => {
    try {
      const translated = Locale.label(key);
      // If translation equals the key, it means no translation was found
      // Also handle null, undefined, or empty string cases
      if (!translated || translated === key || typeof translated !== 'string') {
        return fallback;
      }
      return translated;
    } catch (error) {
      return fallback;
    }
  };

  // Mock user and church data for demo if not authenticated
  const mockContext = React.useMemo(() => {
    if (context?.user) {
      return context;
    }
    return {
      user: { id: 'demo-user', firstName: 'Demo', lastName: 'User', email: 'demo@churchapps.org' },
      person: { 
        id: 'demo-person', 
        name: { display: 'Demo User' },
        contactInfo: { email: 'demo@churchapps.org' }
      },
      userChurch: {
        church: { 
          id: 'demo-church', 
          name: 'Demo Church',
          address: { city: 'Demo City', state: 'DS' }
        }
      },
      userChurches: [
        { 
          church: { 
            id: 'demo-church', 
            name: 'Demo Church',
            address: { city: 'Demo City', state: 'DS' }
          }
        },
        { 
          church: { 
            id: 'demo-church-2', 
            name: 'Second Demo Church',
            address: { city: 'Test Town', state: 'TT' }
          }
        }
      ],
      logout: () => {
        console.log('Logout called');
        navigate('/');
      }
    };
  }, [context, navigate]);

  // Initialize locale system and configure UserHelper with mock data
  React.useEffect(() => {
    // Initialize locale system with AppHelper locales
    const initLocale = async () => {
      try {
        // Try to load from AppHelper package locales (this will work if properly set up)
        await Locale.init([
          '/locales/{{lng}}.json',
          '/public/locales/{{lng}}.json'
        ]);
        console.log('Locale system initialized successfully');
      } catch (error) {
        console.warn('Could not initialize locale system:', error);
        // Fallback will be used automatically
      }
    };
    
    initLocale();

    UserHelper.user = mockContext.user;
    UserHelper.person = mockContext.person;
    UserHelper.currentUserChurch = mockContext.userChurch;
    UserHelper.userChurches = mockContext.userChurches;
  }, [context, mockContext]);

  const handleNavigate = (url: string) => {
    console.log('Navigate to:', url);
    setSelectedTab(url.substring(1) || 'dashboard');
  };

  // Create navigation content with localized labels
  const navContent = (
    <List component="nav" sx={{ pt: 0 }}>
      <NavItem 
        url="/" 
        label={getLabel('wrapper.dash', 'Dashboard')} 
        icon="dashboard" 
        selected={selectedTab === 'dashboard'}
        onClick={() => handleNavigate('/')}
      />
      <NavItem 
        url="/people" 
        label={getLabel('wrapper.ppl', 'People')} 
        icon="people" 
        selected={selectedTab === 'people'}
        onClick={() => handleNavigate('/people')}
      />
      <NavItem 
        url="/groups" 
        label={getLabel('wrapper.groups', 'Groups')} 
        icon="group" 
        selected={selectedTab === 'groups'}
        onClick={() => handleNavigate('/groups')}
      />
      <NavItem 
        url="/attendance" 
        label={getLabel('wrapper.att', 'Attendance')} 
        icon="event_available" 
        selected={selectedTab === 'attendance'}
        onClick={() => handleNavigate('/attendance')}
      />
      <NavItem 
        url="/donations" 
        label={getLabel('wrapper.don', 'Donations')} 
        icon="volunteer_activism" 
        selected={selectedTab === 'donations'}
        onClick={() => handleNavigate('/donations')}
      />
      <NavItem 
        url="/forms" 
        label={getLabel('wrapper.form', 'Forms')} 
        icon="description" 
        selected={selectedTab === 'forms'}
        onClick={() => handleNavigate('/forms')}
      />
      <NavItem 
        url="/reports" 
        label={getLabel('wrapper.reports', 'Reports')} 
        icon="assessment" 
        selected={selectedTab === 'reports'}
        onClick={() => handleNavigate('/reports')}
      />
      <NavItem 
        url="/settings" 
        label={getLabel('wrapper.set', 'Settings')} 
        icon="settings" 
        selected={selectedTab === 'settings'}
        onClick={() => handleNavigate('/settings')}
      />
    </List>
  );



  // Fallback render if something is broken
  if (!navContent || !mockContext) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          SiteWrapper demo is loading... If this persists, there may be a configuration issue.
        </Alert>
        <Button onClick={() => navigate('/apphelper-wrappers')} variant="outlined" sx={{ mt: 2 }}>
          ← Back to Wrapper Components
        </Button>
      </Box>
    );
  }

  try {
    return (
      <ErrorBoundary>
        <SiteWrapper
          navContent={navContent}
          context={mockContext}
          appName="Playground Demo"
          onNavigate={handleNavigate}
          appearance={{
            wrapperBackground: '#333333',
            logoLight: '/images/logo-light.png',
            logoDark: '/images/logo-dark.png'
          }}
        >
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <Typography variant="h3" component="h1" color="primary">
              Hello World
            </Typography>
          </Box>
        </SiteWrapper>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('SiteWrapper render error:', error);
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          Error rendering SiteWrapper: {String(error)}
        </Alert>
        <Button onClick={() => navigate('/apphelper-wrappers')} variant="outlined" sx={{ mt: 2 }}>
          ← Back to Wrapper Components
        </Button>
      </Box>
    );
  }
}