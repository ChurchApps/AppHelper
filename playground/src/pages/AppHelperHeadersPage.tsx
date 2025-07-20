import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button, Card, CardContent, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { 
  SiteHeader,
  Banner
} from '@churchapps/apphelper';

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

const headerComponents = [
  {
    name: 'SiteHeader',
    component: SiteHeader,
    description: 'Complete site header with navigation, user menu, and branding',
    usage: ['B1App: 1 file', 'ChumsApp: 1 file', 'LessonsApp: ✅'],
    category: 'Layout',
    complexity: 'High'
  },
  {
    name: 'Banner',
    component: Banner,
    description: 'Alert banner component for announcements and notifications',
    usage: ['B1App: 1 file', 'ChumsApp: 14 files', 'LessonsApp: ✅'],
    category: 'Notification',
    complexity: 'Low'
  }
];

export default function AppHelperHeadersPage() {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);

  const renderComponent = (component: any) => {
    switch (component.name) {
      case 'SiteHeader':
        return (
          <Alert severity="info">
            <strong>SiteHeader Demo</strong>
            <br />
            SiteHeader is a complex layout component used as the main application header.
          </Alert>
        );
        
      case 'Banner':
        return (
          <Alert severity="info">
            Banner component demos would appear here with different severity types (info, warning, error, success).
          </Alert>
        );
        
      default:
        return <Alert severity="error">Unknown component: {component.name}</Alert>;
    }
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
              color={usage.includes('❌') ? 'error' : 'success'}
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
            <Typography variant="subtitle2" gutterBottom>Live Demo:</Typography>
            <ErrorBoundary>
              {renderComponent(component)}
            </ErrorBoundary>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <ComponentPage title="@churchapps/apphelper - Header Components">
      <Stack spacing={4}>
        <Alert severity="info">
          <strong>Header Components from @churchapps/apphelper Package</strong>
          <br />
          This page demonstrates all {headerComponents.length} header components that provide application layout and notification capabilities.
        </Alert>

        <Box>
          <Typography variant="h5" gutterBottom>
            Header Components ({headerComponents.length} total)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Click "Show Demo" to see live interactive examples.
          </Alert>
          {headerComponents.map(component => renderComponentCard(component))}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>Usage Analysis</Typography>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Component Adoption</Typography>
                <Typography variant="body2">
                  <strong>Banner:</strong> 16 files total across all applications
                  <br />
                  <strong>SiteHeader:</strong> 3 files total (one per application)
                  <br />
                  Both components show consistent adoption for their respective purposes.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Stack>
    </ComponentPage>
  );
}