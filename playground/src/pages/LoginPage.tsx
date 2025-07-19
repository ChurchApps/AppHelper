import React from 'react';
import { Container, Box, Typography, Button, Alert, Stack, Tab, Tabs } from '@mui/material';
import { Link } from 'react-router-dom';
import { LoginPage as AppHelperLoginPage } from '@churchapps/apphelper-login';
import { ApiHelper, UserHelper } from '@churchapps/apphelper';
import UserContext from '../UserContext';

function LoginPageComponent() {
  const context = React.useContext(UserContext) as any;
  const [loginMethod, setLoginMethod] = React.useState<'mock' | 'real'>('mock');
  // State removed - now handled by LoginPage component

  const handleMockLogin = () => {
    context?.mockLogin();
  };

  // Removed - now handled by LoginPage component

  const testApiConnection = async () => {
    console.log("Testing API connection...");
    console.log("Current URL:", window.location.href);
    console.log("URL Search params:", window.location.search);
    console.log("API Configs:", ApiHelper.apiConfigs);
    
    try {
      const config = ApiHelper.getConfig("MembershipApi");
      console.log("MembershipApi config:", config);
      
      if (!config) {
        console.error("MembershipApi config not found!");
        return;
      }
      
      // Test a simple API call
      const response = await fetch(config.url + "/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "wrongpassword"
        })
      });
      
      console.log("API response status:", response.status);
      const data = await response.text();
      console.log("API response:", data);
      
    } catch (error) {
      console.error("API test failed:", error);
    }
  };

  const handleMockLogout = () => {
    context?.mockLogout();
  };

  // Removed - now handled by LoginPage component

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

        <Box sx={{ width: '100%', mb: 3 }}>
          <Tabs 
            value={loginMethod} 
            onChange={(_, value) => setLoginMethod(value)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Mock Login" value="mock" />
            <Tab label="Real Login" value="real" />
          </Tabs>
        </Box>

        {loginMethod === 'mock' && (
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
          </Stack>
        )}

        {loginMethod === 'real' && (
          <Box sx={{ width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Real Login via MembershipAPI
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Connect to the actual MembershipAPI at https://membershipapi.staging.churchapps.org
            </Typography>
            
            <Box>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                Debug: URL = {window.location.href}
              </Typography>
                <AppHelperLoginPage
                  context={context}
                  jwt=""
                  auth=""
                  appName="AppHelper Playground"
                  appUrl={window.location.origin}
                  returnUrl="/"
                  loginSuccessOverride={() => {
                    // Show alert with user and church info from UserHelper
                    const userName = UserHelper.currentUserChurch?.person?.name?.display || 
                                   (UserHelper.user?.firstName && UserHelper.user?.lastName ? 
                                    `${UserHelper.user.firstName} ${UserHelper.user.lastName}` : 
                                    UserHelper.user?.email || 'Unknown User');
                    const churchName = UserHelper.currentUserChurch?.church?.name || 'Unknown Church';
                    
                    alert(`Login Successful!\n\nUser: ${userName}\nChurch: ${churchName}`);
                    
                    // Reset the login form to show it again
                    window.location.reload();
                  }}
                  showLogo={false}
                  loginContainerCssProps={{
                    style: {
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      border: 'none'
                    }
                  }}
                  handleRedirect={(url: string) => {
                    // Check if this is a church selection redirect
                    if (url.includes('/church/')) {
                      // Extract church ID from URL pattern /church/{churchId}
                      const churchId = url.split('/church/')[1];
                      
                      // Find the selected church
                      const selectedChurch = context.userChurches?.find(uc => uc.church.id === churchId);
                      if (selectedChurch) {
                        // Show alert with church details
                        alert(`Church Selected:\n\nName: ${selectedChurch.church.name}\nID: ${selectedChurch.church.id}\nAddress: ${selectedChurch.church.address1 || 'N/A'}\nCity: ${selectedChurch.church.city || 'N/A'}, ${selectedChurch.church.state || 'N/A'}`);
                      }
                      
                      // Don't actually redirect, just close modal and return to page
                      window.location.reload();
                    } else {
                      // For other redirects, follow normal behavior
                      window.location.href = url;
                    }
                  }}
                />
            </Box>
            
            {/* Debug information */}
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                Debug: Check browser console for API configuration details
              </Typography>
              <Button 
                size="small" 
                variant="outlined" 
                onClick={testApiConnection}
                sx={{ fontSize: '0.75rem' }}
              >
                Test API Connection
              </Button>
            </Box>
          </Box>
        )}

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