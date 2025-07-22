"use client";

import React from "react";
import { 
  Paper, 
  Box, 
  Typography, 
  Stack, 
  IconButton, 
  Avatar,
  Divider,
  useTheme 
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { PrivateMessageInterface, UserContextInterface } from "@churchapps/helpers";
import { Notes } from "../notes/Notes";
import { ApiHelper, Locale } from "../../helpers";
import { PersonAvatar } from "../PersonAvatar";

interface Props {
  context: UserContextInterface;
  privateMessage: PrivateMessageInterface;
  onBack: () => void
  refreshKey: number;
}

export const PrivateMessageDetails: React.FC<Props> = (props) => {
  const theme = useTheme();
  
  // Clear notification when conversation is opened
  React.useEffect(() => {
    const clearNotification = async () => {
      if (props.privateMessage.notifyPersonId === props.context.person.id) {
        try {
          // Clear the notification by getting the private message details
          await ApiHelper.get(`/privateMessages/${props.privateMessage.id}`, "MessagingApi");
        } catch (error) {
          console.error("Failed to clear notification:", error);
        }
      }
    };
    
    clearNotification();
  }, [props.privateMessage.id, props.privateMessage.notifyPersonId, props.context.person.id]);
  
  return (
    <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton onClick={props.onBack}>
            <ArrowBackIcon />
          </IconButton>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
            <PersonAvatar person={props.privateMessage.person} size="small" />
            <Box>
              <Typography variant="h6" component="h2">
                {props.privateMessage.person.name.display}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {Locale.label("wrapper.privateConversation", "Private Conversation")}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        <Notes 
          maxHeight={"100%"} 
          context={props.context} 
          conversationId={props.privateMessage.conversationId} 
          noDisplayBox={true} 
          refreshKey={props.refreshKey} 
        />
      </Box>
    </Paper>
  );
};

