import { useState } from 'react';
import { Container, Box, Typography, Card, CardContent, Alert, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { MultiGatewayDonationForm } from '../../../packages/donations/src/components/MultiGatewayDonationForm';
import type { PaymentMethod, PaymentGateway } from '../../../packages/donations/src/helpers';
import { PersonInterface, ChurchInterface } from '@churchapps/helpers';
import { PayPalTest } from '../components/PayPalTest';

// Mock data for testing
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

export default function PayPalDonationPage() {
  const [donationResult, setDonationResult] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<"stripe" | "paypal">("paypal");

  const handleDonationSuccess = (message: string) => {
    setDonationResult(`✅ Donation successful: ${message}`);
  };

  // const handleDonationError = (error: string) => {
  //   setDonationResult(`❌ Donation failed: ${error}`);
  // };

  const handleProviderChange = (provider: "stripe" | "paypal") => {
    setSelectedProvider(provider);
    setDonationResult(null);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2, mb: 2 }}>
        <Link to="/">← Back to Home</Link>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
          Multi-Gateway Donation Testing
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>PayPal + Stripe Donation Components</Typography>
          This playground demonstrates the new multi-gateway donation form supporting both Stripe and PayPal.
          <br /><br />
          <strong>Features:</strong>
          <ul>
            <li>Dynamic payment provider selection</li>
            <li>Provider-specific payment methods</li>
            <li>Automatic fee calculation per provider</li>
            <li>Unified donation flow</li>
          </ul>
        </Alert>

        {donationResult && (
          <Alert severity={donationResult.includes('✅') ? 'success' : 'error'} sx={{ mb: 3 }}>
            {donationResult}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Provider Selection
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Button 
                    variant={selectedProvider === "stripe" ? "contained" : "outlined"}
                    onClick={() => handleProviderChange("stripe")}
                    sx={{ mr: 1 }}
                  >
                    Stripe
                  </Button>
                  <Button 
                    variant={selectedProvider === "paypal" ? "contained" : "outlined"}
                    onClick={() => handleProviderChange("paypal")}
                  >
                    PayPal
                  </Button>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Current Provider: <strong>{selectedProvider === "stripe" ? "Stripe" : "PayPal"}</strong>
                </Typography>
                
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Available Payment Methods:
                </Typography>
                <ul>
                  {mockPaymentMethods
                    .filter(pm => pm.provider === selectedProvider)
                    .map(pm => (
                      <li key={pm.id}>
                        {pm.name} {pm.last4 ? `****${pm.last4}` : pm.email}
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Gateway Configuration
                </Typography>
                <Typography variant="body2">
                  Enabled Gateways:
                </Typography>
                <ul>
                  {mockGateways
                    .filter(gw => gw.enabled)
                    .map(gw => (
                      <li key={gw.id}>
                        <strong>{gw.provider}</strong> - {gw.publicKey.substring(0, 20)}...
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Multi-Gateway Donation Form
              </Typography>
              <Alert severity="warning" sx={{ mb: 2 }}>
                This is a demo form with mock data. In a real environment, this would connect to your payment APIs.
              </Alert>
              
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

        <Box sx={{ mt: 4 }}>
          <PayPalTest />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Implementation Notes
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Backend Integration:</strong> The form sends requests to:
              </Typography>
              <ul>
                <li><code>POST /donate/charge</code> - One-time donations</li>
                <li><code>POST /donate/subscribe</code> - Recurring donations</li>
                <li><code>POST /donate/fee</code> - Fee calculation</li>
              </ul>
              
              <Typography variant="body2" paragraph sx={{ mt: 2 }}>
                <strong>PayPal-specific fields:</strong>
              </Typography>
              <ul>
                <li><code>provider: "paypal"</code> in request body</li>
                <li>PayPal Client ID and Secret in Gateway configuration</li>
                <li>Webhook endpoints for PayPal events</li>
              </ul>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}