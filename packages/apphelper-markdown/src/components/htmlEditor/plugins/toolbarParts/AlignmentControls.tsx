import React from 'react';
import { ButtonGroup, IconButton, Tooltip } from '@mui/material';
import { FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatAlignJustify } from '@mui/icons-material';
import { FORMAT_ELEMENT_COMMAND } from 'lexical';

interface Props { editor: any; }

export function AlignmentControls({ editor }: Props) {
  return (
    <ButtonGroup size="small" variant="outlined">
      <Tooltip title="Align Left"><IconButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')} size="small"><FormatAlignLeft /></IconButton></Tooltip>
      <Tooltip title="Align Center"><IconButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')} size="small"><FormatAlignCenter /></IconButton></Tooltip>
      <Tooltip title="Align Right"><IconButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')} size="small"><FormatAlignRight /></IconButton></Tooltip>
      <Tooltip title="Justify"><IconButton onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')} size="small"><FormatAlignJustify /></IconButton></Tooltip>
    </ButtonGroup>
  );
}

