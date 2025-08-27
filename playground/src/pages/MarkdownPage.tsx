import React from 'react';
import { Container, Box, Typography, Alert, Stack } from '@mui/material';
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

// Create a wrapper component to handle markdown imports safely
function MarkdownComponentWrapper({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const testImport = async () => {
      try {
        await import('@churchapps/apphelper-markdown');
      } catch (error) {
        console.error('Markdown components not available:', error);
        setHasError(true);
      }
    };
    testImport();
  }, []);

  if (hasError) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        <strong>Markdown Components Not Available</strong>
        <br />
        The markdown components require additional dependencies that are not currently loaded.
        This is likely due to Lexical dependency issues in the development environment.
      </Alert>
    );
  }

  return <>{children}</>;
}

// Lazy load the actual markdown components
const LazyMarkdownEditor = React.lazy(async () => {
  try {
    const module = await import('@churchapps/apphelper-markdown');
    return { default: module.MarkdownEditor };
  } catch (error) {
    console.error('Failed to load MarkdownEditor:', error);
    return { 
      default: () => (
        <Alert severity="error">
          Failed to load MarkdownEditor component. Lexical dependencies may be missing.
        </Alert>
      ) 
    };
  }
});

const LazyMarkdownPreview = React.lazy(async () => {
  try {
    const module = await import('@churchapps/apphelper-markdown');
    return { default: module.MarkdownPreview };
  } catch (error) {
    console.error('Failed to load MarkdownPreview:', error);
    return { 
      default: () => (
        <Alert severity="error">
          Failed to load MarkdownPreview component. Lexical dependencies may be missing.
        </Alert>
      ) 
    };
  }
});

export function MarkdownTestPage() {
  const [content, setContent] = React.useState(`# Underscore Test Cases

## Test Links with Underscores in URLs

### Image URLs with underscores:
![Grace Logo](https://content.churchapps.org/Hchi650pfrH/files/grace_logo.png?dt=1756324896015)

### Regular links with underscores:
[File with underscore](https://example.com/test_file_name.pdf)
[Another test link](https://api.example.com/v1/user_profile/get_data)

## Test Links with Target Attributes

### Links that open in same window (target="_self"):
[Same window link](https://example.com){:target="_self"}
[Link with underscore and _self](https://example.com/test_file.pdf){:target="_self"}

### Links that open in new window (target="_blank"):
[New window link](https://example.com){:target="_blank"}
[Link with underscore and _blank](https://example.com/test_file.pdf){:target="_blank"}

## Test Text with Underscores

This is text with literal_underscores_in_it that should not be escaped.

File names like my_document_v2.pdf and api_key_config.json should preserve underscores.

## Test Underline Formatting

This text uses __double underscores__ for underline formatting.

## Mixed Content Test

Here's a complex example: [Download my_file_v2.pdf](https://cdn.example.com/files/my_file_v2.pdf){:target="_blank" .btn .btn-primary}

Another example with classes: [User_Profile_Page](https://app.example.com/user_profile){:target="_self" .nav-link}`);

  return (
    <ComponentPage title="Markdown Editor - Underscore Escaping Test">
      <Stack spacing={4}>
        <Alert severity="warning">
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Testing Underscore Escaping Issue
          </Typography>
          <Typography variant="body2" component="div">
            This page is set up to test if underscores are being properly handled:
            <ul style={{ marginTop: '8px', marginBottom: 0 }}>
              <li>URLs like grace_logo.png should NOT become grace\_logo.png</li>
              <li>Target attributes like target="_blank" should NOT become target="\_blank"</li>
              <li>Edit content in the editor and check the "Generated Markdown Output" below</li>
            </ul>
          </Typography>
        </Alert>

        <MarkdownComponentWrapper>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              1. Edit Your Content Here
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Use the editor below to add links, images, and text with underscores
            </Alert>
            <React.Suspense fallback={<Typography>Loading MarkdownEditor...</Typography>}>
              <Box sx={{ border: 2, borderColor: 'primary.main', borderRadius: 1, minHeight: 400 }}>
                <LazyMarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Type your markdown here..."
                />
              </Box>
            </React.Suspense>
          </Box>

          <Box sx={{ backgroundColor: '#fff3cd', p: 2, borderRadius: 1, border: '2px solid #ffc107' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#856404' }}>
              2. Generated Markdown Output (THIS IS WHAT GETS SAVED)
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Check here for escaped underscores! Look for backslashes (\) before underscores (_)
            </Alert>
            <Box sx={{ 
              border: 2, 
              borderColor: '#ffc107', 
              borderRadius: 1, 
              p: 2, 
              bgcolor: 'white',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}>
              <pre style={{ 
                margin: 0, 
                whiteSpace: 'pre-wrap', 
                fontFamily: 'monospace', 
                fontSize: '14px',
                maxHeight: '400px',
                overflow: 'auto',
                backgroundColor: '#f8f9fa',
                padding: '12px',
                borderRadius: '4px'
              }}>
                {content}
              </pre>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>
              3. Visual Preview (How it will look)
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              This shows how the markdown will be rendered visually
            </Alert>
            <React.Suspense fallback={<Typography>Loading MarkdownPreview...</Typography>}>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, minHeight: 200, bgcolor: 'grey.50' }}>
                <LazyMarkdownPreview value={content} />
              </Box>
            </React.Suspense>
          </Box>
        </MarkdownComponentWrapper>

        <Box>
          <Typography variant="h6" gutterBottom>Component Information</Typography>
          <Stack spacing={2}>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>MarkdownEditor</Typography>
              <Typography variant="body2">
                Built on Lexical editor framework with custom ChurchApps styling and functionality.
                Supports rich text editing, markdown syntax, toolbar controls, emoji picker, and custom plugins.
              </Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>MarkdownPreview</Typography>
              <Typography variant="body2">
                Full-featured markdown renderer with complete styling support.
                Renders all standard markdown elements including tables, code blocks, and embedded content.
              </Typography>
            </Box>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>MarkdownPreviewLight</Typography>
              <Typography variant="body2">
                Lightweight version optimized for performance with minimal styling.
                Ideal for situations where you need fast rendering with basic markdown support.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>Troubleshooting</Typography>
          <Alert severity="warning">
            <strong>Lexical Dependencies</strong>
            <br />
            The markdown components depend on Lexical editor framework which requires specific dependencies.
            If you see import errors, ensure all @lexical/* packages are properly installed and compatible.
            <br /><br />
            <strong>Common Issues:</strong>
            <br />• Missing @lexical/utils export - Version mismatch between Lexical packages
            <br />• Module loading errors - Vite may need dependency optimization
            <br />• Component not rendering - Check browser console for detailed error messages
          </Alert>
        </Box>
      </Stack>
    </ComponentPage>
  );
}