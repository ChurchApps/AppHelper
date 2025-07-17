import React from 'react';
import { Container, Box, Typography, Alert, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';

// Import wrapper components to test their existence
import { 
  SiteWrapper, 
  NavItem, 
  AppList, 
  ChurchList, 
  UserMenu,
  NewPrivateMessage,
  PrivateMessageDetails
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

export function WrapperTestPage() {
  const wrapperComponents = [
    { name: 'SiteWrapper', component: SiteWrapper },
    { name: 'NavItem', component: NavItem },
    { name: 'AppList', component: AppList },
    { name: 'ChurchList', component: ChurchList },
    { name: 'UserMenu', component: UserMenu },
    { name: 'NewPrivateMessage', component: NewPrivateMessage },
    { name: 'PrivateMessageDetails', component: PrivateMessageDetails }
  ];

  return (
    <ComponentPage title="Wrapper Components">
      <Stack spacing={3}>
        <Alert severity="info">
          This page tests the availability of application wrapper components from @churchapps/apphelper.
          These components provide the main application shell and navigation structure.
        </Alert>

        <Alert severity="warning">
          <strong>Note:</strong> These wrapper components require user context, navigation setup,
          and specific props to function properly. This page verifies import availability rather than full functionality.
        </Alert>

        <Box>
          <Typography variant="h6" gutterBottom>Successfully Imported Components:</Typography>
          <Stack spacing={2}>
            {wrapperComponents.map((item) => (
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
              <Typography variant="subtitle2" gutterBottom>Main Application Shell</Typography>
              <Typography variant="body2">SiteWrapper - Main application wrapper with navigation drawer, user authentication context, notification system, and dynamic theming</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Navigation</Typography>
              <Typography variant="body2">NavItem - Navigation item component for drawer menus</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>App & Church Selection</Typography>
              <Typography variant="body2">AppList - List of available ChurchApps applications<br/>ChurchList - List of churches for multi-church users</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>User Interface</Typography>
              <Typography variant="body2">UserMenu - User menu with profile and logout options</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Messaging</Typography>
              <Typography variant="body2">NewPrivateMessage - Modal for composing new private messages<br/>PrivateMessageDetails - Component for displaying private message details</Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </ComponentPage>
  );
}