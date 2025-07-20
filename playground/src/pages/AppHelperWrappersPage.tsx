import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button, Card, CardContent } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';

function ComponentPage({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <Container maxWidth="lg">
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

export default function AppHelperWrappersPage() {
  const navigate = useNavigate();

  return (
    <ComponentPage title="@churchapps/apphelper - SiteWrapper Component">
      <Stack spacing={4}>
        <Alert severity="info">
          <strong>SiteWrapper from @churchapps/apphelper Package</strong>
          <br />
          The main application shell component that provides navigation drawer, user authentication context, and notification system.
        </Alert>

        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              SiteWrapper Component
            </Typography>
            
            <Typography variant="body1" paragraph>
              SiteWrapper is the primary layout component that wraps entire ChurchApps applications. It provides:
            </Typography>
            
            <Box component="ul" sx={{ pl: 3 }}>
              <li>Responsive navigation drawer with menu items</li>
              <li>User authentication context integration</li>
              <li>Church selection and switching</li>
              <li>Notification system with real-time updates</li>
              <li>Theme customization support</li>
              <li>Mobile-friendly responsive design</li>
              <li>User menu with profile and settings</li>
            </Box>

            <Alert severity="success" sx={{ mt: 2, mb: 3 }}>
              <strong>Live Demo Available!</strong>
              <br />
              Click the button below to see a fully functional SiteWrapper in action.
            </Alert>

            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/sitewrapper-demo')}
              sx={{ mt: 2 }}
            >
              View SiteWrapper Demo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Implementation Details</Typography>
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Required Props:</Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <li><code>navContent</code>: React element containing navigation items</li>
              <li><code>context</code>: UserContextInterface with user, church, and auth data</li>
              <li><code>appName</code>: Name of the application</li>
              <li><code>onNavigate</code>: Callback function for navigation events</li>
              <li><code>children</code>: Main content to render</li>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Optional Props:</Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              <li><code>appearance</code>: Theme customization object</li>
              <li><code>omitOverflow</code>: Boolean to control overflow behavior</li>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Usage Example</Typography>
            
            <Box sx={{ 
              backgroundColor: '#f5f5f5', 
              p: 2, 
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              overflow: 'auto'
            }}>
              <pre style={{ margin: 0 }}>{`<SiteWrapper
  navContent={
    <List>
      <NavItem url="/" label="Dashboard" icon="dashboard" />
      <NavItem url="/people" label="People" icon="people" />
      <NavItem url="/groups" label="Groups" icon="group" />
    </List>
  }
  context={userContext}
  appName="Church Management"
  onNavigate={(url) => navigate(url)}
  appearance={{
    primaryColor: '#1976d2',
    wrapperBackground: '#333333'
  }}
>
  {/* Your main app content */}
  <YourAppContent />
</SiteWrapper>`}</pre>
            </Box>
          </CardContent>
        </Card>

        <Alert severity="warning">
          <strong>Context Requirements</strong>
          <br />
          SiteWrapper requires extensive React context setup including:
          <br />• UserContext with authentication state
          <br />• API configurations for notifications
          <br />• Church and user data structures
          <br />• Permission and role information
        </Alert>
      </Stack>
    </ComponentPage>
  );
}