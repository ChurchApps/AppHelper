import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import { Close, Visibility, Edit } from '@mui/icons-material';
import { HtmlEditor } from './HtmlEditor';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  value?: string;
  onChange?: (html: string) => void;
  onSave?: (html: string) => void;
  saveButtonText?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export function HtmlModal({
  open,
  onClose,
  title = "HTML Editor",
  value = "",
  onChange,
  onSave,
  saveButtonText = "Save",
  maxWidth = "lg",
  fullWidth = true
}: Props) {
  const [currentValue, setCurrentValue] = useState(value);
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (html: string) => {
    setCurrentValue(html);
    if (onChange) {
      onChange(html);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(currentValue);
    }
    onClose();
  };

  const handleClose = () => {
    setCurrentValue(value);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        {title}
        <IconButton onClick={handleClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
        >
          <Tab icon={<Edit />} label="Edit" />
          <Tab icon={<Visibility />} label="Preview" />
        </Tabs>
        
        <Box sx={{ height: 'calc(100% - 48px)', overflow: 'hidden' }}>
          {activeTab === 0 ? (
            <HtmlEditor
              value={currentValue}
              onChange={handleChange}
              style={{ height: '100%', border: 'none' }}
              placeholder="Start typing your HTML content..."
            />
          ) : (
            <Box 
              sx={{ p: 2, height: '100%', overflow: 'auto' }}
              dangerouslySetInnerHTML={{ __html: currentValue }}
            />
          )}
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {saveButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}