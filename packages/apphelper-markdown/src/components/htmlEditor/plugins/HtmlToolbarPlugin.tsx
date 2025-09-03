import React, { useCallback, useEffect, useState } from 'react';
import { 
  $getSelection, 
  $isRangeSelection, 
  FORMAT_TEXT_COMMAND, 
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode,
  $isTextNode
} from 'lexical';
import { 
  $createHeadingNode, 
  $isHeadingNode,
  HeadingTagType,
  $createQuoteNode
} from '@lexical/rich-text';
import { 
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  // INSERT_CHECK_LIST_COMMAND, // Checklist support removed
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode
} from '@lexical/list';
import { 
  $isLinkNode,
  TOGGLE_LINK_COMMAND
} from '@lexical/link';
// Table support removed
// import {
//   INSERT_TABLE_COMMAND
// } from '@lexical/table';
import {
  INSERT_HORIZONTAL_RULE_COMMAND
} from '@lexical/react/LexicalHorizontalRuleNode';
import { 
  $createCodeNode,
  $isCodeNode
} from '@lexical/code';
import { $setBlocksType, $patchStyleText } from '@lexical/selection';
import { $getNearestNodeOfType } from '@lexical/utils';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { 
  IconButton, 
  Select, 
  MenuItem, 
  Divider,
  Popover,
  Box,
  Input
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  Code,
  Link,
  FormatListBulleted,
  FormatListNumbered,
  // CheckBox, // Checklist support removed
  FormatQuote,
  // TableChart, // Table support removed
  HorizontalRule,
  Undo,
  Redo,
  FormatColorText,
  FormatColorFill,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatSize,
  Superscript,
  Subscript,
  FormatClear,
  CodeOff
} from '@mui/icons-material';

interface Props {
  setIsLinkEditMode: (value: boolean) => void;
  isSourceMode?: boolean;
  setIsSourceMode?: (value: boolean) => void;
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px'];

export default function HtmlToolbarPlugin({ setIsLinkEditMode, isSourceMode = false, setIsSourceMode }: Props) {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState('paragraph');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [fontSize, setFontSize] = useState('16px');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColorAnchor, setTextColorAnchor] = useState<null | HTMLElement>(null);
  const [bgColorAnchor, setBgColorAnchor] = useState<null | HTMLElement>(null);
  const [fontSizeAnchor, setFontSizeAnchor] = useState<null | HTMLElement>(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getListType() : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }

      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsSubscript(selection.hasFormat('subscript'));

      const node = selection.anchor.getNode();
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateToolbar]);

  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatCode = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (isCode) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createCodeNode());
        }
      }
    });
  };

  const insertLink = () => {
    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  };

  const applyTextColor = (color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'color': color
        });
      }
    });
    setTextColor(color);
    setTextColorAnchor(null);
  };

  const applyBgColor = (color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          'background-color': color
        });
      }
    });
    setBgColor(color);
    setBgColorAnchor(null);
  };

  const applyFontSize = (size: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach(node => {
          if ($isTextNode(node)) {
            const currentStyle = node.getStyle() || '';
            const newStyle = currentStyle.replace(/font-size:\s*[^;]+;?/, '');
            node.setStyle(`${newStyle} font-size: ${size};`);
          }
        });
      }
    });
    setFontSize(size);
    setFontSizeAnchor(null);
  };

  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach(node => {
          if ($isTextNode(node)) {
            node.setStyle('');
            node.setFormat(0);
          }
        });
      }
    });
  };

  return (
    <div className="toolbar">
      <IconButton
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        size="small"
        title="Undo"
      >
        <Undo />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        size="small"
        title="Redo"
      >
        <Redo />
      </IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      
      <Select
        value={blockType}
        size="small"
        sx={{ minWidth: 100 }}
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'h1' || value === 'h2' || value === 'h3' || value === 'h4' || value === 'h5' || value === 'h6') {
            formatHeading(value as HeadingTagType);
          } else if (value === 'paragraph') {
            formatParagraph();
          } else if (value === 'code') {
            formatCode();
          }
        }}
      >
        <MenuItem value="paragraph">Normal</MenuItem>
        <MenuItem value="h1">Heading 1</MenuItem>
        <MenuItem value="h2">Heading 2</MenuItem>
        <MenuItem value="h3">Heading 3</MenuItem>
        <MenuItem value="h4">Heading 4</MenuItem>
        <MenuItem value="h5">Heading 5</MenuItem>
        <MenuItem value="h6">Heading 6</MenuItem>
        <MenuItem value="code">Code Block</MenuItem>
      </Select>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <IconButton
        onClick={(e) => setFontSizeAnchor(e.currentTarget)}
        size="small"
        title="Font Size"
      >
        <FormatSize />
      </IconButton>
      <Popover
        open={Boolean(fontSizeAnchor)}
        anchorEl={fontSizeAnchor}
        onClose={() => setFontSizeAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 1 }}>
          {FONT_SIZES.map(size => (
            <MenuItem key={size} onClick={() => applyFontSize(size)}>
              {size}
            </MenuItem>
          ))}
        </Box>
      </Popover>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        className={isBold ? 'active' : ''}
        size="small"
        title="Bold"
      >
        <FormatBold />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        className={isItalic ? 'active' : ''}
        size="small"
        title="Italic"
      >
        <FormatItalic />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        className={isUnderline ? 'active' : ''}
        size="small"
        title="Underline"
      >
        <FormatUnderlined />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
        className={isStrikethrough ? 'active' : ''}
        size="small"
        title="Strikethrough"
      >
        <StrikethroughS />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript')}
        className={isSuperscript ? 'active' : ''}
        size="small"
        title="Superscript"
      >
        <Superscript />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript')}
        className={isSubscript ? 'active' : ''}
        size="small"
        title="Subscript"
      >
        <Subscript />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
        className={isCode ? 'active' : ''}
        size="small"
        title="Code"
      >
        <Code />
      </IconButton>
      <IconButton
        onClick={clearFormatting}
        size="small"
        title="Clear Formatting"
      >
        <FormatClear />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <IconButton
        onClick={(e) => setTextColorAnchor(e.currentTarget)}
        size="small"
        title="Text Color"
      >
        <FormatColorText />
      </IconButton>
      <Popover
        open={Boolean(textColorAnchor)}
        anchorEl={textColorAnchor}
        onClose={() => setTextColorAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Input
            type="color"
            value={textColor}
            onChange={(e) => applyTextColor(e.target.value)}
            sx={{ width: 60, height: 40 }}
          />
        </Box>
      </Popover>

      <IconButton
        onClick={(e) => setBgColorAnchor(e.currentTarget)}
        size="small"
        title="Background Color"
      >
        <FormatColorFill />
      </IconButton>
      <Popover
        open={Boolean(bgColorAnchor)}
        anchorEl={bgColorAnchor}
        onClose={() => setBgColorAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2 }}>
          <Input
            type="color"
            value={bgColor}
            onChange={(e) => applyBgColor(e.target.value)}
            sx={{ width: 60, height: 40 }}
          />
        </Box>
      </Popover>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <IconButton
        onClick={insertLink}
        className={isLink ? 'active' : ''}
        size="small"
        title="Insert Link"
      >
        <Link />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        size="small"
        title="Align Left"
      >
        <FormatAlignLeft />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        size="small"
        title="Align Center"
      >
        <FormatAlignCenter />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        size="small"
        title="Align Right"
      >
        <FormatAlignRight />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')}
        size="small"
        title="Justify"
      >
        <FormatAlignJustify />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <IconButton
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
        size="small"
        title="Bullet List"
      >
        <FormatListBulleted />
      </IconButton>
      <IconButton
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
        size="small"
        title="Numbered List"
      >
        <FormatListNumbered />
      </IconButton>
      {/* Checklist button removed */}
      <IconButton
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createQuoteNode());
            }
          });
        }}
        size="small"
        title="Quote"
      >
        <FormatQuote />
      </IconButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

      <IconButton
        onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}
        size="small"
        title="Horizontal Rule"
      >
        <HorizontalRule />
      </IconButton>
      {/* Table button removed */}
      
      {setIsSourceMode && (
        <>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <IconButton
            onClick={() => setIsSourceMode(!isSourceMode)}
            className={isSourceMode ? 'active' : ''}
            size="small"
            title={isSourceMode ? "Visual Editor" : "HTML Source"}
          >
            {isSourceMode ? <Code /> : <CodeOff />}
          </IconButton>
        </>
      )}
    </div>
  );
}