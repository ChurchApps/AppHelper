import React, { useEffect, useState } from 'react';
import { $getRoot } from 'lexical';
import { $generateHtmlFromNodes } from '@lexical/html';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
// import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'; // Checklist removed
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
// import { TablePlugin } from '@lexical/react/LexicalTablePlugin'; // Table removed
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
// import { CodeHighlightPlugin } from '@lexical/react/LexicalCodeHighlightPlugin';
import { ListNode, ListItemNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
// import { TableNode, TableCellNode, TableRowNode } from '@lexical/table'; // Table nodes removed
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { LinkNode } from '@lexical/link';
import { AutoLinkNode } from '@lexical/link';

import HtmlToolbarPlugin from './plugins/HtmlToolbarPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import ReadOnlyPlugin from './plugins/ReadOnlyPlugin';
import ControlledEditorPlugin from './plugins/ControlledEditorPlugin';
import HtmlSourcePlugin from './plugins/HtmlSourcePlugin';
import theme from './theme';
import './editor.css';

interface Props {
  value: string;
  onChange?: (html: string) => void;
  style?: React.CSSProperties;
  placeholder?: string;
  readOnly?: boolean;
}

export default function HtmlEditorInner({ value, onChange, style, placeholder = 'Start typing...', readOnly = false }: Props) {
  const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const [isSourceMode, setIsSourceMode] = useState(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const initialConfig: InitialConfigType = {
    namespace: 'HtmlEditor',
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      // TableNode, TableCellNode, TableRowNode, // Table nodes removed
      HorizontalRuleNode,
      LinkNode,
      AutoLinkNode
    ]
  };

  const handleChange = (editorState: any) => {
    if (onChange) {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editorState);
        onChange(html);
      });
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container" style={style}>
        <HtmlToolbarPlugin 
          setIsLinkEditMode={setIsLinkEditMode} 
          isSourceMode={isSourceMode}
          setIsSourceMode={setIsSourceMode}
        />
        <div className="editor-inner" style={{ position: 'relative', minHeight: '150px' }}>
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller" style={{ display: isSourceMode ? 'none' : 'block' }}>
                <div className="editor" ref={onRef}>
                  <ContentEditable className="editor-input" />
                </div>
              </div>
            }
            placeholder={<div className="editor-placeholder" style={{ display: isSourceMode ? 'none' : 'block' }}>{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={handleChange} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          {/* <CheckListPlugin /> */}
          <TabIndentationPlugin />
          {/* <TablePlugin /> */}
          <HorizontalRulePlugin />
          {/* <CodeHighlightPlugin /> */}
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          {readOnly && <ReadOnlyPlugin readOnly={readOnly} />}
          <ControlledEditorPlugin value={value} />
          <HtmlSourcePlugin isSourceMode={isSourceMode} />
          {floatingAnchorElem && !isSourceMode && (
            <>
              <FloatingTextFormatToolbarPlugin anchorElem={floatingAnchorElem} />
              <FloatingLinkEditorPlugin
                anchorElem={floatingAnchorElem}
                isLinkEditMode={isLinkEditMode}
                setIsLinkEditMode={setIsLinkEditMode}
              />
            </>
          )}
        </div>
      </div>
    </LexicalComposer>
  );
}