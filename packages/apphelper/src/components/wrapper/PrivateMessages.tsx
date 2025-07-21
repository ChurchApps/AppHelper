"use client";

import React, { useState } from "react";
import { ApiHelper } from "@churchapps/helpers";
import { 
  Box, 
  Stack, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Typography, 
  IconButton, 
  Chip,
  Divider,
  Paper,
  Skeleton,
  useTheme
} from "@mui/material";
import { Add as AddIcon, ChatBubbleOutline as ChatIcon } from "@mui/icons-material";
import { SmallButton } from "../SmallButton";
import { PersonAvatar } from "../PersonAvatar";
import { PrivateMessageInterface, UserContextInterface } from "@churchapps/helpers";
import { ArrayHelper, DateHelper, PersonHelper } from "../../helpers";
import { PrivateMessageDetails } from "./PrivateMessageDetails";
import { NewPrivateMessage } from "./NewPrivateMessage";

interface Props {
  context: UserContextInterface;
  refreshKey: number;
  onUpdate: () => void;
}

export const PrivateMessages: React.FC<Props> = (props) => {

  const [privateMessages, setPrivateMessages] = useState<PrivateMessageInterface[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<PrivateMessageInterface>(null);
  const [inAddMode, setInAddMode] = useState(false);

  const loadData = async () => {
    console.log("loading data");
    const pms: PrivateMessageInterface[] = await ApiHelper.get("/privateMessages", "MessagingApi");
    const peopleIds: string[] = [];
    pms.forEach(pm => {
      const personId = (pm.fromPersonId === props.context.person.id) ? pm.toPersonId : pm.fromPersonId;
      if (peopleIds.indexOf(personId) === -1) peopleIds.push(personId);
    });
    if (peopleIds.length > 0) {
      const people = await ApiHelper.get("/people/basic?ids=" + peopleIds.join(","), "MembershipApi");
      pms.forEach(pm => {
        const personId = (pm.fromPersonId === props.context.person.id) ? pm.toPersonId : pm.fromPersonId;
        pm.person = ArrayHelper.getOne(people, "id", personId);
      })
    }
    setPrivateMessages(pms);
    props.onUpdate();
  }

  React.useEffect(() => { console.log("RELOADED PMS") }, []);

  const getMessageList = () => {
    if (privateMessages.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <ChatIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            No private messages
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Start a conversation by clicking the + button
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ width: '100%' }}>
        {privateMessages.map((pm, index) => {
          const person = pm.person;
          const message = pm.conversation.messages[0];
          let datePosted = new Date(message.timeUpdated || message.timeSent);
          const displayDuration = DateHelper.getDisplayDuration(datePosted);
          const contents = message.content?.split("\n")[0];
          const isUnread = false; // TODO: Implement read status tracking

          return (
            <React.Fragment key={pm.id}>
              <ListItem
                component="button"
                onClick={() => setSelectedMessage(pm)}
                sx={{
                  alignItems: 'flex-start',
                  py: 2,
                  cursor: 'pointer',
                  bgcolor: isUnread ? 'action.hover' : 'transparent',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  },
                  borderRadius: 1,
                  mb: 0.5
                }}
              >
                <ListItemAvatar>
                  <PersonAvatar person={person} size="medium" />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: isUnread ? 600 : 400 }}
                      >
                        {person.name?.display}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {isUnread && (
                          <Chip
                            size="small"
                            label="New"
                            color="primary"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                        <Typography variant="caption" color="textSecondary">
                          {displayDuration}
                        </Typography>
                      </Stack>
                    </Stack>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mt: 0.5
                      }}
                    >
                      {contents}
                    </Typography>
                  }
                />
              </ListItem>
              {index < privateMessages.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          );
        })}
      </List>
    );
  }

  const handleBack = () => {
    setInAddMode(false);
    setSelectedMessage(null);
    loadData();
  }

  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const loadDataWithLoading = async () => {
      setIsLoading(true);
      await loadData();
      setIsLoading(false);
    };
    loadDataWithLoading();
  }, [props.refreshKey]);

  if (inAddMode) return <NewPrivateMessage context={props.context} onSelectMessage={(pm: PrivateMessageInterface) => { setSelectedMessage(pm); setInAddMode(false); }} onBack={handleBack} />
  if (selectedMessage) return <PrivateMessageDetails privateMessage={selectedMessage} context={props.context} onBack={handleBack} refreshKey={props.refreshKey} />
  
  return (
    <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2">
            Private Messages
          </Typography>
          <IconButton
            color="primary"
            onClick={() => setInAddMode(true)}
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            <AddIcon />
          </IconButton>
        </Stack>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {isLoading ? (
          <Box sx={{ p: 2 }}>
            {[...Array(3)].map((_, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={56} height={56} sx={{ mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="60%" height={24} />
                  <Skeleton variant="text" width="80%" height={20} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          getMessageList()
        )}
      </Box>
    </Paper>
  );
};
