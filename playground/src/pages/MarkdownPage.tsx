import React from 'react';
import { Container, Box, Typography, Alert, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';

// Import markdown components to test their existence
import { 
  MarkdownEditor, 
  MarkdownPreview, 
  MarkdownPreviewLight 
} from '@churchapps/apphelper-markdown';

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

export function MarkdownTestPage() {
  const markdownComponents = [
    { name: 'MarkdownEditor', component: MarkdownEditor },
    { name: 'MarkdownPreview', component: MarkdownPreview },
    { name: 'MarkdownPreviewLight', component: MarkdownPreviewLight }
  ];

  return (
    <ComponentPage title="Markdown Components">
      <Stack spacing={3}>
        <Alert severity="info">
          This page tests the availability of markdown and rich text components from @churchapps/apphelper-markdown.
          These components provide rich text editing and markdown preview functionality.
        </Alert>

        <Alert severity="warning">
          <strong>Note:</strong> These markdown components are built on Lexical and require specific 
          configuration and context to function properly. This page verifies import availability 
          rather than full functionality.
        </Alert>

        <Box>
          <Typography variant="h6" gutterBottom>Successfully Imported Components:</Typography>
          <Stack spacing={2}>
            {markdownComponents.map((item) => (
              <Box key={item.name} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>{item.name}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ✅ Component type: {typeof item.component}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  ✅ Successfully imported from @churchapps/apphelper-markdown
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Component Features:</Typography>
          <Stack spacing={2}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>MarkdownEditor</Typography>
              <Typography variant="body2">Rich text editor with markdown support, toolbar, and plugins. Built on Lexical editor framework with custom ChurchApps styling and functionality.</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>MarkdownPreview</Typography>
              <Typography variant="body2">Full-featured markdown preview with styling. Renders markdown content with proper formatting and styling.</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>MarkdownPreviewLight</Typography>
              <Typography variant="body2">Lightweight markdown preview component with minimal styling. Optimized for performance with basic markdown rendering.</Typography>
            </Box>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Editor Features:</Typography>
          <Stack spacing={2}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Rich Text Editing</Typography>
              <Typography variant="body2">Bold, italic, underline, strikethrough, headings, lists, and more</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Markdown Support</Typography>
              <Typography variant="body2">Full markdown syntax support with live preview capabilities</Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>Extensible</Typography>
              <Typography variant="body2">Custom plugins for links, emojis, and ChurchApps-specific functionality</Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </ComponentPage>
  );
}