import React from 'react';
import { Container, Box, Typography, Alert, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';

// Import header components to test their existence
import { 
  Banner,
  SiteHeader
} from '@churchapps/apphelper';

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

export function HeaderTestPage() {
  const headerComponents = [
    { name: 'Banner', component: Banner },
    { name: 'SiteHeader', component: SiteHeader }
  ];

  return (
    <ComponentPage title="Header Components">
      <Stack spacing={3}>
        <Alert severity="info">
          This page tests the availability of header and navigation components from @churchapps/apphelper.
          These components provide site branding and navigation functionality.
        </Alert>

        <Alert severity="warning">
          <strong>Note:</strong> These header components require church/organization data,
          appearance configuration, and user context to function properly. This page verifies import 
          availability rather than full functionality.
        </Alert>

        <Box>
          <Typography variant="h6" gutterBottom>Successfully Imported Components:</Typography>
          <Stack spacing={2}>
            {headerComponents.map((item) => (
              <Box key={item.name} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>{item.name}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ✅ Component type: {typeof item.component}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ✅ Successfully imported from @churchapps/apphelper
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Component Categories:</Typography>
          <Stack spacing={2}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Church Banner</Typography>
              <Typography variant="body2">Banner - Church banner component with customizable styling, displays church information including name, address, phone, and website</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Site Header</Typography>
              <Typography variant="body2">SiteHeader - Main site header with navigation and user menu, includes logo display, church name, and integrated user authentication controls</Typography>
            </Box>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Customization Features:</Typography>
          <Stack spacing={2}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Appearance Configuration</Typography>
              <Typography variant="body2">Both components support custom color schemes, logos, and branding through appearance settings</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Responsive Design</Typography>
              <Typography variant="body2">Components adapt to different screen sizes and include mobile-friendly navigation</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Integration</Typography>
              <Typography variant="body2">Designed to work seamlessly with SiteWrapper and other ChurchApps components</Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </ComponentPage>
  );
}