import React from 'react';
import { Typography, Box, Alert, List, Button, Card, CardContent } from '@mui/material';
import { SiteWrapper, NavItem, UserHelper, Locale } from '@churchapps/apphelper';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import { ErrorBoundary } from '../ErrorBoundary';
import Icon from '@mui/material/Icon';

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

  // Demo content for selected tab with localized labels
  const renderDemoContent = () => {
    const contentMap: { [key: string]: { title: string, icon: string, description: string } } = {
      dashboard: { 
        title: getLabel('wrapper.dash', 'Dashboard'), 
        icon: 'dashboard', 
        description: getLabel('wrapper.dashDescription', 'Welcome to the dashboard! This is where you would see an overview of your church data, recent activities, and quick stats.') 
      },
      people: { 
        title: getLabel('wrapper.ppl', 'People'), 
        icon: 'people', 
        description: getLabel('wrapper.pplDescription', 'Manage your church members, visitors, and contacts. Add new people, update information, and track engagement.') 
      },
      groups: { 
        title: getLabel('wrapper.groups', 'Groups'), 
        icon: 'group', 
        description: getLabel('wrapper.groupsDescription', 'Organize and manage small groups, ministries, and teams. Track attendance and member participation.') 
      },
      attendance: { 
        title: getLabel('wrapper.att', 'Attendance'), 
        icon: 'event_available', 
        description: getLabel('wrapper.attDescription', 'Record and analyze attendance for services, events, and groups. View trends and generate reports.') 
      },
      donations: { 
        title: getLabel('wrapper.don', 'Donations'), 
        icon: 'volunteer_activism', 
        description: getLabel('wrapper.donDescription', 'Process donations, manage funds, track giving trends, and generate contribution statements.') 
      },
      forms: { 
        title: getLabel('wrapper.form', 'Forms'), 
        icon: 'description', 
        description: getLabel('wrapper.formDescription', 'Create and manage forms for events, registrations, surveys, and data collection.') 
      },
      reports: { 
        title: getLabel('wrapper.reports', 'Reports'), 
        icon: 'assessment', 
        description: getLabel('wrapper.reportsDescription', 'Generate various reports for attendance, giving, membership, and more. Export data for analysis.') 
      },
      settings: { 
        title: getLabel('wrapper.set', 'Settings'), 
        icon: 'settings', 
        description: getLabel('wrapper.setDescription', 'Configure church settings, manage users and permissions, customize appearance, and set up integrations.') 
      }
    };

    const content = contentMap[selectedTab] || contentMap.dashboard;

    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Icon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }}>{content.icon}</Icon>
          <Typography variant="h4">{content.title}</Typography>
        </Box>
        
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="body1" paragraph>
              {content.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This is a demo content area. In a real application, this would show the actual {content.title.toLowerCase()} interface.
            </Typography>
          </CardContent>
        </Card>

        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>SiteWrapper Features Demonstrated:</strong>
          <br />• Responsive navigation drawer (click menu icon to toggle)
          <br />• User menu with profile and church switching
          <br />• Notification system integration
          <br />• Theme customization support
          <br />• Mobile-friendly responsive design
        </Alert>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={() => alert(`${getLabel('common.save', 'Save')} ${content.title}`)}>
            {getLabel('common.save', 'Save')}
          </Button>
          <Button variant="outlined" onClick={() => alert(`${getLabel('common.edit', 'Edit')} ${content.title}`)}>
            {getLabel('common.edit', 'Edit')}
          </Button>
          <Button variant="outlined" onClick={() => alert(`${getLabel('common.add', 'Add')} ${content.title}`)}>
            {getLabel('common.add', 'Add')}
          </Button>
        </Box>
      </Box>
    );
  };


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
          <Box sx={{ p: 2 }}>
            <Alert severity={context?.user ? 'success' : 'info'} sx={{ mb: 3 }}>
              <strong>{getLabel('wrapper.demo', 'SiteWrapper Demo')}</strong>
              <br />
              {context?.user 
                ? (() => {
                    const template = getLabel('wrapper.loggedInAs', 'Logged in as {name} - Full authentication features available');
                    const userName = context.person?.name?.display || context.user.email || 'Unknown User';
                    return template.replace('{name}', userName);
                  })()
                : getLabel('wrapper.usingMockData', 'Using mock data for demonstration - Login for full functionality')
              }
            </Alert>
            
            {renderDemoContent()}
            
            <Box sx={{ mt: 4 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/apphelper-wrappers')}
              >
                ← {getLabel('common.back', 'Back')} to {getLabel('wrapper.components', 'Wrapper Components')}
              </Button>
            </Box>
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