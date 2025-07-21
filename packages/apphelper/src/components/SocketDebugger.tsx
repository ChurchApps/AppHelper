"use client";

import React from "react";
import { Button, Box, Typography, Card, CardContent, Chip } from "@mui/material";
import { SocketHelper } from "../helpers/SocketHelper";
import { NotificationService } from "../helpers/NotificationService";
import { CommonEnvironmentHelper } from "@churchapps/helpers";
import { UserContextInterface } from "@churchapps/helpers";

interface Props {
  context: UserContextInterface | null;
}

export const SocketDebugger: React.FC<Props> = ({ context }) => {
  const [connectionState, setConnectionState] = React.useState("UNINITIALIZED");
  const [socketId, setSocketId] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");

  const updateConnectionState = () => {
    const state = SocketHelper.getConnectionState();
    setConnectionState(state);
    setSocketId(SocketHelper.socketId || "");
  };

  React.useEffect(() => {
    const interval = setInterval(updateConnectionState, 1000);
    return () => clearInterval(interval);
  }, []);

  const testConnection = async () => {
    try {
      console.log("🧪 Manual websocket connection test started");
      setError("");
      
      await SocketHelper.init();
      
      // Add a test handler
      SocketHelper.addHandler("test", "debugger-test", (data: any) => {
        console.log("🧪 Received test message:", data);
      });
      
      console.log("🧪 Connection test completed");
      
    } catch (err) {
      console.error("🧪 Connection test failed:", err);
      setError(err instanceof Error ? err.message : "Connection failed");
    }
  };

  const testNotificationService = async () => {
    if (!context) {
      setError("No user context available");
      return;
    }
    
    try {
      console.log("🧪 Testing NotificationService");
      setError("");
      
      await NotificationService.getInstance().initialize(context);
      
      console.log("🧪 NotificationService test completed");
      
    } catch (err) {
      console.error("🧪 NotificationService test failed:", err);
      setError(err instanceof Error ? err.message : "Service initialization failed");
    }
  };

  const disconnect = () => {
    SocketHelper.cleanup();
    updateConnectionState();
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case "OPEN": return "success";
      case "CONNECTING": return "warning";
      case "CLOSED": return "error";
      case "CLOSING": return "warning";
      default: return "default";
    }
  };

  return (
    <Card sx={{ m: 2, maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🔌 WebSocket Debugger
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary">
            <strong>WebSocket URL:</strong> {CommonEnvironmentHelper.MessagingApiSocket || "Not configured"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>User Context:</strong> {context?.user?.id ? "Available" : "Not available"}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Connection State:</strong> <Chip label={connectionState} color={getStateColor(connectionState) as any} size="small" />
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Socket ID:</strong> {socketId || "None"}
          </Typography>
        </Box>

        {error && (
          <Typography variant="body2" color="error" sx={{ mb: 2, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            size="small" 
            onClick={testConnection}
            disabled={connectionState === "CONNECTING"}
          >
            Test Connection
          </Button>
          
          <Button 
            variant="contained" 
            size="small" 
            onClick={testNotificationService}
            disabled={!context?.user?.id}
          >
            Test Notifications
          </Button>
          
          <Button 
            variant="outlined" 
            size="small" 
            onClick={disconnect}
            disabled={connectionState === "CLOSED" || connectionState === "UNINITIALIZED"}
          >
            Disconnect
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};