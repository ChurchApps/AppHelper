import React from 'react';
import { Container, Box, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

export default function DonationPage() {
  const context = React.useContext(UserContext);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2, mb: 2 }}>
        <Link to="/">← Back to Home</Link>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
          Donation Components
        </Typography>
        
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Donation Components Demo</Typography>
          The donation components require real user authentication and Stripe configuration.
          <br /><br />
          <strong>Components available:</strong>
          <ul>
            <li>DonationForm - Main donation form with Stripe integration</li>
            <li>PaymentMethods - Manage saved payment methods</li>
            <li>DonationSummary - Display donation history</li>
            <li>RecurringDonations - Manage recurring donations</li>
          </ul>
          <br />
          <strong>Requirements:</strong>
          <ul>
            <li>User must be authenticated with valid church context</li>
            <li>Stripe API keys must be configured</li>
            <li>Church must have donation funds configured</li>
          </ul>
        </Alert>

        {!context?.user && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Please log in to see the donation components in action.
          </Alert>
        )}

        {context?.user && (
          <Alert severity="success" sx={{ mt: 2 }}>
            You are logged in! The donation components would be functional here with proper Stripe configuration.
          </Alert>
        )}
      </Box>
    </Container>
  );
}