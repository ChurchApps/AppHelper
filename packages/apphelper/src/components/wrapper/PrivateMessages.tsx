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

  React.useEffect(() => { }, []);

  const getMessageList = () => {
    if (privateMessages.length === 0) {
      return (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          px: 4,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Box sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: 'rgba(25, 118, 210, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '1px solid rgba(25, 118, 210, 0.12)',
              animation: 'pulse 2s infinite'
            },
            '@keyframes pulse': {
              '0%': {
                transform: 'scale(1)',
                opacity: 1
              },
              '50%': {
                transform: 'scale(1.05)',
                opacity: 0.7
              },
              '100%': {
                transform: 'scale(1)',
                opacity: 1
              }
            }
          }}>
            <ChatIcon sx={{ 
              fontSize: 56, 
              color: 'primary.main',
              opacity: 0.8
            }} />
          </Box>
          <Typography variant="h5" sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            mb: 1.5,
            letterSpacing: '-0.02em'
          }}>
            No conversations yet
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'text.secondary',
            maxWidth: 280,
            lineHeight: 1.6,
            mb: 3
          }}>
            Start meaningful conversations with your community members. Your messages will appear here.
          </Typography>
          <Box sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'rgba(25, 118, 210, 0.04)',
            border: '1px solid rgba(25, 118, 210, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}>
            <AddIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="body2" sx={{ 
              color: 'primary.main',
              fontWeight: 500
            }}>
              Click the + button above to start your first conversation
            </Typography>
          </Box>
        </Box>
      );
    }

    return (
      <List sx={{ 
        width: '100%', 
        p: 0,
        '& .MuiListItem-root': {
          transition: 'all 0.2s ease-in-out'
        }
      }}>
        {privateMessages.map((pm, index) => {
          const person = pm.person;
          const message = pm.conversation?.messages?.[0];
          if (!message || !person) return null;
          let datePosted = new Date(message.timeUpdated || message.timeSent);
          const displayDuration = DateHelper.getDisplayDuration(datePosted);
          const contents = message.content?.split("\n")[0];
          const isUnread = false; // TODO: Implement read status tracking

          return (
            <Box key={pm.id} sx={{ px: 2, py: 0.5 }}>
              <ListItem
                component="button"
                onClick={() => setSelectedMessage(pm)}
                sx={{
                  alignItems: 'flex-start',
                  p: 3,
                  cursor: 'pointer',
                  bgcolor: isUnread 
                    ? 'rgba(25, 118, 210, 0.04)' 
                    : 'background.paper',
                  border: isUnread 
                    ? '1px solid rgba(25, 118, 210, 0.12)' 
                    : '1px solid transparent',
                  borderRadius: 3,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: 'translateY(0)',
                  '&:hover': {
                    bgcolor: isUnread 
                      ? 'rgba(25, 118, 210, 0.06)' 
                      : 'rgba(0, 0, 0, 0.02)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    transform: 'translateY(-1px)',
                    borderColor: 'rgba(0, 0, 0, 0.06)'
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': isUnread ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    bgcolor: 'primary.main',
                    borderRadius: '0 2px 2px 0'
                  } : {}
                }}
              >
                <ListItemAvatar sx={{ mr: 2 }}>
                  <Box sx={{ position: 'relative' }}>
                    <PersonAvatar person={person} size="medium" />
                    {isUnread && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          width: 14,
                          height: 14,
                          bgcolor: 'primary.main',
                          borderRadius: '50%',
                          border: '2px solid white',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                        }}
                      />
                    )}
                  </Box>
                </ListItemAvatar>
                
                <ListItemText
                  sx={{ m: 0, flex: 1 }}
                  primary={
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 0.5 }}>
                      <Typography
                        variant="h6"
                        sx={{ 
                          fontWeight: isUnread ? 600 : 500,
                          fontSize: '1rem',
                          color: 'text.primary',
                          lineHeight: 1.3
                        }}
                      >
                        {person.name?.display}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'text.secondary',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          letterSpacing: '0.02em',
                          ml: 2,
                          flexShrink: 0
                        }}
                      >
                        {displayDuration}
                      </Typography>
                    </Stack>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        fontWeight: isUnread ? 500 : 400,
                        lineHeight: 1.4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        opacity: contents ? 1 : 0.6,
                        fontStyle: contents ? 'normal' : 'italic'
                      }}
                    >
                      {contents || 'No message preview available'}
                    </Typography>
                  }
                />
                
                {isUnread && (
                  <Box sx={{ ml: 1, display: 'flex', alignItems: 'flex-start', pt: 0.5 }}>
                    <Chip
                      size="small"
                      label="New"
                      sx={{
                        height: 22,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        bgcolor: 'primary.main',
                        color: 'white',
                        '& .MuiChip-label': {
                          px: 1
                        }
                      }}
                    />
                  </Box>
                )}
              </ListItem>
            </Box>
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
    <Paper elevation={0} sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.default',
      borderRadius: 0
    }}>
      <Box sx={{ 
        p: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        backdropFilter: 'blur(10px)'
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" component="h1" sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              letterSpacing: '-0.02em',
              mb: 0.5
            }}>
              Messages
            </Typography>
            <Typography variant="body2" sx={{
              color: 'text.secondary',
              fontWeight: 500
            }}>
              {privateMessages.length === 0 
                ? 'No conversations' 
                : `${privateMessages.length} conversation${privateMessages.length === 1 ? '' : 's'}`
              }
            </Typography>
          </Box>
          <IconButton
            onClick={() => setInAddMode(true)}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              width: 48,
              height: 48,
              boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': { 
                bgcolor: 'primary.dark',
                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                transform: 'translateY(-1px)'
              },
              '&:active': {
                transform: 'translateY(0)',
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)'
              }
            }}
          >
            <AddIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Stack>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {isLoading ? (
          <Box sx={{ p: 2 }}>
            {[...Array(3)].map((_, index) => (
              <Box key={index} sx={{ px: 2, py: 0.5, mb: 1 }}>
                <Box sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'background.paper',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <Skeleton 
                    variant="circular" 
                    width={56} 
                    height={56} 
                    sx={{ mr: 2, flexShrink: 0 }} 
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Skeleton variant="text" width="45%" height={24} sx={{ borderRadius: 1 }} />
                      <Skeleton variant="text" width="20%" height={18} sx={{ borderRadius: 1 }} />
                    </Box>
                    <Skeleton variant="text" width="85%" height={20} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="text" width="65%" height={20} sx={{ borderRadius: 1, mt: 0.5 }} />
                  </Box>
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
