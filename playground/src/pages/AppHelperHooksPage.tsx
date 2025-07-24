import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button, Card, CardContent, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { 
  useMountedState
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

const hooksData = [
  {
    name: 'useMountedState',
    hook: useMountedState,
    description: 'React hook that prevents state updates on unmounted components to avoid memory leaks',
    usage: ['B1App: 3 files', 'ChumsApp: 21 files', 'LessonsApp: none'],
    category: 'State Management',
    complexity: 'Low'
  }
];

function MountedStateDemo() {
  const isMounted = useMountedState();
  const [counter, setCounter] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (isMounted()) {
        setCounter(prev => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isMounted]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          useMountedState Demo
        </Typography>
        
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2">Component Mount Status:</Typography>
            <Chip 
              label={isMounted() ? 'Mounted' : 'Unmounted'} 
              color={isMounted() ? 'success' : 'error'} 
              size="small"
            />
          </Box>
          
          <Box>
            <Typography variant="subtitle2">Auto Counter:</Typography>
            <Typography variant="body1">
              Counter: {counter} (updates every second while mounted)
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function AppHelperHooksPage() {
  const [selectedHook, setSelectedHook] = React.useState<string | null>(null);

  const renderHookDemo = (hookData: any) => {
    switch (hookData.name) {
      case 'useMountedState':
        return <MountedStateDemo />;
      default:
        return (
          <Alert severity="info">
            No interactive demo available for {hookData.name}
          </Alert>
        );
    }
  };

  const renderHookCard = (hookData: any) => (
    <Card key={hookData.name} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3">
            {hookData.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip label={hookData.category} color="primary" variant="outlined" size="small" />
            <Chip 
              label={hookData.complexity} 
              color={hookData.complexity === 'High' ? 'error' : hookData.complexity === 'Medium' ? 'warning' : 'success'} 
              variant="outlined" 
              size="small" 
            />
            <Button
              variant={selectedHook === hookData.name ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setSelectedHook(selectedHook === hookData.name ? null : hookData.name)}
            >
              {selectedHook === hookData.name ? 'Hide' : 'Show'} Demo
            </Button>
          </Box>
        </Box>
        
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {hookData.description}
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom>Usage Across Apps:</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
          {hookData.usage.map((usage: string, index: number) => (
            <Chip 
              key={index} 
              label={usage} 
              size="small" 
              color={usage.includes('none') ? 'error' : 'success'}
              variant="outlined"
            />
          ))}
        </Stack>

        {selectedHook === hookData.name && (
          <Box sx={{ 
            border: 1, 
            borderColor: 'divider', 
            borderRadius: 1, 
            p: 2, 
            mt: 2
          }}>
            <Typography variant="subtitle2" gutterBottom>Live Demo:</Typography>
            <ErrorBoundary>
              {renderHookDemo(hookData)}
            </ErrorBoundary>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <ComponentPage title="@churchapps/apphelper - React Hooks">
      <Stack spacing={4}>
        <Alert severity="info">
          <strong>React Hooks from @churchapps/apphelper Package</strong>
          <br />
          This page demonstrates the React hooks available in AppHelper with interactive examples.
        </Alert>

        <Box>
          <Typography variant="h5" gutterBottom>
            Available Hooks ({hooksData.length} total)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Click Show Demo to see live interactive examples of each hook.
          </Alert>
          {hooksData.map(hook => renderHookCard(hook))}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>Usage Analysis</Typography>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Adoption Patterns</Typography>
                <Typography variant="body2">
                  useMountedState: 24 files total across applications.
                  ChumsApp shows heavy adoption (21 files) indicating complex async operations.
                  B1App has selective usage (3 files). LessonsApp has opportunity for improvement.
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Stack>
    </ComponentPage>
  );
}