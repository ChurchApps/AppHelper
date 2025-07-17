import React from 'react';
import { Container, Box, Typography, Button, Alert, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

function LoginPageComponent() {
  const context = React.useContext(UserContext) as any;
  const [loginMethod, setLoginMethod] = React.useState<'mock' | 'component'>('mock');

  const handleMockLogin = () => {
    context?.mockLogin();
  };

  const handleMockLogout = () => {
    context?.mockLogout();
  };

  // If user is already logged in, show logout option
  if (context?.user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Welcome to AppHelper Playground
          </Typography>
          
          <Alert severity="success" sx={{ mb: 3, width: '100%' }}>
            <strong>You are logged in as:</strong>
            <br />
            Name: {context.person?.name?.display}
            <br />
            Email: {context.person?.contactInfo?.email}
            <br />
            Church: {context.userChurch?.church?.name}
          </Alert>

          <Stack spacing={2} sx={{ width: '100%' }}>
            <Button 
              component={Link} 
              to="/" 
              variant="contained" 
              color="primary" 
              fullWidth
              size="large"
            >
              Go to Playground
            </Button>
            
            <Button 
              onClick={handleMockLogout}
              variant="outlined" 
              color="secondary" 
              fullWidth
              size="large"
            >
              Logout
            </Button>
          </Stack>
        </Box>
      </Container>
    );
  }

  // Show login options
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" gutterBottom>
          AppHelper Playground Login
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3, width: '100%' }}>
          <strong>Demo Authentication</strong>
          <br />
          This playground demonstrates how AppHelper components work with authentication.
          Choose a login method below to test authenticated components.
        </Alert>

        <Stack spacing={3} sx={{ width: '100%' }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Mock Login (Recommended)
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Instantly login with pre-configured mock data to test all components.
            </Typography>
            <Button 
              onClick={handleMockLogin}
              variant="contained" 
              color="primary" 
              fullWidth
              size="large"
            >
              Login with Mock Data
            </Button>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              AppHelper LoginPage Component
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Test the actual LoginPage component from @churchapps/apphelper-login.
              Note: This requires proper API configuration.
            </Typography>
            <Button 
              onClick={() => setLoginMethod('component')}
              variant="outlined" 
              color="secondary" 
              fullWidth
              size="large"
              disabled
            >
              Use LoginPage Component (Coming Soon)
            </Button>
          </Box>
        </Stack>

        <Box sx={{ mt: 4, width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Demo URLs
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>Quick Access:</strong>
            <br />
            Add <code>?demo=true</code> to any URL to automatically login
            <br />
            Example: <code>http://localhost:3000/?demo=true</code>
          </Alert>
        </Box>

        <Box sx={{ mt: 3, width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Understanding Authentication
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Many AppHelper components require user authentication to function properly.
            Components like Notes, UserMenu, SupportModal, and donation forms need:
          </Typography>
          <ul style={{ marginTop: 8, paddingLeft: 16 }}>
            <li>User context with person and church information</li>
            <li>Permissions for accessing specific features</li>
            <li>API authentication for server communication</li>
          </ul>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPageComponent;