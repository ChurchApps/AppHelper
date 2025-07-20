import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button, Card, CardContent, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';

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

const notesComponents = [
  {
    name: 'Notes',
    description: 'Complete notes management system with display, add, and edit functionality',
    usage: ['B1App: 2 files', 'ChumsApp: 14 files', 'LessonsApp: none'],
    category: 'Container',
    complexity: 'Medium'
  },
  {
    name: 'Note',
    description: 'Individual note display component with edit and delete options',
    usage: ['B1App: 2 files', 'ChumsApp: minimal', 'LessonsApp: none'],
    category: 'Item',
    complexity: 'Low'
  },
  {
    name: 'AddNote',
    description: 'Form component for creating new notes',
    usage: ['B1App: 2 files', 'ChumsApp: none', 'LessonsApp: none'],
    category: 'Form',
    complexity: 'Low'
  }
];

export default function AppHelperNotesPage() {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);

  const renderComponent = (component: any) => {
    return (
      <Alert severity="info">
        <strong>{component.name} Demo</strong>
        <br />
        {component.description}
        <br /><br />
        This component requires authentication context and API integration which may not be fully available in this demo environment.
      </Alert>
    );
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
              color={usage.includes('none') ? 'error' : 'success'}
              variant="outlined"
            />
          ))}
        </Stack>

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
    <ComponentPage title="@churchapps/apphelper - Notes Components">
      <Stack spacing={4}>
        <Alert severity="info">
          <strong>Notes Components from @churchapps/apphelper Package</strong>
          <br />
          This page demonstrates all {notesComponents.length} notes management components.
        </Alert>

        <Box>
          <Typography variant="h5" gutterBottom>
            Notes Components ({notesComponents.length} total)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Click Show Demo to see component information.
          </Alert>
          {notesComponents.map(component => renderComponentCard(component))}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>Usage Analysis</Typography>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Adoption Patterns</Typography>
                <Typography variant="body2">
                  ChumsApp: 14 files using Notes (primary adopter for church management).
                  B1App: 2 files using Notes and AddNote (specialized use cases).
                  LessonsApp: No adoption (opportunity for lesson annotations).
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Stack>
    </ComponentPage>
  );
}