import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import UserContext from '../UserContext';
import { 
  NavItem, 
  AppList, 
  ChurchList, 
  UserMenu,
  NewPrivateMessage,
  PrivateMessageDetails
} from '@churchapps/apphelper';
import { 
  mockApps, 
  mockChurches, 
  mockNavItems, 
  mockPrivateMessages
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

export function WrapperTestPage() {
  const context = React.useContext(UserContext);
  const [showNewMessage, setShowNewMessage] = React.useState(false);
  const [showMessageDetails, setShowMessageDetails] = React.useState(false);
  const [selectedChurch, setSelectedChurch] = React.useState(mockChurches[0]);
  const [selectedMessage, setSelectedMessage] = React.useState(mockPrivateMessages[0]);

  const handleNavClick = (url: string, label: string) => {
    console.log(`Navigation clicked: ${label} -> ${url}`);
    alert(`Would navigate to: ${label} (${url})`);
  };

  const handleChurchSelect = (church: any) => {
    setSelectedChurch(church);
    console.log('Selected church:', church);
    alert(`Church selected: ${church.name}`);
  };

  const handleMessageSent = () => {
    console.log('Message sent!');
    alert('Message sent successfully!');
    setShowNewMessage(false);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    alert('Logout functionality would be triggered here');
  };

  const handleProfile = () => {
    console.log('Profile clicked');
    alert('Profile page would open here');
  };

  return (
    <ComponentPage title="Wrapper Components - Functional Examples">
      <Stack spacing={4}>
        <Alert severity="info">
          This page demonstrates functional AppHelper wrapper components with real interactions and navigation.
        </Alert>

        <Box>
          <Typography variant="h6" gutterBottom>NavItem</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Navigation item components for drawer menus
          </Alert>
          <Stack spacing={1} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
            {mockNavItems.map((item, index) => (
              <NavItem
                key={index}
                icon={item.icon}
                label={item.label}
                url={item.url}
                onClick={() => handleNavClick(item.url, item.label)}
              />
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>AppList</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            List of available ChurchApps applications
          </Alert>
          <AppList
            apps={mockApps}
            currentApp="Playground"
            context={context}
          />
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>ChurchList</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            List of churches for multi-church users
          </Alert>
          <ChurchList
            churches={mockChurches}
            selectedChurch={selectedChurch}
            onSelect={handleChurchSelect}
          />
          <Alert severity="success" sx={{ mt: 2 }}>
            Selected church: {selectedChurch.name}
          </Alert>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>UserMenu</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            User menu with profile and logout options
          </Alert>
          <UserMenu
            context={context}
            onLogout={handleLogout}
            onProfile={handleProfile}
          />
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>NewPrivateMessage</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Modal for composing new private messages
          </Alert>
          <Button 
            onClick={() => setShowNewMessage(true)}
            variant="outlined"
          >
            Compose New Message
          </Button>
          <NewPrivateMessage
            show={showNewMessage}
            onHide={() => setShowNewMessage(false)}
            context={context}
            onSent={handleMessageSent}
          />
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>PrivateMessageDetails</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Component for displaying private message details
          </Alert>
          <Stack spacing={2}>
            <Typography variant="subtitle2">Sample Messages:</Typography>
            {mockPrivateMessages.map((message, index) => (
              <Box key={index} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle2">{message.subject}</Typography>
                <Typography variant="body2" color="textSecondary">
                  From: {message.fromPerson.displayName} | 
                  To: {message.toPerson.displayName} | 
                  {message.timeSent.toLocaleDateString()}
                </Typography>
                <Button 
                  size="small" 
                  onClick={() => {
                    setSelectedMessage(message);
                    setShowMessageDetails(true);
                  }}
                >
                  View Details
                </Button>
              </Box>
            ))}
          </Stack>
          
          {showMessageDetails && (
            <Box sx={{ mt: 2, border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="h6" gutterBottom>Message Details</Typography>
              <PrivateMessageDetails
                message={selectedMessage}
                context={context}
                onClose={() => setShowMessageDetails(false)}
                onReply={() => {
                  console.log('Reply clicked');
                  alert('Reply functionality would open here');
                }}
              />
            </Box>
          )}
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Current User Context</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Display current user context information
          </Alert>
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2">User Information:</Typography>
            <Typography>Name: {context?.person?.name?.display || 'Not available'}</Typography>
            <Typography>Email: {context?.person?.contactInfo?.email || 'Not available'}</Typography>
            <Typography>Church: {context?.userChurch?.church?.name || 'Not available'}</Typography>
            <Typography>Permissions: {context?.userChurch?.permissions?.length || 0} permissions</Typography>
          </Box>
        </Box>
      </Stack>
    </ComponentPage>
  );
}