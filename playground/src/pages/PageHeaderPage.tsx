import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { PageHeader } from '@churchapps/apphelper';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function PageHeaderPage() {
  const [selectedExample, setSelectedExample] = React.useState<string>('basic');

  const examples = {
    basic: {
      title: 'Basic Header',
      component: (
        <PageHeader
          icon={<PersonIcon />}
          title="People"
          subtitle="Manage your church members and visitors"
        />
      )
    },
    withActions: {
      title: 'Header with Action Buttons',
      component: (
        <PageHeader
          icon={<GroupIcon />}
          title="Groups"
          subtitle="Small groups and ministries"
        >
          <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
            Add Group
          </Button>
          <Button variant="outlined" startIcon={<FileDownloadIcon />} sx={{ borderColor: 'rgba(255,255,255,0.5)', color: '#FFF', '&:hover': { borderColor: '#FFF' } }}>
            Export
          </Button>
        </PageHeader>
      )
    },
    withStatistics: {
      title: 'Header with Statistics',
      component: (
        <PageHeader
          icon={<EventIcon />}
          title="Attendance"
          subtitle="Track service and event attendance"
          statistics={[
            { icon: <PersonIcon />, value: '248', label: 'Last Sunday' },
            { icon: <GroupIcon />, value: '12', label: 'Active Groups' },
            { icon: <EventIcon />, value: '95%', label: 'Average Rate' }
          ]}
        />
      )
    },
    fullFeatured: {
      title: 'Full Featured Header',
      component: (
        <PageHeader
          icon={<VolunteerActivismIcon />}
          title="Donations"
          subtitle="Manage donations and generate reports"
          statistics={[
            { icon: <VolunteerActivismIcon />, value: '$12,450', label: 'This Month' },
            { icon: <PersonIcon />, value: '89', label: 'Donors' },
            { icon: <EventIcon />, value: '+15%', label: 'vs Last Month' }
          ]}
        >
          <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
            New Donation
          </Button>
          <Button variant="outlined" sx={{ borderColor: 'rgba(255,255,255,0.5)', color: '#FFF', '&:hover': { borderColor: '#FFF' } }}>
            Reports
          </Button>
        </PageHeader>
      )
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 2, mb: 2 }}>
        <Link to="/">← Back to Home</Link>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 2 }}>
          PageHeader Component
        </Typography>
        <ErrorBoundary>
          <Box sx={{ mt: 3 }}>
            <Stack spacing={4}>
              <Alert severity="info">
                <strong>PageHeader from @churchapps/apphelper</strong>
                <br />
                A modern page header component with icon, title, subtitle, action buttons, and statistics display.
              </Alert>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Component Features</Typography>
                  <Box component="ul" sx={{ pl: 3 }}>
                    <li>Icon with background styling</li>
                    <li>Title and subtitle support</li>
                    <li>Action buttons area for CTAs</li>
                    <li>Statistics row for key metrics</li>
                    <li>Responsive layout</li>
                    <li>Uses CSS custom property for background color</li>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Examples</Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                    {Object.entries(examples).map(([key, example]) => (
                      <Button
                        key={key}
                        variant={selectedExample === key ? 'contained' : 'outlined'}
                        onClick={() => setSelectedExample(key)}
                        size="small"
                      >
                        {example.title}
                      </Button>
                    ))}
                  </Stack>

                  <Box 
                    sx={{ 
                      border: 1, 
                      borderColor: 'divider', 
                      borderRadius: 1, 
                      overflow: 'hidden',
                      '--c1l2': '#1976d2' // Set the CSS variable for the demo
                    }}
                  >
                    {examples[selectedExample as keyof typeof examples].component}
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Usage Example</Typography>
                  <Box sx={{ 
                    backgroundColor: '#f5f5f5', 
                    p: 2, 
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    overflow: 'auto'
                  }}>
                    <pre style={{ margin: 0 }}>{`import { PageHeader } from '@churchapps/apphelper';
import PersonIcon from '@mui/icons-material/Person';

<PageHeader
  icon={<PersonIcon />}
  title="People"
  subtitle="Manage your church members and visitors"
  statistics={[
    { icon: <PersonIcon />, value: '248', label: 'Active Members' },
    { icon: <GroupIcon />, value: '12', label: 'Groups' }
  ]}
>
  <Button variant="contained" startIcon={<AddIcon />}>
    Add Person
  </Button>
</PageHeader>`}</pre>
                  </Box>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Styling Notes</Typography>
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <strong>Important:</strong> This component uses the CSS custom property <code>--c1l2</code> for the background color. 
                    Make sure this variable is defined in your application's CSS or theme.
                  </Alert>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    The component is designed to work with ChurchApps theming system where <code>--c1l2</code> typically represents a lighter shade of the primary color.
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Box>
        </ErrorBoundary>
      </Box>
    </Container>
  );
}