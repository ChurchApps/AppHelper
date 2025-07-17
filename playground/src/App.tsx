import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Box, Card, CardContent, Grid, Alert, Stack } from '@mui/material';
import { CookiesProvider, useCookies } from 'react-cookie';
import { ErrorBoundary } from './ErrorBoundary';
import { UserProvider } from './UserContext';
import UserContext from './UserContext';

// Import login components
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
          AppHelper Login Components Playground
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Test and preview all login components with proper implementations
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">LoginPage (Full)</Typography>
                <Typography variant="body2" color="textSecondary">
                  Complete login page with tabs, registration, forgot password
                </Typography>
                <Link to="/login-full">View Component</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Login Form Only</Typography>
                <Typography variant="body2" color="textSecondary">
                  Simple login form component
                </Typography>
                <Link to="/login-form">View Component</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Register Form</Typography>
                <Typography variant="body2" color="textSecondary">
                  User registration component
                </Typography>
                <Link to="/register-form">View Component</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Forgot Password</Typography>
                <Typography variant="body2" color="textSecondary">
                  Password recovery form
                </Typography>
                <Link to="/forgot">View Component</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Set Password</Typography>
                <Typography variant="body2" color="textSecondary">
                  Set new password form (with mock JWT)
                </Typography>
                <Link to="/set-password?jwt=mock-jwt-token&auth=reset">View Component</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Church Selection</Typography>
                <Typography variant="body2" color="textSecondary">
                  Church search and registration
                </Typography>
                <Link to="/church-selection">View Components</Link>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

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

function FullLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const context = React.useContext(UserContext);
  const [cookies] = useCookies(["jwt"]);
  const [errors] = React.useState<string[]>([]);

  const search = new URLSearchParams(window.location.search);
  const returnUrl = search.get("returnUrl") || location.state?.from?.pathname || "/";

  const handleRedirect = (url: string) => { 
    console.log('Redirecting to:', url);
    navigate(url); 
  };

  let jwt = search.get("jwt") || cookies.jwt || "";
  let auth = search.get("auth") || "";

  return (
    <>
      <LoginPage
        auth={auth}
        context={context}
        jwt={jwt}
        appName="Playground"
        appUrl={window.location.href}
        callbackErrors={errors}
        returnUrl={returnUrl}
        handleRedirect={handleRedirect}
        defaultEmail="demo@test.com"
        defaultPassword="password"
      />
    </>
  );
}

function LoginFormPage() {
  const context = React.useContext(UserContext);
  
  return (
    <ComponentPage title="Login Form Component">
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Demo:</strong> Try email: "demo@test.com" and password: "password"
      </Alert>
      
      <Login
        appName="Playground"
        appUrl={window.location.href}
        setErrors={() => {}}
        setShowForgot={() => {}}
        setShowRegister={() => {}}
        onSuccess={() => console.log('Login success')}
        context={context}
        defaultEmail="demo@test.com"
        defaultPassword="password"
      />
    </ComponentPage>
  );
}

function RegisterFormPage() {
  const context = React.useContext(UserContext);
  
  return (
    <ComponentPage title="Register Form Component">
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Demo:</strong> Fill out the form to see validation and UI behavior
      </Alert>
      
      <Register
        context={context}
        onSuccess={() => console.log('Registration success')}
        appName="Playground"
        recaptchaSiteKey=""
        defaultChurchId=""
      />
    </ComponentPage>
  );
}

function ForgotPasswordPage() {
  return (
    <ComponentPage title="Forgot Password">
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Demo:</strong> Enter any email to see the forgot password flow
      </Alert>
      
      <Forgot 
        registerCallback={() => console.log('Navigate to register')}
        loginCallback={() => console.log('Navigate to login')}
      />
    </ComponentPage>
  );
}

function SetPasswordPage() {
  const search = new URLSearchParams(window.location.search);
  const jwt = search.get("jwt") || "mock-jwt-token";
  const auth = search.get("auth") || "reset";
  
  return (
    <ComponentPage title="Set Password">
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>Demo:</strong> Mock JWT token provided. Enter a new password to see validation.
        <br />
        JWT: {jwt} | Auth: {auth}
      </Alert>
      
      <LoginSetPassword 
        appName="Playground"
        appUrl={window.location.href}
      />
    </ComponentPage>
  );
}

function ChurchSelectionPage() {
  return (
    <ComponentPage title="Church Selection Components">
      <Stack spacing={4}>
        <Box>
          <Typography variant="h6" gutterBottom>Church Search</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Search for churches (API calls will fail gracefully in demo mode)
          </Alert>
          <SelectChurchSearch 
            onDone={() => console.log('Search done')}
            appName="Playground"
            userEmail="demo@test.com"
          />
        </Box>
        
        <Box>
          <Typography variant="h6" gutterBottom>Church Registration</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Register a new church (demo mode)
          </Alert>
          <SelectChurchRegister 
            onDone={() => console.log('Register done')}
            appName="Playground"
            recaptchaSiteKey=""
          />
        </Box>
      </Stack>
    </ComponentPage>
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
                  AppHelper Login Playground
                </Typography>
              </Toolbar>
            </AppBar>
            
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login-full" element={<FullLoginPage />} />
              <Route path="/login-form" element={<LoginFormPage />} />
              <Route path="/register-form" element={<RegisterFormPage />} />
              <Route path="/forgot" element={<ForgotPasswordPage />} />
              <Route path="/set-password" element={<SetPasswordPage />} />
              <Route path="/church-selection" element={<ChurchSelectionPage />} />
            </Routes>
          </Router>
        </UserProvider>
      </ThemeProvider>
    </CookiesProvider>
  );
}

export default App;