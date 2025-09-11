import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button, Card, CardContent, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';
import { ErrorBoundary } from '../ErrorBoundary';
import { DonationForm, PaymentMethods, RecurringDonations, FundDonations, NonAuthDonation, StripePaymentMethod } from '@churchapps/apphelper-donations';
import { MultiGatewayDonationForm } from '../../../packages/donations/src/components/MultiGatewayDonationForm';
import type { PaymentMethod, PaymentGateway } from '../../../packages/donations/src/helpers';
import { PersonInterface, ChurchInterface } from '@churchapps/helpers';
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

// Non-authenticated donation setup with Ironwood church
const ironwoodChurch: ChurchInterface = {
  id: "AOjIt0W-SeY",
  name: "Ironwood Church",
  subDomain: "ironwood"
};

// Mock data for authenticated donation components
const mockPerson: PersonInterface = {
  id: "test-person-1",
  name: {
    display: "John Smith",
    first: "John",
    last: "Smith"
  },
  contactInfo: {
    email: "john.smith@example.com"
  }
};

const mockChurch: ChurchInterface = {
  id: "test-church-1",
  name: "Test Church",
  subDomain: "testchurch"
};

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "stripe-card-1",
    type: "card",
    provider: "stripe",
    name: "Visa Card",
    last4: "4242"
  },
  {
    id: "stripe-bank-1",
    type: "bank",
    provider: "stripe",
    name: "Bank Account",
    last4: "6789"
  },
  {
    id: "paypal-1",
    type: "paypal",
    provider: "paypal",
    name: "PayPal Account",
    email: "john.smith@example.com"
  }
];

const mockGateways: PaymentGateway[] = [
  {
    id: "stripe-gateway",
    provider: "stripe",
    publicKey: "pk_test_stripe_key",
    enabled: true
  },
  {
    id: "paypal-gateway", 
    provider: "paypal",
    publicKey: "paypal_client_id",
    enabled: true
  }
];

const mockStripePaymentMethods = [
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

const mockFundDonations = [
  { fundId: 'fund-1', amount: 100 },
  { fundId: 'fund-2', amount: 50 }
];

const mockFunds = [
  { id: 'fund-1', name: 'General Fund' },
  { id: 'fund-2', name: 'Building Fund' }
];

const authDonationComponents = [
  {
    name: 'DonationForm',
    description: 'Main donation form with Stripe integration',
    category: 'Form',
    complexity: 'High'
  },
  {
    name: 'PaymentMethods',
    description: 'Manage saved payment methods',
    category: 'Management',
    complexity: 'Medium'
  },
  {
    name: 'RecurringDonations',
    description: 'Display and manage recurring donations',
    category: 'Management',
    complexity: 'Medium'
  },
  {
    name: 'FundDonations',
    description: 'Display donations grouped by fund',
    category: 'Display',
    complexity: 'Medium'
  }
];

export default function ConsolidatedDonationsPage() {
  const context = React.useContext(UserContext);
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);
  const [donationResult, setDonationResult] = React.useState<string | null>(null);

  // Mock Stripe setup
  const stripePromise = React.useMemo(() => loadStripe('pk_test_dummy_key_for_demo') as Promise<any>, []);

  const handleDonationSuccess = (message: string) => {
    setDonationResult(`✅ Donation successful: ${message}`);
  };

  const renderAuthComponent = (component: any) => {
    try {
      switch (component.name) {
        case 'DonationForm':
          return (
            <Elements stripe={stripePromise}>
              <DonationForm
                person={mockPerson}
                customerId="cust_demo123"
                paymentMethods={mockStripePaymentMethods}
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
                paymentMethods={mockStripePaymentMethods}
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
                paymentMethods={mockStripePaymentMethods}
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

  const renderAuthComponentCard = (component: any) => (
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
              {renderAuthComponent(component)}
            </ErrorBoundary>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  // Render non-authenticated donation form
  const renderNonAuthView = () => (
    <Stack spacing={4}>
      <Alert severity="info">
        <strong>Non-Authenticated Donation</strong>
        <br />
        You are not currently logged in. Here is the donation form for Ironwood Church using church ID "AOjIt0W-SeY".
      </Alert>

      <Box>
        <Typography variant="h5" gutterBottom>
          Make a Donation
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Non-Auth Donation Form
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              This is a demo form with test Stripe keys. In a real environment, this would process actual donations.
            </Alert>
            
            <Elements stripe={stripePromise}>
              <NonAuthDonation
                churchId="AOjIt0W-SeY"
                recaptchaSiteKey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                churchLogo="https://via.placeholder.com/200x100/0066cc/ffffff?text=Ironwood+Church"
                showHeader={true}
              />
            </Elements>
          </CardContent>
        </Card>
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom>
          Multi-Gateway Donation (with PayPal)
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Multi-Gateway Donation Form
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              This form supports both Stripe and PayPal payment processing.
            </Alert>
            
            {donationResult && (
              <Alert severity={donationResult.includes('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>
                {donationResult}
              </Alert>
            )}
            
            <MultiGatewayDonationForm
              person={mockPerson}
              customerId="test-customer-123"
              paymentMethods={mockPaymentMethods}
              paymentGateways={mockGateways}
              donationSuccess={handleDonationSuccess}
              church={ironwoodChurch}
              churchLogo="https://via.placeholder.com/200x100/0066cc/ffffff?text=Ironwood+Church"
            />
          </CardContent>
        </Card>
      </Box>

      <Alert severity="info">
        <strong>Want to see more donation features?</strong>
        <br />
        <Link to="/auth">Log in</Link> to access payment methods management, recurring donations, and donation history.
      </Alert>
    </Stack>
  );

  // Render authenticated donation components
  const renderAuthView = () => (
    <Stack spacing={4}>
      <Alert severity="success">
        <strong>Welcome back!</strong>
        <br />
        You are logged in. Here are all the donation management components available to authenticated users.
      </Alert>

      <Box>
        <Typography variant="h5" gutterBottom>
          Authenticated Donation Components ({authDonationComponents.length} total)
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Click "Show Demo" to see live component demonstrations with mock data.
        </Alert>
        {authDonationComponents.map(component => renderAuthComponentCard(component))}
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom>
          Multi-Gateway Donation Form
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Multi-Gateway Donation (Authenticated User)
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              This form supports both Stripe and PayPal payment processing with saved payment methods.
            </Alert>
            
            {donationResult && (
              <Alert severity={donationResult.includes('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>
                {donationResult}
              </Alert>
            )}
            
            <MultiGatewayDonationForm
              person={mockPerson}
              customerId="test-customer-123"
              paymentMethods={mockPaymentMethods}
              paymentGateways={mockGateways}
              donationSuccess={handleDonationSuccess}
              church={mockChurch}
              churchLogo="https://via.placeholder.com/200x100/0066cc/ffffff?text=Test+Church"
            />
          </CardContent>
        </Card>
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom>Usage Analysis</Typography>
        <Stack spacing={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Donation Component Adoption</Typography>
              <Typography variant="body2">
                Strong adoption in B1App (61.5%) and ChumsApp (76.9%) for revenue-generating applications.
                LessonsApp has no donation functionality (0% adoption).
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Stack>
  );

  return (
    <ComponentPage title="Donations">
      {/* Conditional rendering based on authentication status */}
      {context?.user ? renderAuthView() : renderNonAuthView()}
    </ComponentPage>
  );
}