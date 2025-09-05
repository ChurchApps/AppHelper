// import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import type { PaymentMethod, PaymentGateway, MultiGatewayDonationInterface } from '../../../packages/donations/src/helpers';

// This component tests that all our exports are working correctly
export function PayPalTest() {
  // Test the interfaces by creating mock objects
  const mockPaymentMethod: PaymentMethod = {
    id: "test-1",
    type: "paypal",
    provider: "paypal",
    name: "Test PayPal",
    email: "test@example.com"
  };

  const mockGateway: PaymentGateway = {
    id: "gateway-1",
    provider: "paypal",
    publicKey: "test-key",
    enabled: true
  };

  const mockDonation: MultiGatewayDonationInterface = {
    id: "donation-1",
    type: "paypal",
    provider: "paypal",
    person: {
      id: "person-1",
      email: "test@example.com",
      name: "Test User"
    },
    amount: 25.00,
    funds: []
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          PayPal Integration Test
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This component verifies that all PayPal-related exports are working correctly.
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Mock Payment Method:</Typography>
          <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
            {JSON.stringify(mockPaymentMethod, null, 2)}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Mock Gateway:</Typography>
          <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
            {JSON.stringify(mockGateway, null, 2)}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Mock Donation:</Typography>
          <Typography variant="body2" component="pre" sx={{ fontSize: '0.75rem' }}>
            {JSON.stringify(mockDonation, null, 2)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}