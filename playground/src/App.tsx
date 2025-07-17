import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Box, Card, CardContent, Grid, Alert, Stack } from '@mui/material';
import { CookiesProvider } from 'react-cookie';
import { ErrorBoundary } from './ErrorBoundary';
import { UserProvider } from './UserContext';
import RequireAuth from './components/RequireAuth';

// Import test pages
import { ComponentsTestPage } from './pages/ComponentsPage';
import { MarkdownTestPage } from './pages/MarkdownPage';
import { WrapperTestPage } from './pages/WrapperPage';
import { DonationTestPage } from './pages/DonationPage';
import { ReportingTestPage } from './pages/ReportingPage';
import { HeaderTestPage } from './pages/HeaderPage';
import LoginPageComponent from './pages/LoginPage';

// Test imports from login package
import { 
  LoginPage, 
  Register, 
  Login, 
  Forgot, 
  LoginSetPassword,
  SelectChurchRegister,
  SelectChurchSearch
} from '@churchapps/apphelper-login';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          AppHelper Component Playground
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Test and preview all exported components from @churchapps/apphelper
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Authentication Demo:</strong> Components marked with 🔒 require login.
          <br />
          <Link to="/auth">Go to Authentication</Link> or add <code>?demo=true</code> to any URL for instant access.
        </Alert>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Login Components</Typography>
                <Typography variant="body2" color="textSecondary">
                  Authentication components from @churchapps/apphelper-login
                </Typography>
                <Link to="/login">View Components</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Core Components 🔒</Typography>
                <Typography variant="body2" color="textSecondary">
                  Basic UI components, forms, loading, buttons (Login Required)
                </Typography>
                <Link to="/components">View Components</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Markdown Components</Typography>
                <Typography variant="body2" color="textSecondary">
                  Rich text editor, preview, and markdown tools
                </Typography>
                <Link to="/markdown">View Components</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Wrapper Components 🔒</Typography>
                <Typography variant="body2" color="textSecondary">
                  Site wrapper, navigation, menus, messaging (Login Required)
                </Typography>
                <Link to="/wrapper">View Components</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Donation Components 🔒</Typography>
                <Typography variant="body2" color="textSecondary">
                  Payment forms, Stripe integration, recurring donations (Login Required)
                </Typography>
                <Link to="/donations">View Components</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Reporting Components</Typography>
                <Typography variant="body2" color="textSecondary">
                  Filters, charts, data tables, exports
                </Typography>
                <Link to="/reporting">View Components</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Header Components</Typography>
                <Typography variant="body2" color="textSecondary">
                  Site headers, banners, navigation bars
                </Typography>
                <Link to="/header">View Components</Link>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

function LoginTestPage() {
  const loginComponents = [
    { name: 'LoginPage', component: LoginPage },
    { name: 'Register', component: Register },
    { name: 'Login', component: Login },
    { name: 'Forgot', component: Forgot },
    { name: 'LoginSetPassword', component: LoginSetPassword },
    { name: 'SelectChurchRegister', component: SelectChurchRegister },
    { name: 'SelectChurchSearch', component: SelectChurchSearch }
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 2, mb: 2 }}>
        <Link to="/">← Back to Home</Link>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
          Login Components
        </Typography>
        <ErrorBoundary>
          <Box sx={{ mt: 3 }}>
            <Stack spacing={3}>
              <Alert severity="info">
                This page tests the availability of login and authentication components from @churchapps/apphelper-login.
                These components handle user authentication, registration, and church selection.
              </Alert>

              <Alert severity="warning">
                <strong>Note:</strong> These login components require specific configuration, 
                user context, and authentication setup to function properly. This page verifies import 
                availability rather than full functionality.
              </Alert>

              <Box>
                <Typography variant="h6" gutterBottom>Successfully Imported Components:</Typography>
                <Stack spacing={2}>
                  {loginComponents.map((item) => (
                    <Box key={item.name} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>{item.name}</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ✅ Component type: {typeof item.component}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ✅ Successfully imported from @churchapps/apphelper-login
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>
        </ErrorBoundary>
      </Box>
    </Container>
  );
}

function App() {
  return (
    <CookiesProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserProvider>
          <Router>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  AppHelper Component Playground
                </Typography>
              </Toolbar>
            </AppBar>
            
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<LoginPageComponent />} />
              <Route path="/login" element={<LoginTestPage />} />
              <Route path="/components" element={<RequireAuth><ComponentsTestPage /></RequireAuth>} />
              <Route path="/markdown" element={<MarkdownTestPage />} />
              <Route path="/wrapper" element={<RequireAuth><WrapperTestPage /></RequireAuth>} />
              <Route path="/donations" element={<RequireAuth><DonationTestPage /></RequireAuth>} />
              <Route path="/reporting" element={<ReportingTestPage />} />
              <Route path="/header" element={<HeaderTestPage />} />
            </Routes>
          </Router>
        </UserProvider>
      </ThemeProvider>
    </CookiesProvider>
  );
}

export default App;