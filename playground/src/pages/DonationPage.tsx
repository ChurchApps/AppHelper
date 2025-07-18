import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Alert, Stack, Paper, Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import UserContext from '../UserContext';
import { loadStripe } from '@stripe/stripe-js';
import { 
  mockDonationFunds,
  mockDonations,
  mockPaymentMethods,
  createMockUserContext
} from '../mockData';

// Types for donation components
interface DonationFormProps {
  stripePromise: Promise<any>;
  person: any;
  paymentMethods?: any[];
}

interface NonAuthDonationProps {
  churchId: string;
  recaptchaSiteKey: string;
}

interface PaymentMethodsProps {
  stripePromise: Promise<any>;
  paymentMethods: any[];
}

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

// Component wrapper to safely import and use donation components
function DonationComponentWrapper({ children, requireStripe = false }: { children: React.ReactNode, requireStripe?: boolean }) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const testImport = async () => {
      try {
        // Test if donation components are available
        const donationModule = await import('@churchapps/apphelper');
        
        if (requireStripe) {
          const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
          if (!stripeKey || stripeKey === 'pk_test_your_stripe_publishable_key_here') {
            setErrorMessage('Stripe publishable key not configured in .env file');
            setHasError(true);
            return;
          }
        }
        
        // If we got here, components should be available
        console.log('Donation components loaded successfully');
      } catch (error) {
        console.error('Donation components not available:', error);
        setErrorMessage('Donation components not available. This may be due to missing Stripe dependencies.');
        setHasError(true);
      }
    };
    testImport();
  }, [requireStripe]);

  if (hasError) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        <strong>Donation Components Not Available</strong>
        <br />
        {errorMessage}
        <br /><br />
        <strong>To enable donation components:</strong>
        <br />• Copy .env.example to .env
        <br />• Add your Stripe publishable key to VITE_STRIPE_PUBLISHABLE_KEY
        <br />• Ensure all required dependencies are installed
      </Alert>
    );
  }

  return <>{children}</>;
}

// Environment configuration display
function EnvironmentConfig() {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  const churchId = import.meta.env.VITE_CHURCH_ID;
  const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const isConfigured = stripeKey && stripeKey !== 'pk_test_your_stripe_publishable_key_here';
  const isTestMode = stripeKey?.startsWith('pk_test_');

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Environment Configuration
      </Typography>
      
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Stripe Configuration
          </Typography>
          <Alert severity={isConfigured ? 'success' : 'warning'}>
            <strong>Publishable Key:</strong> {isConfigured ? 
              `${stripeKey?.substring(0, 12)}...${stripeKey?.substring(stripeKey.length - 4)}` : 
              'Not configured'
            }
            <br />
            <strong>Mode:</strong> {isTestMode ? 'Test Mode' : 'Live Mode'}
            <br />
            <strong>Status:</strong> {isConfigured ? 'Ready' : 'Needs Configuration'}
          </Alert>
        </Box>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Other Configuration
          </Typography>
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="body2">
              <strong>Church ID:</strong> {churchId || 'Not set'}
              <br />
              <strong>reCAPTCHA Key:</strong> {recaptchaKey ? 'Configured' : 'Not configured'}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}

// Mock donation form component
function MockDonationForm() {
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const context = React.useContext(UserContext);

  useEffect(() => {
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (stripeKey && stripeKey !== 'pk_test_your_stripe_publishable_key_here') {
      setStripePromise(loadStripe(stripeKey));
    }
  }, []);

  if (!stripePromise) {
    return (
      <Alert severity="warning">
        Stripe not configured. Please add your Stripe publishable key to the .env file.
      </Alert>
    );
  }

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'grey.50' }}>
      <Typography variant="body2" gutterBottom>
        <strong>DonationForm Component</strong>
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Authenticated donation form would render here with:
        <br />• Stripe Elements integration
        <br />• Available funds: {mockDonationFunds.length}
        <br />• Saved payment methods: {mockPaymentMethods.length}
        <br />• User: {context?.person?.name?.display || 'Mock User'}
      </Typography>
      <Button variant="outlined" size="small" sx={{ mt: 1 }} disabled>
        Mock Donation Form
      </Button>
    </Box>
  );
}

// Mock non-auth donation component
function MockNonAuthDonation() {
  const churchId = import.meta.env.VITE_CHURCH_ID || 'test_church_123';
  const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || 'not_configured';

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'grey.50' }}>
      <Typography variant="body2" gutterBottom>
        <strong>NonAuthDonation Component</strong>
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Non-authenticated donation form would render here with:
        <br />• Church ID: {churchId}
        <br />• reCAPTCHA: {recaptchaKey !== 'not_configured' ? 'Configured' : 'Not configured'}
        <br />• Stripe gateway fetched from API
        <br />• Guest donation flow
      </Typography>
      <Button variant="outlined" size="small" sx={{ mt: 1 }} disabled>
        Mock Guest Donation
      </Button>
    </Box>
  );
}

export function DonationTestPage() {
  const context = React.useContext(UserContext) || createMockUserContext();
  const [activeTab, setActiveTab] = useState<'authenticated' | 'guest'>('authenticated');

  return (
    <ComponentPage title="Donation Components - Environment Configuration">
      <Stack spacing={4}>
        <Alert severity="info">
          This page demonstrates AppHelper donation components with environment-based Stripe configuration.
          Components integrate with Stripe for secure payment processing.
        </Alert>

        <EnvironmentConfig />

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Setup Instructions
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Step 1:</strong> Copy .env.example to .env
            <br />
            <strong>Step 2:</strong> Add your Stripe publishable key (get from https://dashboard.stripe.com/apikeys)
            <br />
            <strong>Step 3:</strong> Add your Church ID and reCAPTCHA site key
            <br />
            <strong>Step 4:</strong> Restart the dev server
          </Alert>

          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'grey.100' }}>
            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>
{`# .env file contents:
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_key_here
VITE_CHURCH_ID=your_church_id
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key`}
            </Typography>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Component Examples
          </Typography>

          <Stack spacing={2}>
            <Box>
              <Button 
                variant={activeTab === 'authenticated' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('authenticated')}
                sx={{ mr: 1 }}
              >
                Authenticated Donation
              </Button>
              <Button 
                variant={activeTab === 'guest' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('guest')}
              >
                Guest Donation
              </Button>
            </Box>

            <DonationComponentWrapper requireStripe={true}>
              {activeTab === 'authenticated' ? (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Authenticated Donation Flow
                  </Typography>
                  <MockDonationForm />
                </Box>
              ) : (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Guest Donation Flow
                  </Typography>
                  <MockNonAuthDonation />
                </Box>
              )}
            </DonationComponentWrapper>
          </Stack>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Available Donation Components
          </Typography>
          
          <Stack spacing={2}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Main Components</strong>
              </Typography>
              <Typography variant="body2">
                • <strong>DonationForm:</strong> Authenticated user donation form
                <br />• <strong>NonAuthDonation:</strong> Guest donation form
                <br />• <strong>PaymentMethods:</strong> Manage saved payment methods
                <br />• <strong>RecurringDonations:</strong> View and manage recurring donations
              </Typography>
            </Box>

            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Payment Forms</strong>
              </Typography>
              <Typography variant="body2">
                • <strong>CardForm:</strong> Credit card payment with Stripe Elements
                <br />• <strong>BankForm:</strong> Bank account payment for ACH transfers
              </Typography>
            </Box>

            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Fund Management</strong>
              </Typography>
              <Typography variant="body2">
                • <strong>FundDonation:</strong> Single fund donation component
                <br />• <strong>FundDonations:</strong> Multi-fund donation management
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Mock Data Examples
          </Typography>
          
          <Stack spacing={3}>
            <Box>
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

            <Box>
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

            <Box>
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
          </Stack>
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            User Context
          </Typography>
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
        </Paper>

        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Integration Architecture
          </Typography>
          
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Environment Variables vs API Configuration</strong>
            <br />
            The playground uses environment variables for ease of testing, but production apps typically fetch 
            Stripe configuration from API endpoints for security and per-church customization.
          </Alert>

          <Stack spacing={2}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Playground Configuration (Environment Variables)</strong>
              </Typography>
              <Typography variant="body2">
                • VITE_STRIPE_PUBLISHABLE_KEY - Stripe publishable key
                <br />• VITE_CHURCH_ID - Church identifier
                <br />• VITE_RECAPTCHA_SITE_KEY - reCAPTCHA site key
              </Typography>
            </Box>

            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                <strong>Production Configuration (API-based)</strong>
              </Typography>
              <Typography variant="body2">
                • GET /gateways/churchId/{'{churchId}'} - Fetch Stripe configuration
                <br />• Per-church Stripe account configuration
                <br />• Secure server-side key management
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, bgcolor: 'warning.light' }}>
          <Typography variant="h6" gutterBottom>
            Testing with Stripe
          </Typography>
          <Alert severity="warning">
            <strong>Test Mode Requirements:</strong>
            <br />• Use test publishable key (starts with pk_test_)
            <br />• Test card: 4242 4242 4242 4242
            <br />• Any future expiry date and CVC
            <br />• Test bank account: routing 110000000, account 000123456789
            <br /><br />
            <strong>Never use live keys in development!</strong>
          </Alert>
        </Paper>
      </Stack>
    </ComponentPage>
  );
}