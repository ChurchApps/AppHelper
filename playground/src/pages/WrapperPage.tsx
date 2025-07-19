import React from 'react';
import { Container, Box, Typography, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

export default function WrapperPage() {
  const context = React.useContext(UserContext);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2, mb: 2 }}>
        <Link to="/">← Back to Home</Link>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
          Wrapper Components
        </Typography>
        
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>SiteWrapper & Navigation Demo</Typography>
          The SiteWrapper component provides the main application shell including:
          <br /><br />
          <strong>Components available:</strong>
          <ul>
            <li>SiteWrapper - Main application shell with navigation</li>
            <li>UserMenu - User account and church management</li>
            <li>ChurchSelector - Switch between multiple churches</li>
            <li>PrivateMessage - Internal messaging system</li>
            <li>AppButton - Quick access to ChurchApps suite</li>
          </ul>
          <br />
          <strong>Features:</strong>
          <ul>
            <li>Responsive navigation drawer</li>
            <li>User authentication integration</li>
            <li>Multi-church support</li>
            <li>Theming and branding customization</li>
          </ul>
        </Alert>

        {!context?.user && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Please log in to see the wrapper components in action. The SiteWrapper requires user context for navigation and church management.
          </Alert>
        )}

        {context?.user && (
          <Alert severity="success" sx={{ mt: 2 }}>
            You are logged in! The SiteWrapper component would be fully functional here with navigation, user menu, and church selector.
          </Alert>
        )}
      </Box>
    </Container>
  );
}