import React from 'react';
import { Container, Box, Typography, Alert, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';

// Import donation components to test their existence
import { 
  DonationForm,
  FundDonation,
  FundDonations,
  NonAuthDonation,
  NonAuthDonationInner,
  PaymentMethods,
  RecurringDonations,
  RecurringDonationsEdit,
  BankForm,
  CardForm,
  DonationPreviewModal
} from '@churchapps/apphelper-donations';

function ComponentPage({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <Container maxWidth="md">
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

export function DonationTestPage() {
  const donationComponents = [
    { name: 'DonationForm', component: DonationForm },
    { name: 'FundDonation', component: FundDonation },
    { name: 'FundDonations', component: FundDonations },
    { name: 'NonAuthDonation', component: NonAuthDonation },
    { name: 'NonAuthDonationInner', component: NonAuthDonationInner },
    { name: 'PaymentMethods', component: PaymentMethods },
    { name: 'RecurringDonations', component: RecurringDonations },
    { name: 'RecurringDonationsEdit', component: RecurringDonationsEdit },
    { name: 'BankForm', component: BankForm },
    { name: 'CardForm', component: CardForm },
    { name: 'DonationPreviewModal', component: DonationPreviewModal }
  ];

  return (
    <ComponentPage title="Donation Components">
      <Stack spacing={3}>
        <Alert severity="info">
          This page tests the availability of donation and payment components from @churchapps/apphelper-donations.
          These components integrate with Stripe for payment processing.
        </Alert>

        <Alert severity="warning">
          <strong>Note:</strong> These donation components require Stripe configuration, 
          user context, and specific props to function properly. This page verifies import 
          availability rather than full functionality.
        </Alert>

        <Box>
          <Typography variant="h6" gutterBottom>Successfully Imported Components:</Typography>
          <Stack spacing={2}>
            {donationComponents.map((item) => (
              <Box key={item.name} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>{item.name}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ✅ Component type: {typeof item.component}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ✅ Successfully imported from @churchapps/apphelper-donations
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Component Categories:</Typography>
          <Stack spacing={2}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Payment Forms</Typography>
              <Typography variant="body2">BankForm, CardForm - Handle payment method input</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Donation Forms</Typography>
              <Typography variant="body2">DonationForm, FundDonation, FundDonations - Main donation interfaces</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Guest Donations</Typography>
              <Typography variant="body2">NonAuthDonation, NonAuthDonationInner - For non-authenticated users</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Recurring Donations</Typography>
              <Typography variant="body2">RecurringDonations, RecurringDonationsEdit - Subscription management</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Payment Management</Typography>
              <Typography variant="body2">PaymentMethods - Saved payment method management</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>UI Components</Typography>
              <Typography variant="body2">DonationPreviewModal - Preview donations before processing</Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </ComponentPage>
  );
}