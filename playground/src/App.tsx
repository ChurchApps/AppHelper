import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Box, Card, CardContent, Grid, Alert, Stack, Button } from '@mui/material';
import { CookiesProvider } from 'react-cookie';
import { ErrorBoundary } from './ErrorBoundary';
import UserContext, { UserProvider } from './UserContext';
import RequireAuth from './components/RequireAuth';

// Import test pages
import { ComponentsTestPage } from './pages/ComponentsPage';
import { MarkdownTestPage } from './pages/MarkdownPage';
import WrapperTestPage from './pages/WrapperPage';
import DonationTestPage from './pages/DonationPage';
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
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);
  const [mockEmail, setMockEmail] = React.useState('demo@churchapps.org');
  const [mockPassword, setMockPassword] = React.useState('password');
  const context = React.useContext(UserContext) as any;

  const loginComponents = [
    { 
      name: 'LoginPage', 
      component: LoginPage, 
      description: 'Complete login page with integrated authentication flow',
      props: {
        auth: {
          loginUser: (email: string, password: string) => {
            console.log('Mock login:', email, password);
            return Promise.resolve({ user: { email }, jwt: 'mock-jwt-token' });
          },
          selectChurch: (churchId: string) => {
            console.log('Mock church selection:', churchId);
            return Promise.resolve({ church: { id: churchId, name: 'Mock Church' } });
          }
        },
        context: context,
        jwt: 'mock-jwt-token',
        appName: 'Playground',
        returnUrl: '/',
        handleRedirect: (url: string) => {
          console.log('Redirect to:', url);
          alert(`Would redirect to: ${url}`);
        },
        defaultEmail: mockEmail,
        defaultPassword: mockPassword
      }
    },
    { 
      name: 'Login', 
      component: Login,
      description: 'Basic login form component',
      props: {
        login: (data: any) => {
          console.log('Mock login:', data);
          alert(`Mock login with email: ${data.email}`);
        },
        isSubmitting: false,
        setShowRegister: (show: boolean) => {
          console.log('Show register:', show);
          alert(`Would show register: ${show}`);
        },
        setShowForgot: (show: boolean) => {
          console.log('Show forgot:', show);
          alert(`Would show forgot: ${show}`);
        },
        setErrors: (errors: string[]) => {
          console.log('Validation errors:', errors);
          if (errors.length > 0) {
            alert(`Validation errors: ${errors.join(', ')}`);
          }
        },
        defaultEmail: mockEmail,
        defaultPassword: mockPassword
      }
    },
    { 
      name: 'Register', 
      component: Register,
      description: 'User registration form component',
      props: {
        auth: {
          registerUser: (userData: any) => {
            console.log('Mock registration:', userData);
            return Promise.resolve({ user: userData, jwt: 'mock-jwt-token' });
          }
        },
        context: context,
        jwt: 'mock-jwt-token',
        appName: 'Playground',
        returnUrl: '/',
        handleRedirect: (url: string) => {
          console.log('Redirect to:', url);
          alert(`Would redirect to: ${url}`);
        }
      }
    },
    { 
      name: 'Forgot', 
      component: Forgot,
      description: 'Forgot password form component',
      props: {
        auth: {
          forgotPassword: (email: string) => {
            console.log('Mock forgot password:', email);
            return Promise.resolve({ success: true });
          }
        },
        context: context,
        jwt: 'mock-jwt-token',
        appName: 'Playground',
        returnUrl: '/',
        handleRedirect: (url: string) => {
          console.log('Redirect to:', url);
          alert(`Would redirect to: ${url}`);
        }
      }
    },
    { 
      name: 'LoginSetPassword', 
      component: LoginSetPassword,
      description: 'Set password for new users',
      props: {
        auth: {
          setPassword: (password: string) => {
            console.log('Mock set password:', password);
            return Promise.resolve({ success: true });
          }
        },
        context: context,
        jwt: 'mock-jwt-token',
        appName: 'Playground',
        returnUrl: '/',
        handleRedirect: (url: string) => {
          console.log('Redirect to:', url);
          alert(`Would redirect to: ${url}`);
        }
      }
    },
    { 
      name: 'SelectChurchRegister', 
      component: SelectChurchRegister,
      description: 'Church selection during registration',
      props: {
        initialChurchName: 'Sample Church',
        appName: 'Playground',
        selectChurch: (churchId: string) => {
          console.log('Church selected:', churchId);
          alert(`Church selected: ${churchId}`);
        },
        registeredChurchCallback: (church: any) => {
          console.log('Church registered:', church);
          alert(`Church registered: ${church.name}`);
        }
      },
      wrapperStyle: {
        '& .MuiTextField-root': { marginBottom: 2 },
        '& .MuiFormControl-root': { marginBottom: 2 },
        '& button[type="submit"]:empty::after': { content: '"Register"' },
        '& .MuiButton-root.MuiButton-containedPrimary:empty::after': { content: '"Register"' }
      }
    },
    { 
      name: 'SelectChurchSearch', 
      component: SelectChurchSearch,
      description: 'Church search component',
      props: {
        appName: 'Playground',
        selectChurch: (churchId: string) => {
          console.log('Church selected:', churchId);
          alert(`Church selected: ${churchId}`);
        },
        includeRegister: true
      }
    }
  ];

  const renderComponent = (item: any) => {
    const Component = item.component;
    console.log('Rendering component:', item.name, 'with props:', item.props);
    return (
      <ErrorBoundary>
        <Box sx={{ 
          border: 1, 
          borderColor: 'divider', 
          borderRadius: 1, 
          p: 2, 
          minHeight: 400,
          ...(item.wrapperStyle || {})
        }}>
          <Component {...item.props} />
          {/* Add CSS fix for missing button labels and spacing */}
          {item.name === 'SelectChurchRegister' && (
            <style>{`
              .custom-context-box .MuiTextField-root,
              .custom-context-box .MuiFormControl-root {
                margin-bottom: 16px !important;
              }
              
              .MuiButton-containedPrimary:empty::after,
              button[type="submit"]:empty::after {
                content: "Register";
              }
              
              /* Fix Grid spacing */
              .MuiGrid2-root {
                row-gap: 16px;
              }
              
              /* Fix TextField label positioning to prevent cutoff */
              .MuiOutlinedInput-root .MuiInputLabel-root {
                transform: translate(14px, -6px) scale(0.75) !important;
              }
              
              .MuiOutlinedInput-root .MuiInputLabel-root.MuiInputLabel-shrink {
                transform: translate(14px, -9px) scale(0.75) !important;
              }
              
              /* Alternative fix: Add padding to the notched outline */
              .MuiOutlinedInput-notchedOutline {
                padding-top: 2px;
              }
              
              /* Ensure proper spacing for the label background */
              .MuiInputLabel-root.MuiInputLabel-shrink {
                background-color: white;
                padding: 0 4px;
              }
            `}</style>
          )}
        </Box>
      </ErrorBoundary>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2, mb: 2 }}>
        <Link to="/">← Back to Home</Link>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
          Login Components - Functional Examples
        </Typography>
        <ErrorBoundary>
          <Box sx={{ mt: 3 }}>
            <Stack spacing={4}>
              <Alert severity="info">
                This page demonstrates functional login and authentication components with mock authentication services.
                Each component is interactive and shows real form behavior.
              </Alert>

              <Box>
                <Typography variant="h6" gutterBottom>Demo Credentials</Typography>
                <Alert severity="success" sx={{ mb: 2 }}>
                  <strong>Test Login:</strong> Email: {mockEmail}, Password: {mockPassword}
                  <br />
                  These credentials are pre-filled in the login forms for easy testing.
                </Alert>
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="outlined" 
                    onClick={() => { setMockEmail('admin@example.com'); setMockPassword('admin123'); }}
                  >
                    Use Admin Credentials
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => { setMockEmail('demo@churchapps.org'); setMockPassword('password'); }}
                  >
                    Use Demo Credentials
                  </Button>
                </Stack>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>Component Selection</Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {loginComponents.map((item) => (
                    <Button
                      key={item.name}
                      variant={selectedComponent === item.name ? 'contained' : 'outlined'}
                      onClick={() => {
                        console.log('Clicking button:', item.name, 'current selected:', selectedComponent);
                        setSelectedComponent(selectedComponent === item.name ? null : item.name);
                      }}
                      size="small"
                    >
                      {item.name}
                    </Button>
                  ))}
                </Stack>
              </Box>

              {selectedComponent && (
                <Box>
                  {/* Don't show duplicate title for components that have their own headers */}
                  {!['Register', 'LoginPage', 'Forgot', 'LoginSetPassword'].includes(selectedComponent) && (
                    <Typography variant="h6" gutterBottom>
                      {selectedComponent} Component
                    </Typography>
                  )}
                  <Alert severity="info" sx={{ mb: 2 }}>
                    {loginComponents.find(c => c.name === selectedComponent)?.description}
                  </Alert>
                  {renderComponent(loginComponents.find(c => c.name === selectedComponent))}
                </Box>
              )}

              <Box>
                <Typography variant="h6" gutterBottom>Component Information</Typography>
                <Stack spacing={2}>
                  {loginComponents.map((item) => (
                    <Box key={item.name} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        <strong>{item.name}</strong>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.description}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        ✅ Component type: {typeof item.component}
                        <br />
                        ✅ Successfully imported from @churchapps/apphelper-login
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom>Authentication Mock Services</Typography>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <strong>Note:</strong> These components use mock authentication services.
                  In production, they would connect to real authentication APIs.
                </Alert>
                <Stack spacing={2}>
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Mock Services Provided:</Typography>
                    <Typography variant="body2">
                      • loginUser(email, password) - Mock login authentication
                      <br />
                      • registerUser(userData) - Mock user registration
                      <br />
                      • forgotPassword(email) - Mock password reset
                      <br />
                      • setPassword(password) - Mock password setting
                      <br />
                      • searchChurches(query) - Mock church search
                      <br />
                      • selectChurch(churchId) - Mock church selection
                    </Typography>
                  </Box>
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