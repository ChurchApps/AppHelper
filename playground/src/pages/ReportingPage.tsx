import React from 'react';
import { Container, Box, Typography, Alert, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';

// Import reporting components to test their existence
import { 
  ReportFilter,
  ReportFilterField,
  ReportOutput,
  ReportWithFilter
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

export function ReportingTestPage() {
  const reportingComponents = [
    { name: 'ReportFilter', component: ReportFilter },
    { name: 'ReportFilterField', component: ReportFilterField },
    { name: 'ReportOutput', component: ReportOutput },
    { name: 'ReportWithFilter', component: ReportWithFilter }
  ];

  return (
    <ComponentPage title="Reporting Components">
      <Stack spacing={3}>
        <Alert severity="info">
          This page tests the availability of reporting and data visualization components from @churchapps/apphelper.
          These components handle data filtering, display, and export functionality.
        </Alert>

        <Alert severity="warning">
          <strong>Note:</strong> These reporting components require specific data structures,
          filter configurations, and props to function properly. This page verifies import 
          availability rather than full functionality.
        </Alert>

        <Box>
          <Typography variant="h6" gutterBottom>Successfully Imported Components:</Typography>
          <Stack spacing={2}>
            {reportingComponents.map((item) => (
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
              <Typography variant="subtitle2" gutterBottom>Filter Components</Typography>
              <Typography variant="body2">ReportFilter - Complete filter component with multiple field types<br/>ReportFilterField - Individual filter field component for text, select, date inputs</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Data Display</Typography>
              <Typography variant="body2">ReportOutput - Report output component with table and chart support, includes export functionality</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Combined Components</Typography>
              <Typography variant="body2">ReportWithFilter - Combined report with filter and output components, provides complete reporting solution</Typography>
            </Box>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Additional Available Components:</Typography>
          <Alert severity="info">
            The reporting module also includes ChartReport, TableReport, and TreeReport components
            that can be imported separately for specific visualization needs.
          </Alert>
        </Box>
      </Stack>
    </ComponentPage>
  );
}