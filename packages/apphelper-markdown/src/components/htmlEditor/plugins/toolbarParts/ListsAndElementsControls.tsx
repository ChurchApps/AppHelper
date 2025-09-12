import React from 'react';
import { ButtonGroup, IconButton, Tooltip } from '@mui/material';
import { FormatListBulleted, FormatListNumbered, FormatQuote, HorizontalRule } from '@mui/icons-material';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createQuoteNode } from '@lexical/rich-text';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';

interface Props { editor: any; }

export function ListsAndElementsControls({ editor }: Props) {
  const insertQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  return (
    <ButtonGroup size="small" variant="outlined">
      <Tooltip title="Bullet List"><IconButton onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} size="small"><FormatListBulleted /></IconButton></Tooltip>
      <Tooltip title="Numbered List"><IconButton onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} size="small"><FormatListNumbered /></IconButton></Tooltip>
      <Tooltip title="Quote"><IconButton onClick={insertQuote} size="small"><FormatQuote /></IconButton></Tooltip>
      <Tooltip title="Horizontal Rule"><IconButton onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)} size="small"><HorizontalRule /></IconButton></Tooltip>
    </ButtonGroup>
  );
}

