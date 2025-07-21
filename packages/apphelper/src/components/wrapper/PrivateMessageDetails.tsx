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
import { Locale } from "../../helpers";
import { PersonAvatar } from "../PersonAvatar";

interface Props {
  context: UserContextInterface;
  privateMessage: PrivateMessageInterface;
  onBack: () => void
  refreshKey: number;
}

export const PrivateMessageDetails: React.FC<Props> = (props) => {
  const theme = useTheme();
  
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
      
      <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Notes 
          maxHeight={"calc(100vh - 200px)"} 
          context={props.context} 
          conversationId={props.privateMessage.conversationId} 
          noDisplayBox={true} 
          refreshKey={props.refreshKey} 
        />
      </Box>
    </Paper>
  );
};

