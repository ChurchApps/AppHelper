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

const donationComponents = [
  {
    name: 'DonationForm',
    description: 'Main donation form with Stripe integration',
    usage: ['B1App: 1 file', 'ChumsApp: 1 file', 'LessonsApp: none'],
    category: 'Form',
    complexity: 'High'
  },
  {
    name: 'PaymentMethods',
    description: 'Manage saved payment methods',
    usage: ['B1App: 1 file', 'ChumsApp: 1 file', 'LessonsApp: none'],
    category: 'Management',
    complexity: 'Medium'
  },
  {
    name: 'RecurringDonations',
    description: 'Display and manage recurring donations',
    usage: ['B1App: 1 file', 'ChumsApp: 1 file', 'LessonsApp: none'],
    category: 'Management',
    complexity: 'Medium'
  },
  {
    name: 'FundDonations',
    description: 'Display donations grouped by fund',
    usage: ['B1App: 1 file', 'ChumsApp: 4 files', 'LessonsApp: none'],
    category: 'Display',
    complexity: 'Medium'
  },
  {
    name: 'NonAuthDonation',
    description: 'Donation form for non-authenticated users',
    usage: ['B1App: 3 files', 'ChumsApp: 4 files', 'LessonsApp: none'],
    category: 'Form',
    complexity: 'High'
  }
];

export default function DonationComponentsPage() {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);

  const renderComponent = (component: any) => {
    return (
      <Alert severity="warning">
        <strong>{component.name} Demo</strong>
        <br />
        {component.description}
        <br /><br />
        This component requires Stripe integration and secure authentication which are not available in this demo environment.
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
              {selectedComponent === component.name ? 'Hide' : 'Show'} Info
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
    <ComponentPage title="@churchapps/apphelper-donations - Donation Components">
      <Stack spacing={4}>
        <Alert severity="info">
          <strong>Donation Components from @churchapps/apphelper-donations Package</strong>
          <br />
          This page demonstrates donation components that provide comprehensive payment processing and donation management.
        </Alert>

        <Alert severity="warning">
          <strong>Security Notice</strong>
          <br />
          Donation components require Stripe API integration and cannot be fully demonstrated in this playground environment for security reasons.
        </Alert>

        <Box>
          <Typography variant="h5" gutterBottom>
            Donation Components ({donationComponents.length} total)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Click Show Info to see detailed component information.
          </Alert>
          {donationComponents.map(component => renderComponentCard(component))}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>Usage Analysis</Typography>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Adoption by Application</Typography>
                <Typography variant="body2">
                  Strong adoption in B1App (61.5%) and ChumsApp (76.9%) for revenue-generating applications.
                  LessonsApp has no donation functionality (0% adoption).
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Stack>
    </ComponentPage>
  );
}