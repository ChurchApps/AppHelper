import React from 'react';
import { Container, Box, Typography, Alert, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import UserContext from '../UserContext';
import { 
  mockDonationFunds,
  mockDonations,
  mockPaymentMethods
} from '../mockData';

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

// Create a wrapper to handle donation component imports safely
function DonationComponentWrapper({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const testImport = async () => {
      try {
        await import('@churchapps/apphelper-donations');
      } catch (error) {
        console.error('Donation components not available:', error);
        setHasError(true);
      }
    };
    testImport();
  }, []);

  if (hasError) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        <strong>Donation Components Not Available</strong>
        <br />
        The donation components require Stripe dependencies that are not currently loaded.
        This is likely due to missing @stripe packages or configuration issues.
      </Alert>
    );
  }

  return <>{children}</>;
}

export function DonationTestPage() {
  const context = React.useContext(UserContext);

  return (
    <ComponentPage title="Donation Components - Functional Examples">
      <Stack spacing={4}>
        <Alert severity="info">
          This page demonstrates AppHelper donation components with Stripe integration for payment processing.
        </Alert>

        <Alert severity="warning">
          <strong>Note:</strong> Donation components require Stripe configuration and API keys.
          In this playground environment, components may show mock data or loading states.
        </Alert>

        <DonationComponentWrapper>
          <Box>
            <Typography variant="h6" gutterBottom>Component Information</Typography>
            <Stack spacing={2}>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>DonationForm</Typography>
                <Typography variant="body2">
                  Main donation form with Stripe integration. Handles one-time and recurring donations
                  with multiple payment methods including credit cards and bank accounts.
                </Typography>
              </Box>
              
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Payment Forms</Typography>
                <Typography variant="body2">
                  <strong>CardForm:</strong> Credit card payment form with Stripe Elements
                  <br />
                  <strong>BankForm:</strong> Bank account payment form for ACH transfers
                </Typography>
              </Box>

              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Fund Management</Typography>
                <Typography variant="body2">
                  <strong>FundDonation:</strong> Single fund donation component
                  <br />
                  <strong>FundDonations:</strong> Multi-fund donation management
                </Typography>
              </Box>

              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Payment Methods</Typography>
                <Typography variant="body2">
                  <strong>PaymentMethods:</strong> Manage saved payment methods
                  <br />
                  <strong>RecurringDonations:</strong> View and manage recurring donations
                  <br />
                  <strong>RecurringDonationsEdit:</strong> Edit recurring donation settings
                </Typography>
              </Box>

              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Guest Donations</Typography>
                <Typography variant="body2">
                  <strong>NonAuthDonation:</strong> Donation form for non-authenticated users
                  <br />
                  <strong>NonAuthDonationInner:</strong> Inner component for guest donations
                </Typography>
              </Box>
            </Stack>
          </Box>
        </DonationComponentWrapper>

        <Box>
          <Typography variant="h6" gutterBottom>Mock Data Examples</Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Available Funds</Typography>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'grey.50' }}>
              {mockDonationFunds.map((fund, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    <strong>{fund.name}:</strong> {fund.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Sample Donations</Typography>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'grey.50' }}>
              {mockDonations.map((donation, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    ${donation.amount} to {donation.fund.name} 
                    {donation.recurring && ` (${donation.interval} recurring)`}
                    - {donation.method} ({donation.created.toLocaleDateString()})
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Payment Methods</Typography>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'grey.50' }}>
              {mockPaymentMethods.map((method, index) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    {method.type === 'card' ? `${method.brand} ****${method.last4}` : `${method.bankName} ****${method.last4}`}
                    {method.isDefault && ' (Default)'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>User Context</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Donation components use the current user context for personalization
          </Alert>
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body2">
              <strong>User:</strong> {context?.person?.name?.display || 'Not available'}
              <br />
              <strong>Email:</strong> {context?.person?.contactInfo?.email || 'Not available'}
              <br />
              <strong>Church:</strong> {context?.userChurch?.church?.name || 'Not available'}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Integration Requirements</Typography>
          <Alert severity="warning">
            <strong>Stripe Configuration</strong>
            <br />
            Donation components require:
            <br />• Stripe publishable key configuration
            <br />• Server-side Stripe secret key for payment processing
            <br />• Webhook endpoints for payment confirmations
            <br />• SSL/HTTPS for production usage
            <br /><br />
            <strong>API Endpoints</strong>
            <br />
            Components expect these API endpoints:
            <br />• POST /donations - Create new donations
            <br />• GET /donations - Retrieve donation history
            <br />• POST /payment-methods - Save payment methods
            <br />• GET /payment-methods - Retrieve saved methods
            <br />• POST/PUT/DELETE /recurring-donations - Manage subscriptions
          </Alert>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Testing Notes</Typography>
          <Alert severity="info">
            <strong>Development Testing:</strong>
            <br />• Use Stripe test keys for development
            <br />• Test card: 4242 4242 4242 4242
            <br />• Any future expiry date and CVC
            <br /><br />
            <strong>Component Features:</strong>
            <br />• Real-time validation of payment forms
            <br />• Support for multiple currencies
            <br />• Recurring donation scheduling
            <br />• Payment method storage and reuse
            <br />• Tax receipt generation integration
          </Alert>
        </Box>
      </Stack>
    </ComponentPage>
  );
}