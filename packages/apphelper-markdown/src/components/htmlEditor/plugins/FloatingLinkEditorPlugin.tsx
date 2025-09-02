import { useCallback, useEffect, useRef, useState } from 'react';
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { createPortal } from 'react-dom';
import { Box, TextField, IconButton } from '@mui/material';
import { Check, Close } from '@mui/icons-material';

interface Props {
  anchorElem: HTMLElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: (value: boolean) => void;
}

export default function FloatingLinkEditorPlugin({ anchorElem, isLinkEditMode, setIsLinkEditMode }: Props) {
  const [editor] = useLexicalComposerContext();
  const [linkUrl, setLinkUrl] = useState('');
  const [isEditingLink, setIsEditingLink] = useState(false);
  const linkEditorRef = useRef<HTMLDivElement>(null);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode();
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
        setIsEditingLink(true);
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
        setIsEditingLink(true);
      } else {
        setIsEditingLink(false);
        setLinkUrl('');
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateLinkEditor]);

  const handleLinkSubmit = () => {
    if (linkUrl) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
    setIsLinkEditMode(false);
    setIsEditingLink(false);
  };

  const handleCancel = () => {
    setIsLinkEditMode(false);
    setIsEditingLink(false);
    setLinkUrl('');
  };

  if (!isLinkEditMode && !isEditingLink) {
    return null;
  }

  return createPortal(
    <Box
      ref={linkEditorRef}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        background: '#fff',
        padding: 1,
        borderRadius: 1,
        boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        zIndex: 1500
      }}
    >
      <TextField
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        placeholder="Enter URL"
        size="small"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleLinkSubmit();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
          }
        }}
      />
      <IconButton onClick={handleLinkSubmit} size="small">
        <Check />
      </IconButton>
      <IconButton onClick={handleCancel} size="small">
        <Close />
      </IconButton>
    </Box>,
    anchorElem
  );
}