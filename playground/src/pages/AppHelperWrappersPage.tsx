import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button, Card, CardContent, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { 
  SiteWrapper,
  NavItem,
  UserMenu,
  ChurchList,
  AppList,
  NewPrivateMessage,
  PrivateMessageDetails
} from '@churchapps/apphelper';

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

const wrapperComponents = [
  {
    name: 'SiteWrapper',
    component: SiteWrapper,
    description: 'Main application shell with navigation drawer, user authentication context, notification system',
    usage: ['B1App: ❌', 'ChumsApp: ✅ (commented)', 'LessonsApp: ❌'],
    category: 'Layout',
    complexity: 'High',
    dependencies: 'UserMenu, Drawers, multiple helpers'
  },
  {
    name: 'NavItem',
    component: NavItem,
    description: 'Navigation item component for menus and sidebars',
    usage: ['B1App: 3 files', 'ChumsApp: ✅ (mostly commented)', 'LessonsApp: ✅'],
    category: 'Navigation',
    complexity: 'Low',
    dependencies: 'Material-UI Link, Router'
  },
  {
    name: 'UserMenu',
    component: UserMenu,
    description: 'User menu dropdown with profile, settings, and logout options',
    usage: ['B1App: 1 file', 'ChumsApp: ❌', 'LessonsApp: ❌'],
    category: 'User Interface',
    complexity: 'Medium',
    dependencies: 'ChurchList, UserHelper'
  },
  {
    name: 'ChurchList',
    component: ChurchList,
    description: 'Church selection and management component',
    usage: ['B1App: ❌', 'ChumsApp: ❌', 'LessonsApp: ❌'],
    category: 'User Interface',
    complexity: 'Medium',
    dependencies: 'NavItem, ApiHelper'
  },
  {
    name: 'AppList',
    component: AppList,
    description: 'Application list component for navigation between ChurchApps',
    usage: ['B1App: ❌', 'ChumsApp: ❌', 'LessonsApp: ❌'],
    category: 'Navigation',
    complexity: 'Medium',
    dependencies: 'External app configuration'
  },
  {
    name: 'NewPrivateMessage',
    component: NewPrivateMessage,
    description: 'Component for creating new private messages',
    usage: ['B1App: 1 file', 'ChumsApp: ❌', 'LessonsApp: ❌'],
    category: 'Messaging',
    complexity: 'Medium',
    dependencies: 'AddNote, SmallButton'
  },
  {
    name: 'PrivateMessageDetails',
    component: PrivateMessageDetails,
    description: 'Component for viewing and managing private message details',
    usage: ['B1App: 1 file', 'ChumsApp: ❌', 'LessonsApp: ❌'],
    category: 'Messaging',
    complexity: 'Medium',
    dependencies: 'SmallButton, Notes'
  }
];

const mockData = {
  navItems: [
    { label: 'Dashboard', to: '/dashboard', icon: 'dashboard' },
    { label: 'People', to: '/people', icon: 'people' },
    { label: 'Groups', to: '/groups', icon: 'group' },
    { label: 'Events', to: '/events', icon: 'event' },
    { label: 'Donations', to: '/donations', icon: 'payments' }
  ],
  churches: [
    { id: 1, name: 'First Baptist Church', city: 'Springfield' },
    { id: 2, name: 'Grace Community Church', city: 'Portland' },
    { id: 3, name: 'Trinity Methodist', city: 'Austin' }
  ],
  apps: [
    { name: 'ChumsApp', url: 'https://chums.church', description: 'Church Management' },
    { name: 'B1App', url: 'https://b1.church', description: 'Bible Study' },
    { name: 'LessonsApp', url: 'https://lessons.church', description: 'Lesson Planning' }
  ],
  privateMessage: {
    id: 1,
    fromPerson: { name: { display: 'John Smith' } },
    toPerson: { name: { display: 'Jane Doe' } },
    subject: 'Sample Private Message',
    body: 'This is a sample private message for demonstration purposes.',
    dateCreated: new Date()
  }
};

export default function AppHelperWrappersPage() {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);

  const renderComponent = (component: any) => {
    const Component = component.component;
    
    try {
      switch (component.name) {
        case 'SiteWrapper':
          return (
            <Alert severity="warning">
              <strong>SiteWrapper Demo</strong>
              <br />
              SiteWrapper is a complex layout component that wraps entire applications. 
              It requires extensive context setup and would interfere with the playground's own layout.
              <br /><br />
              <strong>Features:</strong> Navigation drawer, user authentication context, notification system, theming
            </Alert>
          );
          
        case 'NavItem':
          return (
            <Alert severity="info">
              NavItem components would appear here with navigation labels and icons for each menu item.
            </Alert>
          );
          
        case 'UserMenu':
          return (
            <Alert severity="info">
              <strong>UserMenu Demo</strong>
              <br />
              UserMenu requires full authentication context and church data to function properly.
              It typically appears in the top navigation bar with user profile options.
              <br /><br />
              <strong>Features:</strong> Profile dropdown, church switching, logout functionality
            </Alert>
          );
          
        case 'ChurchList':
          return (
            <Alert severity="info">
              <strong>ChurchList Demo</strong>
              <br />
              ChurchList displays available churches for the current user.
              <br /><br />
              <strong>Sample Churches:</strong>
              {mockData.churches.map(church => (
                <div key={church.id}>• {church.name} - {church.city}</div>
              ))}
            </Alert>
          );
          
        case 'AppList':
          return (
            <Alert severity="info">
              <strong>AppList Demo</strong>
              <br />
              AppList shows available ChurchApps applications for navigation.
              <br /><br />
              <strong>Available Apps:</strong>
              {mockData.apps.map(app => (
                <div key={app.name}>• <strong>{app.name}</strong> - {app.description}</div>
              ))}
            </Alert>
          );
          
        case 'NewPrivateMessage':
          return (
            <Alert severity="info">
              <strong>NewPrivateMessage Demo</strong>
              <br />
              NewPrivateMessage provides a form for creating new private messages between users.
              Requires authentication context and recipient selection.
              <br /><br />
              <strong>Features:</strong> Recipient selection, subject/body input, send functionality
            </Alert>
          );
          
        case 'PrivateMessageDetails':
          return (
            <Alert severity="info">
              <strong>PrivateMessageDetails Demo</strong>
              <br />
              Displays details of a private message with reply and management options.
              <br /><br />
              <strong>Sample Message:</strong>
              <br />From: {mockData.privateMessage.fromPerson.name.display}
              <br />To: {mockData.privateMessage.toPerson.name.display}
              <br />Subject: {mockData.privateMessage.subject}
              <br />Date: {mockData.privateMessage.dateCreated.toLocaleDateString()}
            </Alert>
          );
          
        default:
          return <Component />;
      }
    } catch (error) {
      return (
        <Alert severity="error">
          Error rendering {component.name}: {String(error)}
        </Alert>
      );
    }
  };

  const renderComponentCard = (component: any) => (
    <Card key={component.name} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3">
            {component.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip label={component.category} color="primary" variant="outlined" size="small" />
            <Chip 
              label={component.complexity} 
              color={component.complexity === 'High' ? 'error' : component.complexity === 'Medium' ? 'warning' : 'success'} 
              variant="outlined" 
              size="small" 
            />
            <Button
              variant={selectedComponent === component.name ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setSelectedComponent(selectedComponent === component.name ? null : component.name)}
            >
              {selectedComponent === component.name ? 'Hide' : 'Show'} Demo
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {component.description}
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom>Usage Across Apps:</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
          {component.usage.map((usage: string, index: number) => (
            <Chip 
              key={index} 
              label={usage} 
              size="small" 
              color={usage.includes('❌') ? 'error' : 'success'}
              variant="outlined"
            />
          ))}
        </Stack>
        
        <Typography variant="subtitle2" gutterBottom>Dependencies:</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {component.dependencies}
        </Typography>

        {selectedComponent === component.name && (
          <Box sx={{ 
            border: 1, 
            borderColor: 'divider', 
            borderRadius: 1, 
            p: 2, 
            mt: 2
          }}>
            <Typography variant="subtitle2" gutterBottom>Live Demo:</Typography>
            <ErrorBoundary>
              {renderComponent(component)}
            </ErrorBoundary>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <ComponentPage title="@churchapps/apphelper - Wrapper Components">
      <Stack spacing={4}>
        <Alert severity="info">
          <strong>Wrapper Components from @churchapps/apphelper Package</strong>
          <br />
          This page demonstrates all {wrapperComponents.length} wrapper components that provide layout, navigation, and high-level application structure.
        </Alert>

        <Alert severity="warning">
          <strong>Authentication Required</strong>
          <br />
          Most wrapper components require full user authentication context and may not render completely in this demo environment.
          The demos below show simplified versions or descriptions of functionality.
        </Alert>

        <Box>
          <Typography variant="h5" gutterBottom>
            Wrapper Components ({wrapperComponents.length} total)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Click "Show Demo" on any component card to see available demonstrations.
          </Alert>
          {wrapperComponents.map(component => renderComponentCard(component))}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>Usage Analysis</Typography>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Adoption Patterns</Typography>
                <Typography variant="body2">
                  <strong>Limited Adoption:</strong> Most wrapper components have low adoption rates across apps
                  <br />
                  <strong>NavItem:</strong> 4+ files across B1App and LessonsApp (basic navigation)
                  <br />
                  <strong>Private Messaging:</strong> 2 files in B1App only (specialized feature)
                  <br />
                  <strong>SiteWrapper:</strong> Only used in ChumsApp (commented out - complex integration)
                </Typography>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Integration Complexity</Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>High Complexity:</strong> SiteWrapper (full app layout)
                  <br />
                  <strong>Medium Complexity:</strong> UserMenu, ChurchList, AppList, Messaging components
                  <br />
                  <strong>Low Complexity:</strong> NavItem (standalone navigation element)
                  <br /><br />
                  Higher complexity components require more context setup and application-specific configuration.
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Architectural Role</Typography>
                <Typography variant="body2">
                  <strong>Layout Foundation:</strong> SiteWrapper provides complete application shell
                  <br />
                  <strong>Navigation Building Blocks:</strong> NavItem, UserMenu, AppList for menu construction
                  <br />
                  <strong>Feature Modules:</strong> Private messaging components for communication features
                  <br />
                  <strong>Church Context:</strong> ChurchList for multi-church applications
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Recommendations</Typography>
                <Typography variant="body2">
                  • <strong>Start Simple:</strong> Begin with NavItem for basic navigation needs
                  <br />
                  • <strong>Progressive Enhancement:</strong> Add UserMenu and ChurchList as authentication complexity grows
                  <br />
                  • <strong>Full Integration:</strong> Consider SiteWrapper for complete application overhaul
                  <br />
                  • <strong>Feature-Specific:</strong> Use messaging components only when private messaging is required
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>Context Requirements</Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            These components typically require extensive React context setup.
          </Alert>
          <Typography variant="body2">
            • <strong>UserContext:</strong> Current user, authentication state, permissions
            <br />
            • <strong>ChurchContext:</strong> Current church, available churches, church switching
            <br />
            • <strong>AppContext:</strong> Application configuration, routing, theming
            <br />
            • <strong>ApiHelper:</strong> Configured API endpoints and authentication tokens
            <br />
            • <strong>Router Context:</strong> React Router for navigation functionality
          </Typography>
        </Box>
      </Stack>
    </ComponentPage>
  );
}