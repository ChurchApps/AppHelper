"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  TextField, 
  Chip, 
  Stack,
  Alert,
  Paper,
  Divider,
  IconButton
} from '@mui/material';
import { 
  PlayArrow, 
  Stop, 
  Refresh, 
  BugReport, 
  CheckCircle, 
  Error, 
  Warning 
} from '@mui/icons-material';
import { SocketHelper } from '../../helpers/SocketHelper';
import { NotificationService } from '../../helpers/NotificationService';
import { WebSocketTest } from '../../test/WebSocketTest';
import { UserContextInterface } from '@churchapps/helpers';

interface Props {
  context?: UserContextInterface;
}

export const WebSocketTestPanel: React.FC<Props> = ({ context }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [connectionState, setConnectionState] = useState('UNKNOWN');
  const [notificationCounts, setNotificationCounts] = useState({ notificationCount: 0, pmCount: 0 });
  const [testConversationId, setTestConversationId] = useState('test-conversation-123');
  const [logMessages, setLogMessages] = useState<string[]>([]);

  // Monitor WebSocket connection state
  useEffect(() => {
    const interval = setInterval(() => {
      const state = SocketHelper.getConnectionState();
      setConnectionState(state);
      
      if (NotificationService.getInstance().isReady()) {
        const counts = NotificationService.getInstance().getCounts();
        setNotificationCounts(counts);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Subscribe to notification changes
  useEffect(() => {
    if (!context) return;
    
    const notificationService = NotificationService.getInstance();
    const unsubscribe = notificationService.subscribe((counts) => {
      setNotificationCounts(counts);
      addLogMessage(`📊 Notification counts updated: PM=${counts.pmCount}, Notifications=${counts.notificationCount}`);
    });

    return unsubscribe;
  }, [context]);

  const addLogMessage = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setLogMessages([]);
    addLogMessage('🚀 Starting WebSocket tests...');

    try {
      // Intercept console.log to capture test output
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        originalConsoleLog(...args);
        addLogMessage(args.join(' '));
      };

      // Run tests
      await WebSocketTest.runAllTests(context, testConversationId);

      // Restore console.log
      console.log = originalConsoleLog;

      addLogMessage('✅ All tests completed');
    } catch (error) {
      addLogMessage(`❌ Test error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const simulatePrivateMessage = () => {
    addLogMessage('📨 Simulating private message WebSocket event...');
    SocketHelper.handleMessage({
      action: "privateMessage",
      data: {
        conversationId: testConversationId,
        message: {
          id: `test-${Date.now()}`,
          content: "Simulated test message",
          personId: "test-person-id",
          conversationId: testConversationId,
          timeSent: new Date().toISOString()
        }
      }
    });
  };

  const simulateMessageUpdate = () => {
    addLogMessage('📨 Simulating message update WebSocket event...');
    SocketHelper.handleMessage({
      action: "message",
      data: {
        conversationId: testConversationId,
        message: {
          id: `update-${Date.now()}`,
          content: "Updated test message",
          personId: "test-person-id",
          conversationId: testConversationId,
          timeUpdated: new Date().toISOString()
        }
      }
    });
  };

  const debugWebSocket = () => {
    addLogMessage('🔍 Debugging WebSocket state...');
    WebSocketTest.debugWebSocketState();
  };

  const refreshNotifications = async () => {
    addLogMessage('🔄 Refreshing notification counts...');
    try {
      await NotificationService.getInstance().refresh();
      addLogMessage('✅ Notification counts refreshed');
    } catch (error) {
      addLogMessage(`❌ Refresh failed: ${error.message}`);
    }
  };

  const getConnectionChip = () => {
    const color = connectionState === 'OPEN' ? 'success' : 
                 connectionState === 'CONNECTING' ? 'warning' : 'error';
    const icon = connectionState === 'OPEN' ? <CheckCircle /> : 
                connectionState === 'CONNECTING' ? <Warning /> : <Error />;
    
    return (
      <Chip 
        label={`WebSocket: ${connectionState}`} 
        color={color}
        icon={icon}
        size="small"
      />
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        WebSocket Notification Test Panel
      </Typography>
      
      {!context && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No user context provided. Some tests may not work properly.
        </Alert>
      )}

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        {getConnectionChip()}
        <Chip 
          label={`PM Count: ${notificationCounts.pmCount}`} 
          color="primary" 
          size="small"
        />
        <Chip 
          label={`Notifications: ${notificationCounts.notificationCount}`} 
          color="secondary" 
          size="small"
        />
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
        <Button
          variant="contained"
          startIcon={<PlayArrow />}
          onClick={runTests}
          disabled={isRunning}
        >
          Run All Tests
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={refreshNotifications}
          disabled={isRunning}
        >
          Refresh Counts
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<BugReport />}
          onClick={debugWebSocket}
        >
          Debug WebSocket
        </Button>
      </Stack>

      <TextField
        label="Test Conversation ID"
        value={testConversationId}
        onChange={(e) => setTestConversationId(e.target.value)}
        sx={{ mb: 2, width: 300 }}
        size="small"
      />

      <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
        <Button
          variant="outlined"
          onClick={simulatePrivateMessage}
          disabled={isRunning}
        >
          Simulate Private Message
        </Button>
        
        <Button
          variant="outlined"
          onClick={simulateMessageUpdate}
          disabled={isRunning}
        >
          Simulate Message Update
        </Button>
      </Stack>

      <Card>
        <CardHeader 
          title="Test Output Log" 
          action={
            <IconButton onClick={() => setLogMessages([])}>
              <Stop />
            </IconButton>
          }
        />
        <CardContent>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 2, 
              bgcolor: '#f5f5f5', 
              maxHeight: 400, 
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}
          >
            {logMessages.length === 0 ? (
              <Typography color="text.secondary">No log messages yet...</Typography>
            ) : (
              logMessages.map((message, index) => (
                <Box key={index} sx={{ mb: 0.5 }}>
                  {message}
                </Box>
              ))
            )}
          </Paper>
        </CardContent>
      </Card>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Test Instructions
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          1. <strong>Run All Tests:</strong> Comprehensive test of all WebSocket functionality
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          2. <strong>Simulate Events:</strong> Manually trigger WebSocket events to test real-time updates
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          3. <strong>Monitor Counts:</strong> Watch notification counts update in real-time
        </Typography>
        <Typography variant="body2" color="text.secondary">
          4. <strong>Debug:</strong> View detailed WebSocket state information
        </Typography>
      </Box>
    </Box>
  );
};