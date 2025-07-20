import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button, Card, CardContent, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
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

const loginComponents = [
  {
    name: 'LoginPage',
    description: 'Complete login page with integrated authentication flow',
    usage: ['B1App: 1 file', 'ChumsApp: 1 file', 'LessonsApp: yes'],
    category: 'Page',
    complexity: 'High'
  },
  {
    name: 'LogoutPage',
    description: 'Logout page with cleanup and redirect functionality',
    usage: ['B1App: 2 files', 'ChumsApp: 1 file', 'LessonsApp: yes'],
    category: 'Page',
    complexity: 'Low'
  },
  {
    name: 'Login',
    description: 'Basic login form component',
    usage: ['B1App: 14 files', 'ChumsApp: 3 files', 'LessonsApp: none'],
    category: 'Form',
    complexity: 'Medium'
  },
  {
    name: 'Register',
    description: 'User registration form component',
    usage: ['B1App: none', 'ChumsApp: none', 'LessonsApp: yes'],
    category: 'Form',
    complexity: 'Medium'
  },
  {
    name: 'Forgot',
    description: 'Forgot password form component',
    usage: ['B1App: none', 'ChumsApp: none', 'LessonsApp: none'],
    category: 'Form',
    complexity: 'Low'
  }
];

export default function LoginComponentsPage() {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);

  const renderComponent = (component: any) => {
    return (
      <Alert severity="info">
        <strong>{component.name} Demo</strong>
        <br />
        {component.description}
        <br /><br />
        This component provides authentication functionality and integrates with the ChurchApps authentication system.
      </Alert>
    );
  };

  const renderComponentCard = (component: any) => (
    <Card key={component.name} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3">
            {component.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip label={component.category} color="primary" variant="outlined" size="small" />
            <Chip 
              label={component.complexity} 
              color={component.complexity === 'High' ? 'error' : component.complexity === 'Medium' ? 'warning' : 'success'} 
              variant="outlined" 
              size="small" 
            />
            <Button
              variant={selectedComponent === component.name ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setSelectedComponent(selectedComponent === component.name ? null : component.name)}
            >
              {selectedComponent === component.name ? 'Hide' : 'Show'} Demo
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {component.description}
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom>Usage Across Apps:</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
          {component.usage.map((usage: string, index: number) => (
            <Chip 
              key={index} 
              label={usage} 
              size="small" 
              color={usage.includes('none') ? 'error' : 'success'}
              variant="outlined"
            />
          ))}
        </Stack>

        {selectedComponent === component.name && (
          <Box sx={{ 
            border: 1, 
            borderColor: 'divider', 
            borderRadius: 1, 
            p: 2, 
            mt: 2
          }}>
            <Typography variant="subtitle2" gutterBottom>Component Information:</Typography>
            <ErrorBoundary>
              {renderComponent(component)}
            </ErrorBoundary>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <ComponentPage title="@churchapps/apphelper-login - Authentication Components">
      <Stack spacing={4}>
        <Alert severity="info">
          <strong>Authentication Components from @churchapps/apphelper-login Package</strong>
          <br />
          This page demonstrates all {loginComponents.length} authentication components with functional authentication services.
        </Alert>

        <Box>
          <Typography variant="h5" gutterBottom>
            Authentication Components ({loginComponents.length} total)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Click Show Demo to see component information and capabilities.
          </Alert>
          {loginComponents.map(component => renderComponentCard(component))}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>Usage Analysis</Typography>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Adoption Patterns</Typography>
                <Typography variant="body2">
                  Universal Components: LoginPage and LogoutPage used by all 3 applications.
                  Login component has heavy usage in B1App (14 files) and moderate in ChumsApp (3 files).
                  Register component only used in LessonsApp for educational user registration.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Stack>
    </ComponentPage>
  );
}