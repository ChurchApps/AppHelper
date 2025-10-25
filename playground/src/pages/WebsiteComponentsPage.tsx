import React from 'react';
import { Container, Box, Typography, Alert, Stack, Button, Card, CardContent, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { ErrorBoundary } from '../ErrorBoundary';
import { BoxElement, ButtonLink, HtmlPreview, IframeElement, ImageElement, TextOnly, TextWithPhoto, VideoElement, WhiteSpaceElement } from '../../../packages/apphelper-website/src';

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

const websiteComponents = [
  {
    name: 'BoxElement',
    description: 'Container element with customizable background, colors, and nested child elements',
    category: 'Container',
    complexity: 'High'
  },
  {
    name: 'ButtonLink',
    description: 'Material-UI button component for creating clickable links with various styles',
    category: 'Element',
    complexity: 'Low'
  },
  {
    name: 'HtmlPreview',
    description: 'Renders HTML content with optional editing support',
    category: 'Element',
    complexity: 'Low'
  },
  {
    name: 'IframeElement',
    description: 'Embeds external content via iframe with configurable height',
    category: 'Element',
    complexity: 'Low'
  },
  {
    name: 'ImageElement',
    description: 'Displays images with alignment, linking, and resize options',
    category: 'Element',
    complexity: 'Medium'
  },
  {
    name: 'TextOnly',
    description: 'Renders text content with optional editing support and text alignment',
    category: 'Element',
    complexity: 'Low'
  },
  {
    name: 'TextWithPhoto',
    description: 'Displays text content with an accompanying photo in various positions (left, right, top, bottom)',
    category: 'Element',
    complexity: 'Medium'
  },
  {
    name: 'VideoElement',
    description: 'Embeds YouTube or Vimeo videos with responsive sizing',
    category: 'Element',
    complexity: 'Low'
  },
  {
    name: 'WhiteSpaceElement',
    description: 'Creates customizable white space with configurable height',
    category: 'Element',
    complexity: 'Low'
  }
];

export default function WebsiteComponentsPage() {
  const [selectedComponent, setSelectedComponent] = React.useState<string | null>(null);

  const renderComponent = (component: any) => {
    try {
      switch (component.name) {
        case 'BoxElement':
          return (
            <Stack spacing={2}>
              <BoxElement
                element={{
                  id: 'box-1',
                  elementType: 'box',
                  answers: {
                    background: '#f5f5f5',
                    textColor: '#333',
                    rounded: 'true'
                  },
                  elements: [
                    {
                      id: 'box-1-text',
                      elementType: 'text',
                      answers: {
                        text: '<h3>Box with Gray Background</h3><p>This is a rounded box with a gray background. It can contain nested elements.</p>',
                        textAlignment: 'left'
                      }
                    }
                  ]
                }}
                churchSettings={{}}
                textColor="#333"
              />
              <BoxElement
                element={{
                  id: 'box-2',
                  elementType: 'box',
                  answers: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textColor: '#ffffff',
                    rounded: 'true',
                    translucent: 'false'
                  },
                  elements: [
                    {
                      id: 'box-2-text',
                      elementType: 'text',
                      answers: {
                        text: '<h3>Box with Gradient Background</h3><p>This box has a purple gradient background with white text.</p>',
                        textAlignment: 'center'
                      }
                    }
                  ]
                }}
                churchSettings={{}}
                textColor="#ffffff"
              />
              <BoxElement
                element={{
                  id: 'box-3',
                  elementType: 'box',
                  answers: {
                    background: '#e3f2fd',
                    textColor: '#1565c0',
                    rounded: 'true'
                  },
                  elements: [
                    {
                      id: 'box-3-img',
                      elementType: 'image',
                      answers: {
                        photo: 'https://picsum.photos/400/200',
                        photoAlt: 'Sample image in box',
                        imageAlign: 'center'
                      }
                    },
                    {
                      id: 'box-3-text',
                      elementType: 'text',
                      answers: {
                        text: '<h4>Box with Multiple Elements</h4><p>Boxes can contain any element types, including images, text, videos, and even nested boxes.</p>',
                        textAlignment: 'left'
                      }
                    }
                  ]
                }}
                churchSettings={{}}
                textColor="#1565c0"
              />
              <Typography variant="caption" color="textSecondary">
                Examples showing different box backgrounds, colors, and nested elements.
              </Typography>
            </Stack>
          );

        case 'ButtonLink':
          return (
            <Stack spacing={2}>
              <ButtonLink
                element={{
                  id: 'button-1',
                  answers: {
                    buttonLinkText: 'Click Me',
                    buttonLinkUrl: '#',
                    buttonLinkVariant: 'contained',
                    buttonLinkColor: 'primary'
                  }
                }}
              />
              <ButtonLink
                element={{
                  id: 'button-2',
                  answers: {
                    buttonLinkText: 'Outlined Button',
                    buttonLinkUrl: '#',
                    buttonLinkVariant: 'outlined',
                    buttonLinkColor: 'secondary'
                  }
                }}
              />
              <ButtonLink
                element={{
                  id: 'button-3',
                  answers: {
                    buttonLinkText: 'Full Width Button',
                    buttonLinkUrl: 'https://churchapps.org',
                    buttonLinkVariant: 'contained',
                    buttonLinkColor: 'primary',
                    fullWidth: 'true',
                    external: 'true'
                  }
                }}
              />
            </Stack>
          );

        case 'HtmlPreview':
          return (
            <Stack spacing={2}>
              <HtmlPreview
                value="<h3>Sample HTML Content</h3><p>This is a <strong>preview</strong> of HTML content with <em>formatting</em>.</p>"
                element={{ id: 'html-1' }}
              />
              <HtmlPreview
                value="<p style='color: blue; text-align: center;'>Centered blue text</p>"
                textAlign="center"
                element={{ id: 'html-2' }}
              />
              <HtmlPreview
                value="<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>"
                element={{ id: 'html-3' }}
              />
            </Stack>
          );

        case 'IframeElement':
          return (
            <Stack spacing={2}>
              <IframeElement
                element={{
                  id: 'iframe-1',
                  answers: {
                    iframeSrc: 'https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik',
                    iframeHeight: '400'
                  }
                }}
              />
              <Typography variant="caption" color="textSecondary">
                Example: Embedded map with 400px height
              </Typography>
            </Stack>
          );

        case 'ImageElement':
          return (
            <Stack spacing={2}>
              <ImageElement
                element={{
                  id: 'image-1',
                  answers: {
                    photo: 'https://picsum.photos/400/300',
                    photoAlt: 'Sample image',
                    imageAlign: 'center'
                  }
                }}
              />
              <ImageElement
                element={{
                  id: 'image-2',
                  answers: {
                    photo: 'https://picsum.photos/300/200',
                    photoAlt: 'Linked image',
                    imageAlign: 'left',
                    url: 'https://churchapps.org',
                    external: 'true'
                  }
                }}
              />
              <Typography variant="caption" color="textSecondary">
                First image: centered, no link. Second image: left-aligned, links to ChurchApps.org
              </Typography>
            </Stack>
          );

        case 'TextOnly':
          return (
            <Stack spacing={2}>
              <TextOnly
                element={{
                  id: 'text-1',
                  answers: {
                    text: '<h2>Welcome to Our Church</h2><p>This is a sample text-only element with <strong>formatted content</strong>. It supports HTML formatting and can be aligned as needed.</p>',
                    textAlignment: 'left'
                  }
                }}
              />
              <TextOnly
                element={{
                  id: 'text-2',
                  answers: {
                    text: '<p>This text is <em>centered</em> on the page.</p>',
                    textAlignment: 'center'
                  }
                }}
              />
              <Typography variant="caption" color="textSecondary">
                First text: left-aligned. Second text: centered.
              </Typography>
            </Stack>
          );

        case 'TextWithPhoto':
          return (
            <Stack spacing={2}>
              <TextWithPhoto
                element={{
                  id: 'textwithphoto-1',
                  answers: {
                    text: '<h3>Photo on Left</h3><p>This demonstrates text with a photo positioned on the left side. The photo and text are displayed side by side in a responsive grid layout.</p>',
                    photo: 'https://picsum.photos/300/400',
                    photoAlt: 'Sample photo',
                    photoPosition: 'left',
                    textAlignment: 'left'
                  }
                }}
              />
              <TextWithPhoto
                element={{
                  id: 'textwithphoto-2',
                  answers: {
                    text: '<h3>Photo on Right</h3><p>This demonstrates text with a photo positioned on the right side. The layout adjusts responsively on smaller screens.</p>',
                    photo: 'https://picsum.photos/300/400',
                    photoAlt: 'Sample photo',
                    photoPosition: 'right',
                    textAlignment: 'left'
                  }
                }}
              />
              <Typography variant="caption" color="textSecondary">
                Examples showing different photo positions: left and right.
              </Typography>
            </Stack>
          );

        case 'VideoElement':
          return (
            <Stack spacing={2}>
              <VideoElement
                element={{
                  id: 'video-1',
                  answers: {
                    videoType: 'youtube',
                    videoId: 'dQw4w9WgXcQ'
                  }
                }}
              />
              <Typography variant="caption" color="textSecondary">
                Example YouTube video embed (responsive sizing)
              </Typography>
              <VideoElement
                element={{
                  id: 'video-2',
                  answers: {
                    videoType: 'vimeo',
                    videoId: '76979871'
                  }
                }}
              />
              <Typography variant="caption" color="textSecondary">
                Example Vimeo video embed (responsive sizing)
              </Typography>
            </Stack>
          );

        case 'WhiteSpaceElement':
          return (
            <Stack spacing={2}>
              <Box sx={{ border: '1px dashed #ccc', p: 1 }}>
                <Typography variant="caption" color="textSecondary">Content above</Typography>
                <WhiteSpaceElement
                  element={{
                    id: 'whitespace-1',
                    answers: {
                      height: '50'
                    }
                  }}
                />
                <Typography variant="caption" color="textSecondary">Content below (50px spacing)</Typography>
              </Box>
              <Box sx={{ border: '1px dashed #ccc', p: 1 }}>
                <Typography variant="caption" color="textSecondary">Content above</Typography>
                <WhiteSpaceElement
                  element={{
                    id: 'whitespace-2',
                    answers: {
                      height: '100'
                    }
                  }}
                />
                <Typography variant="caption" color="textSecondary">Content below (100px spacing)</Typography>
              </Box>
            </Stack>
          );

        default:
          return (
            <Alert severity="info">
              <strong>{component.name} Demo</strong>
              <br />
              {component.description}
              <br /><br />
              Component demo implementation not yet available.
            </Alert>
          );
      }
    } catch (error) {
      return (
        <Alert severity="error">
          <strong>Error loading {component.name}</strong>
          <br />
          {error instanceof Error ? error.message : 'Unknown error occurred'}
          <br /><br />
          This component may require additional configuration or dependencies.
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

        {selectedComponent === component.name && (
          <Box sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            mt: 2
          }}>
            <Typography variant="subtitle2" gutterBottom>Live Component Demo:</Typography>
            <ErrorBoundary>
              {renderComponent(component)}
            </ErrorBoundary>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <ComponentPage title="@churchapps/apphelper-website - Website Components">
      <Stack spacing={4}>
        <Alert severity="info">
          <strong>Website Components from @churchapps/apphelper-website Package</strong>
          <br />
          This page demonstrates website element components that can be used to build dynamic church websites.
          More components will be added as the package is extended.
        </Alert>

        <Box>
          <Typography variant="h5" gutterBottom>
            Element Components ({websiteComponents.length} total)
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Click "Show Demo" to see live component demonstrations with interactive examples.
          </Alert>
          {websiteComponents.map(component => renderComponentCard(component))}
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>Package Status</Typography>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>@churchapps/apphelper-website</Typography>
              <Typography variant="body2">
                • Initial package with basic components<br/>
                • Material-UI based element types<br/>
                • Designed for dynamic website building<br/>
                • Will be extended with more components
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </ComponentPage>
  );
}
