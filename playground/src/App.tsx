import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box, Card, CardContent, Grid, Alert, Stack } from '@mui/material';
import { CookiesProvider } from 'react-cookie';
import UserContext, { UserProvider } from './UserContext';
import RequireAuth from './components/RequireAuth';
import { SiteHeader, PageHeader } from '@churchapps/apphelper';
import HomeIcon from '@mui/icons-material/Home';
import '@churchapps/apphelper-markdown/dist/components/markdownEditor/editor.css';

// Import test pages
import { ComponentsTestPage } from './pages/ComponentsPage';
import { MarkdownTestPage } from './pages/MarkdownPage';
import DonationTestPage from './pages/DonationPage';
import { ReportingTestPage } from './pages/ReportingPage';
import LoginPageComponent from './pages/LoginPage';

// Import new package-based pages
import AppHelperHelpersPage from './pages/AppHelperHelpersPage';
import AppHelperComponentsPage from './pages/AppHelperComponentsPage';
import AppHelperWrappersPage from './pages/AppHelperWrappersPage';
import AppHelperNotesPage from './pages/AppHelperNotesPage';
import AppHelperReportingPage from './pages/AppHelperReportingPage';
import AppHelperHeadersPage from './pages/AppHelperHeadersPage';
import AppHelperHooksPage from './pages/AppHelperHooksPage';
import LoginComponentsPage from './pages/LoginComponentsPage';
import FormsComponentsPage from './pages/FormsComponentsPage';
import MarkdownComponentsPage from './pages/MarkdownComponentsPage';
import { HtmlComponentsPage } from './pages/HtmlComponentsPage';
import WebsiteComponentsPage from './pages/WebsiteComponentsPage';
import ModernLayoutPage from './pages/ModernLayoutPage';
import PrivateMessageTestPage from './pages/PrivateMessageTestPage';
import WebSocketTestPage from './pages/WebSocketTestPage';
// import MessagingTestPage from './pages/MessagingTestPage';


const theme = createTheme({
  palette: {
    mode: 'light',
    InputBox: { headerText: '#333333' },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
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
        
        <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
          Component Packages
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Organized by npm package for comprehensive coverage based on apphelper-usage-report.md
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary">@churchapps/apphelper</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Core package with 48 components: Helpers, UI Components, Modern Layout, Notes, Reporting, Hooks
                </Typography>
                <Stack spacing={1}>
                  <Link to="/apphelper-helpers">Helpers (Re-exported & Local)</Link>
                  <Link to="/apphelper-components">Core Components</Link>
                  <Link to="/modern-layout">Modern Layout (SiteHeader + PageHeader)</Link>
                  <Link to="/private-message-test">🔧 WebSocket & Private Message Testing</Link>
                  <Link to="/apphelper-wrappers">Wrapper Components 🔒</Link>
                  {/* <Link to="/messaging-test">Messaging & Notifications Test 🔒</Link> */}
                  <Link to="/apphelper-notes">Notes Components 🔒</Link>
                  <Link to="/apphelper-reporting">Reporting Components</Link>
                  <Link to="/apphelper-hooks">Hooks</Link>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary">@churchapps/apphelper-login</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Authentication package with 10 components: Login forms, registration, password reset, church selection
                </Typography>
                <Stack spacing={1}>
                  <Link to="/login-components">All Login Components</Link>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary">@churchapps/apphelper-forms</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Form components package with input handling, validation, and submission capabilities
                </Typography>
                <Stack spacing={1}>
                  <Link to="/forms-components">All Form Components</Link>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary">@churchapps/apphelper-donations</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Multi-gateway donation package with Stripe + PayPal support: Payment forms, recurring donations, fund management 🔒
                </Typography>
                <Stack spacing={1}>
                  <Link to="/donations">All Donation Components</Link>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary">@churchapps/apphelper-markdown</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Lexical rich text package with 6 components: Markdown editors with previews, HTML editor with modal
                </Typography>
                <Stack spacing={1}>
                  <Link to="/markdown-components">Markdown Components</Link>
                  <Link to="/html-components">HTML Components</Link>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" color="primary">@churchapps/apphelper-website</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Website element components for building dynamic church websites
                </Typography>
                <Stack spacing={1}>
                  <Link to="/website-components">Website Components</Link>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
      </Box>
    </Container>
  );
}


function AppContent() {
  const context = React.useContext(UserContext);
  
  // Create context for SiteHeader - use demo only when explicitly requested
  const effectiveContext = React.useMemo(() => {
    // Check if demo mode is requested via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const isDemoMode = urlParams.get('demo') === 'true';
    
    // If user is logged in, use real context
    if (context?.user) {
      return context;
    }
    
    // If demo mode is requested, provide mock context
    if (isDemoMode) {
      return {
        user: { 
          id: 'demo-user', 
          firstName: 'Demo', 
          lastName: 'User', 
          email: 'demo@churchapps.org' 
        },
        person: { 
          id: 'demo-person', 
          name: { display: 'Demo User' },
          contactInfo: { email: 'demo@churchapps.org' },
          photo: undefined
        },
        userChurch: {
          church: { 
            id: 'demo-church', 
            name: 'AppHelper Playground',
            address: { city: 'Demo City', state: 'DS' }
          },
          person: { 
            id: 'demo-person', 
            roles: [],
            name: { display: 'Demo User' },
            contactInfo: { email: 'demo@churchapps.org' }
          },
          apis: [],
          jwt: 'mock-jwt',
          groups: []
        },
        userChurches: [
          { 
            church: { 
              id: 'demo-church', 
              name: 'AppHelper Playground',
              address: { city: 'Demo City', state: 'DS' }
            },
            person: { 
              id: 'demo-person', 
              roles: [],
              name: { display: 'Demo User' },
              contactInfo: { email: 'demo@churchapps.org' }
            },
            apis: [],
            jwt: 'mock-jwt',
            groups: []
          }
        ],
        logout: () => {
          console.log('Logout called');
        },
        setUser: () => {},
        setPerson: () => {},
        setUserChurch: () => {},
        setUserChurches: () => {}
      };
    }
    
    // Otherwise, return a context with empty but valid structure
    return context || {
      user: {
        id: '',
        email: '',
        firstName: '',
        lastName: ''
      },
      person: {
        id: '',
        name: { display: '' },
        contactInfo: { email: '' }
      },
      userChurch: {
        person: {
          id: '',
          name: { display: '' },
          contactInfo: { email: '' }
        },
        church: {
          id: '',
          name: '',
          address: { city: '', state: '' }
        },
        apis: [],
        jwt: '',
        groups: []
      },
      userChurches: [],
      setUser: () => {},
      setPerson: () => {},
      setUserChurch: () => {},
      setUserChurches: () => {}
    };
  }, [context]);

  const handleNavigate = (url: string) => {
    console.log('Navigation:', url);
    // Handle navigation for playground
    if (url.startsWith('/')) {
      // Use React Router navigate for internal URLs
      window.location.href = url;
    } else {
      // External URLs
      window.open(url, '_blank');
    }
  };

  const primaryMenuItems = [
    { url: '/', icon: 'home', label: 'Home' },
    { url: '/apphelper-components', icon: 'widgets', label: 'AppHelper' },
    { url: '/login-components', icon: 'login', label: 'Login' },
    { url: '/forms-components', icon: 'assignment', label: 'Forms' },
    { url: '/donations', icon: 'attach_money', label: 'Donations' },
    { url: '/markdown-components', icon: 'edit_note', label: 'Markdown' },
    { url: '/website-components', icon: 'language', label: 'Website' },
    { url: '/apphelper-reporting', icon: 'analytics', label: 'Reporting' }
  ];

  // Secondary menu items change based on current section
  const getSecondaryMenuItems = () => {
    const path = window.location.pathname;
    
    if (path.startsWith('/apphelper') || path.startsWith('/messaging') || path.startsWith('/private-message')) {
      return [
        { url: '/apphelper-components', label: 'Components' },
        { url: '/apphelper-wrappers', label: 'Wrappers' },
        { url: '/private-message-test', label: 'WebSocket Test' },
        { url: '/websocket-test', label: 'Simple WebSocket Test' },
        { url: '/messaging-test', label: 'Messaging Test' },
        { url: '/apphelper-headers', label: 'Headers' },
        { url: '/apphelper-notes', label: 'Notes' },
        { url: '/apphelper-helpers', label: 'Helpers' },
        { url: '/apphelper-hooks', label: 'Hooks' }
      ];
    } else if (path.startsWith('/login')) {
      return [
        { url: '/login-components', label: 'Login Components' },
        { url: '/auth', label: 'Test Login' }
      ];
    } else if (path.startsWith('/forms')) {
      return [
        { url: '/forms-components', label: 'Form Components' }
      ];
    } else if (path.startsWith('/donation')) {
      return [
        { url: '/donations', label: 'Multi-Gateway Donations' },
      ];
    } else if (path.startsWith('/markdown') || path.startsWith('/html')) {
      return [
        { url: '/markdown-components', label: 'Markdown Editor' },
        { url: '/html-components', label: 'HTML Editor' },
        { url: '/markdown', label: 'Test Editor (Legacy)' }
      ];
    } else {
      // Default/Home secondary menu
      return [
        { url: '/modern-layout', label: 'Modern Layout Demo' },
        { url: '/websocket-test', label: 'Simple WebSocket Test' },
        { url: '/private-message-test', label: 'WebSocket Test' },
        { url: '/components', label: 'Legacy Components Test' },
        { url: '/reporting', label: 'Legacy Reporting Test' }
      ];
    }
  };;
  
  const secondaryMenuItems = getSecondaryMenuItems();

  return (
    <>
      <SiteHeader
        primaryMenuLabel="Packages"
        primaryMenuItems={primaryMenuItems}
        secondaryMenuLabel="Test Pages"
        secondaryMenuItems={secondaryMenuItems}
        context={effectiveContext}
        appName="PLAYGROUND"
        onNavigate={handleNavigate}
      />
      <PageHeader
        icon={<HomeIcon />}
        title="AppHelper Component Playground"
        subtitle="Test and preview all exported components from @churchapps/apphelper"
      />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<LoginPageComponent />} />
        
        {/* Package-based organization */}
        <Route path="/apphelper-helpers" element={<AppHelperHelpersPage />} />
        <Route path="/apphelper-components" element={<AppHelperComponentsPage />} />
        <Route path="/apphelper-wrappers" element={<RequireAuth><AppHelperWrappersPage /></RequireAuth>} />
        {/* <Route path="/messaging-test" element={<RequireAuth><MessagingTestPage /></RequireAuth>} /> */}
        <Route path="/apphelper-notes" element={<RequireAuth><AppHelperNotesPage /></RequireAuth>} />
        <Route path="/apphelper-reporting" element={<AppHelperReportingPage />} />
        <Route path="/apphelper-headers" element={<AppHelperHeadersPage />} />
        <Route path="/apphelper-hooks" element={<AppHelperHooksPage />} />
        <Route path="/login-components" element={<LoginComponentsPage />} />
        <Route path="/donations" element={<DonationTestPage />} />
        <Route path="/forms-components" element={<FormsComponentsPage />} />
        <Route path="/markdown-components" element={<MarkdownComponentsPage />} />
        <Route path="/html-components" element={<HtmlComponentsPage />} />
        <Route path="/website-components" element={<WebsiteComponentsPage />} />
        
        {/* Modern Layout demo combining SiteHeader + PageHeader */}
        <Route path="/modern-layout" element={<ModernLayoutPage />} />
        <Route path="/private-message-test" element={<PrivateMessageTestPage />} />
        <Route path="/websocket-test" element={<WebSocketTestPage />} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/login" element={<LoginPageComponent />} />
        <Route path="/components" element={<RequireAuth><ComponentsTestPage /></RequireAuth>} />
        <Route path="/markdown" element={<MarkdownTestPage />} />
        <Route path="/legacy-donations" element={<RequireAuth><DonationTestPage /></RequireAuth>} />
        <Route path="/reporting" element={<ReportingTestPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <CookiesProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <UserProvider>
          <Router>
            <AppContent />
          </Router>
        </UserProvider>
      </ThemeProvider>
    </CookiesProvider>
  );
}

export default App;
