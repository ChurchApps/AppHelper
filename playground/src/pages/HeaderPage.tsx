import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import UserContext from '../UserContext';
import { 
  Banner,
  SiteHeader,
  SiteWrapper
} from '@churchapps/apphelper';
import { 
  mockNavItems,
  mockChurch,
  mockAppearance
} from '../mockData';

function ComponentPage({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 2, mb: 2 }}>
        <Link to="/">← Back to Home</Link>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
          {title}
        </Typography>
        <ErrorBoundary>
          <Box sx={{ mt: 3 }}>
            {children}
          </Box>
        </ErrorBoundary>
      </Box>
    </Container>
  );
}

export function HeaderTestPage() {
  const context = React.useContext(UserContext);
  const [showSiteWrapper, setShowSiteWrapper] = React.useState(false);
  const [selectedHeader, setSelectedHeader] = React.useState<string | null>(null);

  const handleNavigate = (url: string) => {
    console.log('Navigation:', url);
    alert(`Would navigate to: ${url}`);
  };

  const primaryMenuItems = [
    { url: '/people', icon: 'people', label: 'People' },
    { url: '/groups', icon: 'group', label: 'Groups' },
    { url: '/events', icon: 'event', label: 'Events' },
    { url: '/reports', icon: 'assessment', label: 'Reports' }
  ];

  const secondaryMenuItems = [
    { url: '/dashboard', label: 'Dashboard' },
    { url: '/attendance', label: 'Attendance' },
    { url: '/checkin', label: 'Check-in' },
    { url: '/forms', label: 'Forms' }
  ];

  const navContent = (
    <Stack spacing={1}>
      {mockNavItems.map((item, index) => (
        <Button
          key={index}
          startIcon={<span className="material-icons">{item.icon}</span>}
          onClick={() => handleNavigate(item.url)}
          sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
        >
          {item.label}
        </Button>
      ))}
    </Stack>
  );

  return (
    <ComponentPage title="Header Components - Functional Examples">
      <Stack spacing={4}>
        <Alert severity="info">
          This page demonstrates functional header and navigation components with real interactions and proper context.
        </Alert>

        <Box>
          <Typography variant="h6" gutterBottom>Banner</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Simple banner container component that accepts children
          </Alert>
          <Paper elevation={2} sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Banner>
              <Typography variant="h5" align="center">
                Welcome to {mockChurch.name}
              </Typography>
              <Typography variant="body1" align="center" sx={{ mt: 1 }}>
                {mockChurch.address1}, {mockChurch.city}, {mockChurch.state} {mockChurch.zip}
              </Typography>
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                Visit us at {mockChurch.website}
              </Typography>
            </Banner>
          </Paper>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>SiteHeader</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Full-featured site header with primary/secondary navigation, user menu, and support drawer
          </Alert>
          <Paper elevation={2} sx={{ mb: 2 }}>
            <SiteHeader
              primaryMenuLabel="People"
              primaryMenuItems={primaryMenuItems}
              secondaryMenuLabel="Dashboard"
              secondaryMenuItems={secondaryMenuItems}
              context={context}
              appName="Playground"
              onNavigate={handleNavigate}
            />
          </Paper>
          <Alert severity="success" sx={{ mb: 2 }}>
            <strong>Features demonstrated:</strong>
            <br />• Primary dropdown menu with icons
            <br />• Secondary horizontal navigation
            <br />• User menu with profile picture
            <br />• Support drawer with help articles
            <br />• Responsive design for mobile
          </Alert>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>SiteWrapper</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Main application wrapper with collapsible navigation drawer
          </Alert>
          <Button 
            onClick={() => setShowSiteWrapper(!showSiteWrapper)}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            {showSiteWrapper ? 'Hide' : 'Show'} SiteWrapper Demo
          </Button>
          {showSiteWrapper && (
            <Paper elevation={2} sx={{ height: 400, overflow: 'hidden', position: 'relative' }}>
              <SiteWrapper
                navContent={navContent}
                context={context}
                appName="Playground"
                onNavigate={handleNavigate}
                appearance={mockAppearance}
              >
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Main Content Area
                  </Typography>
                  <Typography variant="body1" paragraph>
                    This is the main content area within the SiteWrapper.
                    The navigation drawer on the left can be collapsed/expanded.
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Current user: {context?.person?.name?.display || 'Not logged in'}
                    <br />
                    Church: {context?.userChurch?.church?.name || 'No church selected'}
                  </Typography>
                </Box>
              </SiteWrapper>
            </Paper>
          )}
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Component Information</Typography>
          <Stack spacing={2}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Banner</Typography>
              <Typography variant="body2">
                Simple container component for creating custom banners.
                Accepts children and provides a basic div with id="banner".
                Perfect for church information displays or announcements.
              </Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>SiteHeader</Typography>
              <Typography variant="body2">
                Full-featured application header with dual-level navigation.
                Includes primary dropdown menu, secondary horizontal menu, user profile menu,
                and integrated support drawer. Responsive design adapts to mobile screens.
              </Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>SiteWrapper</Typography>
              <Typography variant="body2">
                Main application layout wrapper with collapsible sidebar navigation.
                Provides consistent layout structure, handles user authentication state,
                and includes notification management and real-time updates via Socket.io.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Usage Context</Typography>
          <Alert severity="warning">
            <strong>Authentication Requirements:</strong>
            <br />• SiteHeader and SiteWrapper require user context for proper functionality
            <br />• User menu shows different options based on authentication state
            <br />• Support drawer and notifications require authenticated user
            <br />• Church branding and appearance settings come from user context
          </Alert>
        </Box>
      </Stack>
    </ComponentPage>
  );
}