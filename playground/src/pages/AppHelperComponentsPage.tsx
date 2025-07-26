import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button, Card, CardContent, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import UserContext from '../UserContext';
import { 
  ErrorMessages, 
  ExportLink, 
  DisplayBox, 
  FloatingSupport, 
  FormSubmissionEdit,
  HelpIcon,
  ImageEditor,
  InputBox,
  Loading,
  QuestionEdit,
  SmallButton,
  SupportModal
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

const coreComponents = [
  {
    name: 'ErrorMessages',
    component: ErrorMessages,
    description: 'Component for displaying error messages with dismiss functionality',
    usage: ['B1App: 22 files', 'ChumsApp: 29 files', 'LessonsApp: 25+ files'],
    props: { errors: ['Sample error message', 'Another error occurred'] }
  },
  {
    name: 'Loading',
    component: Loading,
    description: 'Loading spinner component',
    usage: ['B1App: 43 files', 'ChumsApp: 40 files', 'LessonsApp: ✅'],
    props: {}
  },
  {
    name: 'SmallButton',
    component: SmallButton,
    description: 'Compact button component with icon support',
    usage: ['B1App: 20 files', 'ChumsApp: 16 files', 'LessonsApp: ✅'],
    props: { icon: 'save', text: 'Save', onClick: () => console.log('SmallButton clicked') }
  },
  {
    name: 'DisplayBox',
    component: DisplayBox,
    description: 'Container component with header, icon, and help text',
    usage: ['B1App: 26 files', 'ChumsApp: 28 files', 'LessonsApp: ✅'],
    props: { 
      headerText: 'Sample Data Display', 
      headerIcon: 'people', 
      help: 'This is a sample display box',
      children: 'Content inside DisplayBox'
    }
  },
  {
    name: 'InputBox',
    component: InputBox,
    description: 'Enhanced input container with save/cancel functionality',
    usage: ['B1App: 23 files', 'ChumsApp: 35 files', 'LessonsApp: ✅'],
    props: {
      headerText: 'Edit Information',
      headerIcon: 'edit',
      saveFunction: () => console.log('InputBox save'),
      cancelFunction: () => console.log('InputBox cancel'),
      children: 'Input fields go here'
    }
  },
  {
    name: 'ExportLink',
    component: ExportLink,
    description: 'Link component for data export functionality',
    usage: ['B1App: 2 files', 'ChumsApp: 11 files', 'LessonsApp: ❌'],
    props: { data: [{ id: 1, name: 'Sample' }], filename: 'sample-export', text: 'Export Data' }
  },
  {
    name: 'ImageEditor',
    component: ImageEditor,
    description: 'Image editing and cropping component',
    usage: ['B1App: 5 files', 'ChumsApp: 6 files', 'LessonsApp: ❌'],
    props: { 
      photoUrl: "",
      aspectRatio: 1,
      onUpdate: (dataUrl: string) => console.log('Image updated:', dataUrl)
    }
  },
  {
    name: 'FormSubmissionEdit',
    component: FormSubmissionEdit,
    description: 'Component for editing form submissions',
    usage: ['B1App: 2 files', 'ChumsApp: 2 files', 'LessonsApp: ❌'],
    props: { 
      formSubmission: { id: 1, data: {} },
      onSave: (submission: any) => console.log('Form submission saved:', submission)
    }
  },
  {
    name: 'FloatingSupport',
    component: FloatingSupport,
    description: 'Floating support button component',
    usage: ['B1App: ❌', 'ChumsApp: ❌', 'LessonsApp: ✅'],
    props: { appName: 'Playground' }
  },
  {
    name: 'HelpIcon',
    component: HelpIcon,
    description: 'Icon with tooltip help text',
    usage: ['B1App: ❌', 'ChumsApp: 1 file', 'LessonsApp: ❌'],
    props: { text: 'This is helpful information displayed in a tooltip' }
  },
  {
    name: 'QuestionEdit',
    component: QuestionEdit,
    description: 'Component for editing form questions',
    usage: ['B1App: ❌', 'ChumsApp: 4 files', 'LessonsApp: ❌'],
    props: {
      question: { id: 1, title: 'Sample Question', questionType: 'Text' },
      onSave: (question: any) => console.log('Question saved:', question)
    }
  },
  {
    name: 'SupportModal',
    component: SupportModal,
    description: 'Modal component for support functionality',
    usage: ['B1App: ❌', 'ChumsApp: ❌', 'LessonsApp: ✅'],
    props: { 
      show: true,
      onHide: () => console.log('Support modal hidden'),
      appName: 'Playground'
    }
  }
];

export default function AppHelperComponentsPage() {
  const context = React.useContext(UserContext);
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleError = () => {
    setErrors(['Sample error message', 'Another error occurred', 'Validation failed']);
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const renderComponent = (component: any) => {
    const Component = component.component;
    
    // Handle special cases
    if (component.name === 'ErrorMessages') {
      return <ErrorMessages errors={errors} />;
    }
    
    if (component.name === 'SupportModal') {
      return (
        <Alert severity="info">
          SupportModal component would appear here with proper props configuration.
        </Alert>
      );
    }

    try {
      return <Component {...component.props} />;
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
          <Button
            variant={selectedComponent === component.name ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setSelectedComponent(selectedComponent === component.name ? null : component.name)}
          >
            {selectedComponent === component.name ? 'Hide' : 'Show'} Demo
          </Button>
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

        {selectedComponent === component.name && (
          <Box sx={{ 
            border: 1, 
            borderColor: 'divider', 
            borderRadius: 1, 
            p: 2, 
            mt: 2,
            minHeight: component.name === 'Loading' ? 100 : 'auto'
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
    <ComponentPage title="@churchapps/apphelper - Core Components">
      <Stack spacing={4}>
        <Alert severity="info">
          <strong>Core UI Components from @churchapps/apphelper Package</strong>
          <br />
          This page demonstrates all {coreComponents.length} core UI components with interactive examples and real usage data from the usage report.
        </Alert>

        <Box>
          <Typography variant="h5" gutterBottom>Interactive Controls</Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button onClick={handleError} variant="outlined">
              Generate Sample Errors
            </Button>
            <Button onClick={clearErrors} variant="outlined">
              Clear Errors
            </Button>
            <Button onClick={() => console.log('SupportModal demo')} variant="outlined">
              Show SupportModal
            </Button>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Core Components ({coreComponents.length} total)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Click "Show Demo" on any component card to see a live interactive example.
          </Alert>
          {coreComponents.map(component => renderComponentCard(component))}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>Usage Analysis</Typography>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Most Critical Components</Typography>
                <Typography variant="body2">
                  <strong>1. Loading</strong> - 83+ files across all apps (async operation indicator)
                  <br />
                  <strong>2. InputBox</strong> - 58+ files across all apps (form container)
                  <br />
                  <strong>3. ErrorMessages</strong> - 76+ files across all apps (error display)
                  <br />
                  <strong>4. DisplayBox</strong> - 54+ files across all apps (content display)
                  <br />
                  <strong>5. SmallButton</strong> - 36+ files across all apps (UI actions)
                </Typography>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Specialized Components</Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>ImageEditor</strong> - Used in 11 files (B1App: 5, ChumsApp: 6) for image processing
                  <br />
                  <strong>ExportLink</strong> - Used in 13 files (B1App: 2, ChumsApp: 11) for data export
                  <br />
                  <strong>FormSubmissionEdit</strong> - Used in 4 files for form management
                  <br />
                  <strong>QuestionEdit</strong> - Used in 4 files (ChumsApp only) for form building
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>App-Specific Usage</Typography>
                <Typography variant="body2">
                  <strong>B1App Focus:</strong> Heavy use of Loading (43 files), DisplayBox (26 files), InputBox (23 files)
                  <br />
                  <strong>ChumsApp Focus:</strong> Comprehensive usage including QuestionEdit (4 files), ExportLink (11 files)
                  <br />
                  <strong>LessonsApp Focus:</strong> Core components + FloatingSupport and SupportModal for help
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>Component Dependencies</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            These components depend on Material-UI and internal AppHelper helpers.
          </Alert>
          <Typography variant="body2">
            • All components use Material-UI theming and styling
            <br />
            • InputBox and DisplayBox use icons from Material-UI icon library
            <br />
            • ErrorMessages integrates with AppHelper error handling patterns
            <br />
            • ExportLink uses CSV export functionality for data downloads
            <br />
            • ImageEditor integrates with react-cropper for image manipulation
          </Typography>
        </Box>

        {context?.user && (
          <FloatingSupport appName="Playground" />
        )}
      </Stack>
    </ComponentPage>
  );
}