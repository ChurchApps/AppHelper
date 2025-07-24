import React from 'react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';

const PrivateMessageTestPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Private Message & WebSocket Testing
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          This page provides tools to test the WebSocket notification system and private messaging functionality.
          Use this to verify that notification counts update instantly and messages appear in real-time.
        </Typography>

        <Card>
          <CardContent>
            <Typography variant="body1">
              WebSocket testing functionality has been moved to the integrated messaging system.
              Use the private messages modal to test real-time functionality.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default PrivateMessageTestPage;