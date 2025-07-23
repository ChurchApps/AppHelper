import React from 'react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import { WebSocketTestPanel } from '@churchapps/apphelper';
import UserContext from '../UserContext';

const PrivateMessageTestPage: React.FC = () => {
  const context = React.useContext(UserContext);

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
            <WebSocketTestPanel context={context} />
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default PrivateMessageTestPage;