"use client";

import React, { useState, useEffect } from "react"
import { ApiHelper, Locale, PersonHelper } from "../../helpers"
import { MessageInterface, UserContextInterface } from "@churchapps/helpers"
import { 
  Box,
  Stack,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
  Avatar
} from "@mui/material"
import { Send as SendIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { ErrorMessages } from "../ErrorMessages"

type Props = {
  messageId?: string;
  onUpdate: () => void;
  createConversation: () => Promise<string>;
  conversationId?: string;
  context: UserContextInterface
};

export function AddNote({ context, ...props }: Props) {
  const [message, setMessage] = useState<MessageInterface>()
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const headerText = props.messageId ? "Edit note" : "Add a note"

  useEffect(() => {
    if (props.messageId) ApiHelper.get(`/messages/${props.messageId}`, "MessagingApi").then((n: any) => setMessage(n));
    else setMessage({ conversationId: props.conversationId, content: "" });
    return () => {
      setMessage(null);
    };
  }, [props.messageId, props.conversationId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setErrors([]);
    const m = { ...message } as MessageInterface;
    m.content = e.target.value;
    setMessage(m);
  }

  const validate = () => {
    const result = [];
    if (!message.content.trim()) result.push(Locale.label("notes.validate.content", "Please enter a message"));
    setErrors(result);
    return result.length === 0;
  }

  async function handleSave() {
    if (validate()) {
      setIsSubmitting(true);
      let cId = props.conversationId;
      if (!cId) cId = await props.createConversation();

      const m = { ...message };
      m.conversationId = cId;
      ApiHelper.post("/messages", [m], "MessagingApi")
        .then(() => {
          props.onUpdate();
          const m = { ...message } as MessageInterface;
          m.content = "";
          setMessage(m);
        })
        .catch((error: any) => {
          console.error("Error saving message:", error);
          if (error?.message === "Forbidden") {
            setErrors(["You can't edit the message sent by others."]);
          } else {
            setErrors([error?.message || "Failed to save message. Please try again."]);
          }
        })
        .finally(() => { setIsSubmitting(false); });
    }
  };

  async function deleteNote() {
    await ApiHelper.delete(`/messages/${props.messageId}`, "MessagingApi")
    props.onUpdate()
  }

  const deleteFunction = props.messageId ? deleteNote : null;

  const image = PersonHelper.getPhotoUrl(context?.person)

  return (
    <Box sx={{ width: '100%' }}>
      <ErrorMessages errors={errors} />
      
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2, 
          bgcolor: 'grey.50',
          borderColor: 'grey.300'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar 
            src={image} 
            alt={context?.person?.name?.display}
            sx={{ width: 48, height: 48 }}
          />
          
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={2}
              name="noteText"
              aria-label={headerText}
              placeholder={props.messageId ? "Edit your message..." : "Type a message..."}
              variant="standard"
              value={message?.content || ''}
              onChange={handleChange}
              disabled={isSubmitting}
              InputProps={{
                disableUnderline: true,
                sx: { 
                  fontSize: '1rem',
                  '& textarea': {
                    resize: 'vertical',
                    minHeight: '40px'
                  }
                }
              }}
              sx={{ 
                bgcolor: 'white',
                borderRadius: 1,
                p: 1,
                border: '1px solid',
                borderColor: 'grey.300',
                '&:hover': {
                  borderColor: 'grey.400'
                },
                '&.Mui-focused': {
                  borderColor: 'primary.main'
                }
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 0.5 }}>
              {deleteFunction && (
                <IconButton
                  size="small"
                  onClick={deleteFunction}
                  disabled={isSubmitting}
                  sx={{ color: 'error.main' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                size="small"
                color="primary"
                onClick={handleSave}
                disabled={isSubmitting || !message?.content?.trim()}
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&:disabled': { 
                    bgcolor: 'action.disabledBackground',
                    color: 'action.disabled'
                  }
                }}
              >
                {isSubmitting ? <CircularProgress size={18} color="inherit" /> : <SendIcon fontSize="small" />}
              </IconButton>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
