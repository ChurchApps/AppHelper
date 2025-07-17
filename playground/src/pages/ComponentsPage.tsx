import React from 'react';
import { Container, Box, Typography, Alert, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';

// Import components to test their existence
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
  Notes,
  QuestionEdit,
  SmallButton,
  SupportModal
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

export function ComponentsTestPage() {
  const componentList = [
    { name: 'ErrorMessages', component: ErrorMessages },
    { name: 'ExportLink', component: ExportLink },
    { name: 'DisplayBox', component: DisplayBox },
    { name: 'FloatingSupport', component: FloatingSupport },
    { name: 'FormSubmissionEdit', component: FormSubmissionEdit },
    { name: 'HelpIcon', component: HelpIcon },
    { name: 'ImageEditor', component: ImageEditor },
    { name: 'InputBox', component: InputBox },
    { name: 'Loading', component: Loading },
    { name: 'Notes', component: Notes },
    { name: 'QuestionEdit', component: QuestionEdit },
    { name: 'SmallButton', component: SmallButton },
    { name: 'SupportModal', component: SupportModal }
  ];

  return (
    <ComponentPage title="Core Components">
      <Stack spacing={3}>
        <Alert severity="info">
          This page tests the availability of core UI components from @churchapps/apphelper.
          Components listed here are successfully imported and available for use.
        </Alert>

        <Box>
          <Typography variant="h6" gutterBottom>Successfully Imported Components:</Typography>
          <Stack spacing={2}>
            {componentList.map((item) => (
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
          <Typography variant="h6" gutterBottom>Simple Component Test:</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Testing the Loading component which should be simple to render
          </Alert>
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
            <Loading />
          </Box>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Usage Information:</Typography>
          <Alert severity="warning">
            These components may require specific props and context to function properly. 
            This page verifies import availability rather than full functionality.
            Refer to the component source code for proper usage instructions.
          </Alert>
        </Box>
      </Stack>
    </ComponentPage>
  );
}