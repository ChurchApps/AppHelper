import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Box, Card, CardContent, Grid } from '@mui/material';
import { CookiesProvider } from 'react-cookie';
import { ErrorBoundary } from './ErrorBoundary';

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

// Mock context for testing
const mockUserContext = {
  user: null,
  setUser: () => {},
  churchId: '',
  setChurchId: () => {}
};

function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          AppHelper Login Components Playground
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Test and preview all login components
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">LoginPage</Typography>
                <Typography variant="body2" color="textSecondary">
                  Main login page with multiple tabs
                </Typography>
                <Link to="/login-page">View Component</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Login</Typography>
                <Typography variant="body2" color="textSecondary">
                  Simple login form
                </Typography>
                <Link to="/login">View Component</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Register</Typography>
                <Typography variant="body2" color="textSecondary">
                  User registration form
                </Typography>
                <Link to="/register">View Component</Link>
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
                  Set new password form
                </Typography>
                <Link to="/set-password">View Component</Link>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Church Selection</Typography>
                <Typography variant="body2" color="textSecondary">
                  Church selection components
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

function App() {
  return (
    <CookiesProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
            
            <Route 
              path="/login-page" 
              element={
                <ComponentPage title="LoginPage">
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="warning.main">
                      LoginPage requires complex props - check the source code for full implementation
                    </Typography>
                  </Box>
                </ComponentPage>
              } 
            />
            
            <Route 
              path="/login" 
              element={
                <ComponentPage title="Login Component">
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="warning.main">
                      Login component requires complex props - check the source code for full implementation
                    </Typography>
                  </Box>
                </ComponentPage>
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <ComponentPage title="Register Component">
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="warning.main">
                      Register component requires complex props - check the source code for full implementation
                    </Typography>
                  </Box>
                </ComponentPage>
              } 
            />
            
            <Route 
              path="/forgot" 
              element={
                <ComponentPage title="Forgot Password">
                  <Forgot 
                    registerCallback={() => console.log('Navigate to register')}
                    loginCallback={() => console.log('Navigate to login')}
                  />
                </ComponentPage>
              } 
            />
            
            <Route 
              path="/set-password" 
              element={
                <ComponentPage title="Set Password">
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="warning.main">
                      LoginSetPassword requires URL parameters - check the source code for full implementation
                    </Typography>
                  </Box>
                </ComponentPage>
              } 
            />
            
            <Route 
              path="/church-selection" 
              element={
                <ComponentPage title="Church Selection Components">
                  <Box sx={{ '& > *': { mb: 3 } }}>
                    <Typography variant="h6">Church Search</Typography>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography color="warning.main">
                        SelectChurchSearch requires complex props - check the source code for full implementation
                      </Typography>
                    </Box>
                    
                    <Typography variant="h6" sx={{ mt: 4 }}>Church Register</Typography>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography color="warning.main">
                        SelectChurchRegister requires complex props - check the source code for full implementation
                      </Typography>
                    </Box>
                  </Box>
                </ComponentPage>
              } 
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </CookiesProvider>
  );
}

export default App;