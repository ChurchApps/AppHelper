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
  mockPrivateMessages,
  mockUserChurches
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
  const context = React.useContext(UserContext) as any;
  const [showNewMessage, setShowNewMessage] = React.useState(false);
  const [showMessageDetails, setShowMessageDetails] = React.useState(false);
  const [selectedMessage, setSelectedMessage] = React.useState(mockPrivateMessages[0]);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [notificationCounts, setNotificationCounts] = React.useState({ notificationCount: 3, pmCount: 2 });

  const handleNavClick = (url: string, label: string) => {
    console.log(`Navigation clicked: ${label} -> ${url}`);
    alert(`Would navigate to: ${label} (${url})`);
  };

  const handleNavigate = (url: string) => {
    console.log('Navigation:', url);
    alert(`Would navigate to: ${url}`);
  };

  const handleSelectMessage = (pm: any) => {
    setSelectedMessage(pm);
    setShowMessageDetails(true);
    setShowNewMessage(false);
  };

  const loadCounts = () => {
    console.log('Loading notification counts...');
    // Simulate loading counts
    setNotificationCounts({ notificationCount: Math.floor(Math.random() * 10), pmCount: Math.floor(Math.random() * 5) });
  };

  const handleBack = () => {
    setShowNewMessage(false);
    setShowMessageDetails(false);
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
            appName="Playground"
            currentUserChurch={context?.userChurch || mockUserChurches[0]}
            onNavigate={handleNavigate}
          />
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>ChurchList</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            List of churches for multi-church users
          </Alert>
          <ChurchList
            userChurches={mockUserChurches}
            currentUserChurch={context?.userChurch || mockUserChurches[0]}
            context={context}
          />
          <Alert severity="success" sx={{ mt: 2 }}>
            Current church: {context?.userChurch?.church?.name || mockUserChurches[0].church.name}
          </Alert>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>UserMenu</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            User menu with profile, church switching, and app navigation
          </Alert>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Note: UserMenu shows inline and is normally used within a header component.
            Click the user avatar to see the dropdown menu.
          </Alert>
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, display: 'inline-block' }}>
            <UserMenu
              notificationCounts={notificationCounts}
              loadCounts={loadCounts}
              userName={context?.person?.name?.display || "John Doe"}
              profilePicture={context?.person?.photo || "/images/logo-login.png"}
              userChurches={mockUserChurches}
              currentUserChurch={context?.userChurch || mockUserChurches[0]}
              context={context}
              appName="Playground"
              onNavigate={handleNavigate}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button onClick={loadCounts} variant="outlined" size="small">
              Refresh Notification Counts
            </Button>
          </Box>
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
          {showNewMessage && (
            <Box sx={{ mt: 2, border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <NewPrivateMessage
                context={context}
                onSelectMessage={handleSelectMessage}
                onBack={handleBack}
              />
            </Box>
          )}
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
                privateMessage={selectedMessage}
                context={context}
                onBack={handleBack}
                refreshKey={refreshKey}
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