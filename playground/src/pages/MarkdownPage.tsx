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

const LazyMarkdownPreviewLight = React.lazy(async () => {
  try {
    const module = await import('@churchapps/apphelper-markdown');
    return { default: module.MarkdownPreviewLight };
  } catch (error) {
    console.error('Failed to load MarkdownPreviewLight:', error);
    return { 
      default: () => (
        <Alert severity="error">
          Failed to load MarkdownPreviewLight component. Lexical dependencies may be missing.
        </Alert>
      ) 
    };
  }
});

export function MarkdownTestPage() {
  const [content, setContent] = React.useState(`# Welcome to the Markdown Editor

## Features Demo

This is a **bold** text and this is *italic* text. You can also use ~~strikethrough~~ text.

### Lists

**Unordered List:**
- First item
- Second item  
- Third item with **bold** text

**Ordered List:**
1. First numbered item
2. Second numbered item
3. Third numbered item

### Links and Code

Visit our [website](https://example.com) for more information.

Here's some inline code: \`console.log('Hello, World!')\`

**Code Block:**
\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);

function sayHello(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Blockquotes

> This is a blockquote with some important information.
> It can span multiple lines and include **formatting**.

### Tables

| Feature | Status | Notes |
|---------|---------|--------|
| Rich Text | ✅ | Fully supported |
| Markdown | ✅ | Real-time preview |
| Tables | ✅ | Basic support |
| Images | ⏳ | Coming soon |

---

### Emojis

You can use emojis in your content! 😊 👍 🎉

### Additional Formatting

**Bold text** and *italic text* can be combined as ***bold and italic***.

Try editing this content in the editor above to see live updates!`);

  return (
    <ComponentPage title="Markdown Components - Functional Examples">
      <Stack spacing={4}>
        <Alert severity="info">
          This page demonstrates AppHelper markdown components with rich text editing capabilities.
        </Alert>

        <MarkdownComponentWrapper>
          <Box>
            <Typography variant="h6" gutterBottom>MarkdownEditor</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Rich text editor with markdown support, toolbar, and plugins
            </Alert>
            <React.Suspense fallback={<Typography>Loading MarkdownEditor...</Typography>}>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, minHeight: 300 }}>
                <LazyMarkdownEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Type your markdown here..."
                />
              </Box>
            </React.Suspense>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>MarkdownPreview</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Full-featured markdown preview with styling
            </Alert>
            <React.Suspense fallback={<Typography>Loading MarkdownPreview...</Typography>}>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, minHeight: 200, bgcolor: 'grey.50' }}>
                <LazyMarkdownPreview value={content} />
              </Box>
            </React.Suspense>
          </Box>

          <Box>
            <Typography variant="h6" gutterBottom>MarkdownPreviewLight</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Lightweight markdown preview component
            </Alert>
            <React.Suspense fallback={<Typography>Loading MarkdownPreviewLight...</Typography>}>
              <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, minHeight: 200, bgcolor: 'grey.100' }}>
                <LazyMarkdownPreviewLight value={content} />
              </Box>
            </React.Suspense>
          </Box>
        </MarkdownComponentWrapper>

        <Box>
          <Typography variant="h6" gutterBottom>Sample Markdown Content</Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            This shows what the markdown content looks like in raw form
          </Alert>
          <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'grey.100' }}>
            <pre style={{ 
              margin: 0, 
              whiteSpace: 'pre-wrap', 
              fontFamily: 'monospace', 
              fontSize: '0.875rem',
              maxHeight: '300px',
              overflow: 'auto'
            }}>
              {content}
            </pre>
          </Box>
        </Box>

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