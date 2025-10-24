import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button, Card, CardContent, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { ButtonLink } from '../../../packages/apphelper-website/src';

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

const websiteComponents = [
  {
    name: 'ButtonLink',
    description: 'Material-UI button component for creating clickable links with various styles',
    category: 'Element',
    complexity: 'Low'
  }
];

export default function WebsiteComponentsPage() {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);

  const renderComponent = (component: any) => {
    try {
      switch (component.name) {
        case 'ButtonLink':
          return (
            <Stack spacing={2}>
              <ButtonLink
                element={{
                  id: 'button-1',
                  answers: {
                    buttonLinkText: 'Click Me',
                    buttonLinkUrl: '#',
                    buttonLinkVariant: 'contained',
                    buttonLinkColor: 'primary'
                  }
                }}
              />
              <ButtonLink
                element={{
                  id: 'button-2',
                  answers: {
                    buttonLinkText: 'Outlined Button',
                    buttonLinkUrl: '#',
                    buttonLinkVariant: 'outlined',
                    buttonLinkColor: 'secondary'
                  }
                }}
              />
              <ButtonLink
                element={{
                  id: 'button-3',
                  answers: {
                    buttonLinkText: 'Full Width Button',
                    buttonLinkUrl: 'https://churchapps.org',
                    buttonLinkVariant: 'contained',
                    buttonLinkColor: 'primary',
                    fullWidth: 'true',
                    external: 'true'
                  }
                }}
              />
            </Stack>
          );

        default:
          return (
            <Alert severity="info">
              <strong>{component.name} Demo</strong>
              <br />
              {component.description}
              <br /><br />
              Component demo implementation not yet available.
            </Alert>
          );
      }
    } catch (error) {
      return (
        <Alert severity="error">
          <strong>Error loading {component.name}</strong>
          <br />
          {error instanceof Error ? error.message : 'Unknown error occurred'}
          <br /><br />
          This component may require additional configuration or dependencies.
        </Alert>
      );
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

        {selectedComponent === component.name && (
          <Box sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            mt: 2
          }}>
            <Typography variant="subtitle2" gutterBottom>Live Component Demo:</Typography>
            <ErrorBoundary>
              {renderComponent(component)}
            </ErrorBoundary>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <ComponentPage title="@churchapps/apphelper-website - Website Components">
      <Stack spacing={4}>
        <Alert severity="info">
          <strong>Website Components from @churchapps/apphelper-website Package</strong>
          <br />
          This page demonstrates website element components that can be used to build dynamic church websites.
          More components will be added as the package is extended.
        </Alert>

        <Box>
          <Typography variant="h5" gutterBottom>
            Element Components ({websiteComponents.length} total)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Click "Show Demo" to see live component demonstrations with interactive examples.
          </Alert>
          {websiteComponents.map(component => renderComponentCard(component))}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>Package Status</Typography>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>@churchapps/apphelper-website</Typography>
              <Typography variant="body2">
                • Initial package with basic components<br/>
                • Material-UI based element types<br/>
                • Designed for dynamic website building<br/>
                • Will be extended with more components
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </ComponentPage>
  );
}
