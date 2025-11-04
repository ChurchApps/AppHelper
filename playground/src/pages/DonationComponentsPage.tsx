import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { DonationForm, PaymentMethods, RecurringDonations, FundDonations, NonAuthDonation, StripePaymentMethod } from '@churchapps/apphelper-donations';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

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
    description: 'Main donation form with Stripe integration'
  },
  {
    name: 'PaymentMethods',
    description: 'Manage saved payment methods'
  },
  {
    name: 'RecurringDonations',
    description: 'Display and manage recurring donations'
  },
  {
    name: 'FundDonations',
    description: 'Display donations grouped by fund'
  },
  {
    name: 'NonAuthDonation',
    description: 'Donation form for non-authenticated users'
  }
];

export default function DonationComponentsPage() {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);

  // Mock Stripe setup
  const stripePromise = React.useMemo(() => loadStripe('pk_test_dummy_key_for_demo') as Promise<any>, []);

  // Mock data
  const mockPerson = {
    id: 'person-123',
    name: { display: 'John Doe', first: 'John', last: 'Doe' },
    contactInfo: { email: 'john.doe@example.com' }
  };

  const mockPaymentMethods = [
    new StripePaymentMethod({
      id: 'pm_1234567890',
      type: 'card',
      card: { brand: 'Visa', last4: '4242', exp_month: '12', exp_year: '2025' }
    }),
    new StripePaymentMethod({
      id: 'pm_0987654321',
      type: 'bank',
      bank_name: 'Chase Bank',
      last4: '6789'
    })
  ];

  const mockChurch = {
    id: 'church-123',
    name: 'Demo Church',
    subDomain: 'demo-church'
  };

  const mockFundDonations = [
    { fundId: 'fund-1', amount: 100 },
    { fundId: 'fund-2', amount: 50 }
  ];

  const mockFunds = [
    { id: 'fund-1', name: 'General Fund' },
    { id: 'fund-2', name: 'Building Fund' }
  ];

  const renderComponent = (component: any) => {
    try {
      switch (component.name) {
        case 'DonationForm':
          return (
            <Elements stripe={stripePromise}>
              <DonationForm
                person={mockPerson}
                customerId="cust_demo123"
                paymentMethods={mockPaymentMethods}
                stripePromise={stripePromise}
                donationSuccess={(message: string) => alert(`Success: ${message}`)}
                church={mockChurch}
                churchLogo="https://via.placeholder.com/100x100/0066cc/ffffff?text=Church"
              />
            </Elements>
          );

        case 'PaymentMethods':
          return (
            <Elements stripe={stripePromise}>
              <PaymentMethods
                person={mockPerson}
                customerId="cust_demo123"
                paymentMethods={mockPaymentMethods}
                stripePromise={stripePromise}
                appName="Demo App"
                dataUpdate={(message?: string) => console.log('Data updated:', message)}
              />
            </Elements>
          );

        case 'RecurringDonations':
          return (
            <Elements stripe={stripePromise}>
              <RecurringDonations
                customerId="cust_demo123"
                paymentMethods={mockPaymentMethods}
                appName="Demo App"
                dataUpdate={(message?: string) => console.log('Data updated:', message)}
              />  
            </Elements>
          );

        case 'FundDonations':
          return (
            <FundDonations
              fundDonations={mockFundDonations}
              funds={mockFunds}
              updatedFunction={(fundDonations: any[]) => console.log('Fund donations updated:', fundDonations)}
            />
          );

        case 'NonAuthDonation':
          return (
            <Elements stripe={stripePromise}>
              <NonAuthDonation
                churchId="church-123"
                recaptchaSiteKey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                churchLogo="https://via.placeholder.com/100x100/0066cc/ffffff?text=Church"
                showHeader={true}
              />
            </Elements>
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
          This may be due to missing API endpoints or authentication in the demo environment.
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
          <Button
            variant={selectedComponent === component.name ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setSelectedComponent(selectedComponent === component.name ? null : component.name)}
          >
            {selectedComponent === component.name ? 'Hide' : 'Show'} Demo
          </Button>
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
    <ComponentPage title="@churchapps/apphelper-donations - Donation Components">
      <Stack spacing={4}>
        <Alert severity="info">
          <strong>Donation Components from @churchapps/apphelper-donations Package</strong>
          <br />
          This page demonstrates donation components that provide comprehensive payment processing and donation management.
        </Alert>

        <Alert severity="info">
          <strong>Demo Notice</strong>
          <br />
          These components are using mock data and test Stripe keys. In a real application, you would need to configure proper Stripe API keys and backend integration.
        </Alert>

        <Box>
          <Typography variant="h5" gutterBottom>
            Donation Components ({donationComponents.length} total)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Click "Show Demo" to see live component demonstrations with mock data.
          </Alert>
          {donationComponents.map(component => renderComponentCard(component))}
        </Box>

      </Stack>
    </ComponentPage>
  );
}