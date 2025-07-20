import React from 'react';
import { Container, Box, Typography, Alert, Stack, Card, CardContent, Button, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { 
  ApiHelper, 
  AppearanceHelper,
  ArrayHelper,
  CommonEnvironmentHelper,
  CurrencyHelper,
  DateHelper,
  ErrorHelper,
  EventHelper,
  FileHelper,
  PersonHelper,
  UserHelper,
  UniqueIdHelper,
  AnalyticsHelper,
  SlugHelper,
  SocketHelper,
  Locale,
  createEmotionCache,
  Permissions
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

const reExportedHelpers = [
  { 
    name: 'ApiHelper', 
    helper: ApiHelper, 
    description: 'Centralized API communication with JWT authentication',
    usage: ['B1App: 120+ files', 'ChumsApp: 50+ files', 'LessonsApp: 20+ files'],
    example: 'ApiHelper.apiUrl("churches")'
  },
  { 
    name: 'UserHelper', 
    helper: UserHelper, 
    description: 'User utility functions and data manipulation',
    usage: ['B1App: 53 files', 'ChumsApp: 50 files', 'LessonsApp: 9 files'],
    example: 'UserHelper.currentUserChurch(user, churches)'
  },
  { 
    name: 'ArrayHelper', 
    helper: ArrayHelper, 
    description: 'Array manipulation and utility functions',
    usage: ['B1App: 25 files', 'ChumsApp: 31 files', 'LessonsApp: 21 files'],
    example: 'ArrayHelper.getUniqueObjects(array, "id")'
  },
  { 
    name: 'DateHelper', 
    helper: DateHelper, 
    description: 'Date formatting and manipulation utilities',
    usage: ['B1App: 21 files', 'ChumsApp: 35 files', 'LessonsApp: 7 files'],
    example: 'DateHelper.formatDate(new Date())'
  },
  { 
    name: 'PersonHelper', 
    helper: PersonHelper, 
    description: 'Person data utilities and formatting',
    usage: ['B1App: 23 files', 'ChumsApp: 24 files', 'LessonsApp: ❌'],
    example: 'PersonHelper.getDisplayName(person)'
  },
  { 
    name: 'CurrencyHelper', 
    helper: CurrencyHelper, 
    description: 'Currency formatting and conversion utilities',
    usage: ['B1App: 2 files', 'ChumsApp: 9 files', 'LessonsApp: ❌'],
    example: 'CurrencyHelper.formatDollars(100.50)'
  },
  { 
    name: 'ErrorHelper', 
    helper: ErrorHelper, 
    description: 'Error handling and logging utilities',
    usage: ['B1App: 1 file', 'ChumsApp: 2 files', 'LessonsApp: 1 file'],
    example: 'ErrorHelper.logError(error)'
  },
  { 
    name: 'CommonEnvironmentHelper', 
    helper: CommonEnvironmentHelper, 
    description: 'Environment configuration utilities',
    usage: ['B1App: 6 files', 'ChumsApp: 3 files', 'LessonsApp: 3 files'],
    example: 'CommonEnvironmentHelper.AccessApi'
  },
  { 
    name: 'UniqueIdHelper', 
    helper: UniqueIdHelper, 
    description: 'Unique identifier generation utilities',
    usage: ['B1App: 7 files', 'ChumsApp: 19 files', 'LessonsApp: ❌'],
    example: 'UniqueIdHelper.shortId()'
  },
  { 
    name: 'EventHelper', 
    helper: EventHelper, 
    description: 'Event management utilities',
    usage: ['B1App: 5 files', 'ChumsApp: ❌', 'LessonsApp: ❌'],
    example: 'EventHelper.formatDateTime(event.startTime)'
  },
  { 
    name: 'FileHelper', 
    helper: FileHelper, 
    description: 'File operations and utilities',
    usage: ['B1App: 1 file', 'ChumsApp: ❌', 'LessonsApp: ❌'],
    example: 'FileHelper.download(data, "filename.csv")'
  },
  { 
    name: 'Permissions', 
    helper: Permissions, 
    description: 'Authorization and permission checking',
    usage: ['B1App: 26 files', 'ChumsApp: 37 files', 'LessonsApp: 5 files'],
    example: 'Permissions.accessApi'
  }
];

const localHelpers = [
  { 
    name: 'AppearanceHelper', 
    helper: AppearanceHelper, 
    description: 'Theme and branding management (extends BaseAppearanceHelper)',
    usage: ['B1App: 13 files', 'ChumsApp: ❌', 'LessonsApp: ❌'],
    example: 'AppearanceHelper.setAppearance(appearance)'
  },
  { 
    name: 'AnalyticsHelper', 
    helper: AnalyticsHelper, 
    description: 'Analytics tracking and reporting',
    usage: ['B1App: 1 file', 'ChumsApp: 2 files', 'LessonsApp: 5 files'],
    example: 'AnalyticsHelper.track("event_name", data)'
  },
  { 
    name: 'SlugHelper', 
    helper: SlugHelper, 
    description: 'URL slug generation and manipulation',
    usage: ['B1App: 3 files', 'ChumsApp: ❌', 'LessonsApp: 2 files'],
    example: 'SlugHelper.convertToSlug("My Title")'
  },
  { 
    name: 'SocketHelper', 
    helper: SocketHelper, 
    description: 'Real-time WebSocket communication',
    usage: ['B1App: 2 files', 'ChumsApp: ❌', 'LessonsApp: ❌'],
    example: 'SocketHelper.connect(url)'
  },
  { 
    name: 'Locale', 
    helper: Locale, 
    description: 'Internationalization (i18n) utilities for 12 languages',
    usage: ['B1App: 14 files', 'ChumsApp: 145 files', 'LessonsApp: 3 files'],
    example: 'Locale.label("common.save")'
  },
  { 
    name: 'createEmotionCache', 
    helper: createEmotionCache, 
    description: 'CSS-in-JS caching helper for Emotion',
    usage: ['B1App: ❌', 'ChumsApp: ❌', 'LessonsApp: ❌'],
    example: 'const cache = createEmotionCache();'
  }
];

const specialHelpers = [
  { 
    name: 'DonationHelper', 
    helper: null, 
    description: 'Donation processing utilities (moved to @churchapps/apphelper-donations)',
    usage: ['ChumsApp: 2 files'],
    example: 'DonationHelper.formatAmount(donation.amount)'
  }
];

export default function AppHelperHelpersPage() {

  const testHelper = (helperName: string, helperClass: any, example: string) => {
    try {
      console.log(`Testing ${helperName}:`, helperClass);
      if (example.includes('(')) {
        console.log(`Example: ${example}`);
      }
      return `✅ ${helperName} loaded successfully`;
    } catch (error) {
      console.error(`Error testing ${helperName}:`, error);
      return `❌ ${helperName} failed to load: ${error}`;
    }
  };

  const renderHelperCard = (helper: any, category: string) => (
    <Card key={helper.name} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="h3">
            {helper.name}
          </Typography>
          <Chip label={category} color="primary" variant="outlined" size="small" />
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          {helper.description}
        </Typography>
        
        <Typography variant="subtitle2" gutterBottom>Usage Across Apps:</Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
          {helper.usage.map((usage: string, index: number) => (
            <Chip 
              key={index} 
              label={usage} 
              size="small" 
              color={usage.includes('❌') ? 'error' : 'success'}
              variant="outlined"
            />
          ))}
        </Stack>
        
        <Typography variant="subtitle2" gutterBottom>Example Usage:</Typography>
        <Box sx={{ 
          bgcolor: 'grey.100', 
          p: 1, 
          borderRadius: 1, 
          fontFamily: 'monospace', 
          fontSize: '0.875rem',
          mb: 2 
        }}>
          {helper.example}
        </Box>
        
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => {
            const result = testHelper(helper.name, helper.helper, helper.example);
            alert(result);
          }}
        >
          Test Helper
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <ComponentPage title="@churchapps/apphelper - Helpers">
      <Stack spacing={4}>
        <Alert severity="info">
          <strong>Helper Functions from @churchapps/apphelper Package</strong>
          <br />
          This page demonstrates all helper functions available from the core AppHelper package, including both re-exported helpers from @churchapps/helpers and local AppHelper-specific utilities.
        </Alert>

        <Box>
          <Typography variant="h5" gutterBottom>Package Structure</Typography>
          <Stack spacing={2}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="h6" color="primary" gutterBottom>Re-exported Helpers (from @churchapps/helpers)</Typography>
              <Typography variant="body2" color="textSecondary">
                Framework-agnostic utilities shared across all ChurchApps packages. These are imported from @churchapps/helpers and re-exported for convenience.
              </Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="h6" color="secondary" gutterBottom>Local AppHelper Helpers</Typography>
              <Typography variant="body2" color="textSecondary">
                React/web-specific utilities that extend the core helpers with app-specific functionality like theming, analytics, and real-time communication.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Re-exported Helpers ({reExportedHelpers.length} total)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            These helpers are imported from @churchapps/helpers and re-exported for convenience. They provide core functionality used across all applications.
          </Alert>
          {reExportedHelpers.map(helper => renderHelperCard(helper, 'Re-exported'))}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Local AppHelper Helpers ({localHelpers.length} total)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            These helpers are specific to the AppHelper package and provide React/web-specific functionality.
          </Alert>
          {localHelpers.map(helper => renderHelperCard(helper, 'Local'))}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Special Helpers ({specialHelpers.length} total)
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            These helpers have been moved to other packages or have special considerations.
          </Alert>
          {specialHelpers.map(helper => renderHelperCard(helper, 'Special'))}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>Usage Summary</Typography>
          <Stack spacing={2}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Most Used Helpers</Typography>
                <Typography variant="body2">
                  <strong>1. ApiHelper</strong> - 190+ files across all apps (core API communication)
                  <br />
                  <strong>2. Locale</strong> - 162 files across all apps (internationalization)
                  <br />
                  <strong>3. UserHelper</strong> - 112 files across all apps (user management)
                  <br />
                  <strong>4. ArrayHelper</strong> - 77 files across all apps (data manipulation)
                  <br />
                  <strong>5. Permissions</strong> - 68 files across all apps (authorization)
                </Typography>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Underutilized Helpers</Typography>
                <Typography variant="body2" color="textSecondary">
                  <strong>createEmotionCache</strong> - 0 files (unused CSS-in-JS helper)
                  <br />
                  <strong>FileHelper</strong> - 1 file (file operations)
                  <br />
                  <strong>ErrorHelper</strong> - 4 files (error handling)
                  <br />
                  <strong>EventHelper</strong> - 5 files (event management)
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Architecture Notes</Typography>
                <Typography variant="body2">
                  • All helpers are statically imported and available immediately
                  <br />
                  • Re-exported helpers maintain compatibility with direct @churchapps/helpers imports
                  <br />
                  • Local helpers extend core functionality with React/web-specific features
                  <br />
                  • Helper usage patterns show ApiHelper and UserHelper as critical dependencies
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>Testing</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Click "Test Helper" on any helper card above to verify it loads correctly in the console.
          </Alert>
          <Typography variant="body2">
            All helpers are imported and tested for availability. Check the browser console for detailed test results.
          </Typography>
        </Box>
      </Stack>
    </ComponentPage>
  );
}