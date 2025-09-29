import { useCallback, useEffect, useRef, useState } from 'react';
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW } from 'lexical';
import { $isLinkNode } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import { createPortal } from 'react-dom';
import { Box, TextField, IconButton, FormControl, InputLabel, Select, MenuItem, Button, Checkbox, FormControlLabel } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { TOGGLE_CUSTOM_LINK_NODE_COMMAND } from './customLink/CustomLinkNode';

interface Props {
  anchorElem: HTMLElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: (value: boolean) => void;
}

export default function FloatingLinkEditorPlugin({ anchorElem, isLinkEditMode, setIsLinkEditMode }: Props) {
  const [editor] = useLexicalComposerContext();
  const [linkUrl, setLinkUrl] = useState('https://');
  const [classNamesList, setClassNamesList] = useState<Array<string>>(['', 'btn-primary', 'btn-medium']);
  const [targetAttribute, setTargetAttribute] = useState<string>('_self');
  const [isEditingLink, setIsEditingLink] = useState(false);
  const linkEditorRef = useRef<HTMLDivElement>(null);

  const updateLinkEditor = useCallback(() => {
    // Don't update if we're already in link edit mode
    if (isLinkEditMode) {
      return;
    }

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
        setLinkUrl('https://');
      }
    }
  }, [isLinkEditMode]);

  useEffect(() => {
    const handleDoubleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        e.preventDefault();
        const linkElement = (target.tagName === 'A' ? target : target.closest('a')) as HTMLAnchorElement;

        editor.update(() => {
          // Find the link node from the DOM element
          const linkNodes = editor._editorState._nodeMap;
          let foundLinkNode = null;

          linkNodes.forEach((node: any) => {
            if ($isLinkNode(node)) {
              const domElement = editor.getElementByKey(node.__key);
              if (domElement === linkElement) {
                foundLinkNode = node;
              }
            }
          });

          if (foundLinkNode) {
            // Select the link content
            foundLinkNode.selectStart();
            foundLinkNode.selectEnd();

            // Get link attributes
            const url = foundLinkNode.getURL();
            const target = foundLinkNode.getTarget();

            // Extract class names from the DOM element
            const classes = Array.from(linkElement.classList);

            // Determine the proper class list structure
            let newClassList = ['', 'btn-primary', 'btn-medium'];

            if (classes.length > 0) {
              // Check if it's a button by looking for btn class or btn-* classes
              const hasBtn = classes.includes('btn');
              const hasBtnBlock = classes.includes('btn-block');

              // Look for appearance class (first position)
              let appearanceClass = '';
              if (hasBtn && hasBtnBlock) {
                appearanceClass = 'btn btn-block';
              } else if (hasBtn) {
                appearanceClass = 'btn';
              }

              // Look for variant class (second position)
              const variantClass = classes.find(c =>
                c.startsWith('btn-') &&
                c !== 'btn-block' &&
                !c.match(/btn-(small|medium|large|xl|2x|3x|4x)$/i)
              ) || 'btn-primary';

              // Look for size class (third position)
              const sizeClass = classes.find(c =>
                c.match(/btn-(small|medium|large|xl|2x|3x|4x)$/i)
              ) || 'btn-medium';

              newClassList = [
                appearanceClass,
                variantClass,
                sizeClass
              ];
            }

            setLinkUrl(url || 'https://');
            setTargetAttribute(target || '_self');
            setClassNamesList(newClassList);
            setIsLinkEditMode(true);
          }
        });
      }
    };

    const rootElement = editor.getRootElement();
    if (rootElement) {
      rootElement.addEventListener('dblclick', handleDoubleClick);
    }

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
      ),
      () => {
        if (rootElement) {
          rootElement.removeEventListener('dblclick', handleDoubleClick);
        }
      }
    );
  }, [editor, updateLinkEditor, setIsLinkEditMode, setLinkUrl, setTargetAttribute, setClassNamesList]);

  const handleLinkSubmit = () => {
    const appearance = classNamesList[0];
    const classes = [] as string[];
    if (appearance && appearance.length > 0) {
      classes.push(appearance);
      classes.push(classNamesList[1]);
      classes.push(classNamesList[2]);
    }
    editor.dispatchCommand(TOGGLE_CUSTOM_LINK_NODE_COMMAND, {
      url: linkUrl,
      classNames: classes,
      target: targetAttribute
    });
    setIsLinkEditMode(false);
    setIsEditingLink(false);
  };

  const handleCancel = () => {
    setIsLinkEditMode(false);
    setIsEditingLink(false);
    setLinkUrl('');
  };

  if (!isLinkEditMode) return null;

  const variants = [
    'Light',
    'Light Accent',
    'Accent',
    'Dark Accent',
    'Dark',
    'Transparent Light',
    'Transparent Light Accent',
    'Transparent Accent',
    'Transparent Dark Accent',
    'Transparent Dark',
    'Primary',
    'Secondary',
    'Success',
    'Danger',
    'Warning',
    'Info'
  ];
  const sizes = ['Small', 'Medium', 'Large', 'XL', '2X', '3X', '4X'];
  let appearance = 'link';
  if (classNamesList[0]?.indexOf('btn') > -1) appearance = 'btn';
  if (classNamesList[0]?.indexOf('btn-block') > -1) appearance = 'btn btn-block';

  const getVariantKeyName = (variant: string) => {
    const keyNameParts = variant.split(' ');
    keyNameParts[0] = keyNameParts[0].toLowerCase();
    return keyNameParts.join('');
  };

  const getVariantItems = () => {
    const result: React.ReactElement[] = [];
    variants.forEach((variant: string, idx: number) => {
      result.push(
        <MenuItem key={appearance + ' btn-' + getVariantKeyName(variant)} value={'btn-' + getVariantKeyName(variant)}>
          {variant}
        </MenuItem>
      );
      if (idx === 4 || idx === 9) result.push(<MenuItem disabled>──────────</MenuItem>);
    });
    return result;
  };

  return createPortal(
    <Box
      ref={linkEditorRef}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        background: '#fff',
        padding: 1.5,
        borderRadius: 1,
        boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        minWidth: 360,
        zIndex: 1500
      }}
    >
      <TextField label="Url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} size="small" />

      <FormControl fullWidth size="small">
        <InputLabel>Appearance</InputLabel>
        <Select
          name="classNames"
          fullWidth
          label="Appearance"
          size="small"
          value={appearance}
          onChange={(e) => {
            let className = '';
            if (e.target.value.toString() !== 'link') className = e.target.value.toString();
            setClassNamesList([className, 'btn-primary', 'btn-medium']);
          }}
          MenuProps={{
            disablePortal: true,
            slotProps: { paper: { sx: { zIndex: 2500 } } }
          }}
        >
          <MenuItem value="link">Standard Link</MenuItem>
          <MenuItem value="btn">Button</MenuItem>
          <MenuItem value="btn btn-block">Full Width Button</MenuItem>
        </Select>
      </FormControl>

      {appearance !== 'link' && (
        <>
          <FormControl fullWidth size="small">
            <InputLabel>Variant</InputLabel>
            <Select
              name="classNames"
              fullWidth
              label="Variant"
              size="small"
              value={classNamesList[1]}
              onChange={(e) => {
                const newArray = [...classNamesList];
                let index = 0;
                newArray.forEach((item, i) => {
                  variants.forEach((element) => {
                    if (item.includes(getVariantKeyName(element))) {
                      index = i;
                    }
                  });
                });
                newArray.splice(index, 1, e.target.value.toString());
                setClassNamesList(newArray);
              }}
              MenuProps={{
                disablePortal: true,
                slotProps: { paper: { sx: { zIndex: 2500 } } }
              }}
            >
              {getVariantItems()}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Size</InputLabel>
            <Select
              name="classNames"
              fullWidth
              label="Size"
              size="small"
              value={classNamesList[2]}
              onChange={(e) => {
                const newArray = [...classNamesList];
                let index = 0;
                newArray.forEach((item, i) => {
                  sizes.forEach((element) => {
                    if (item.includes(element.toLowerCase())) {
                      index = i;
                    }
                  });
                });
                newArray.splice(index, 1, e.target.value.toString());
                setClassNamesList(newArray);
              }}
              MenuProps={{
                disablePortal: true,
                slotProps: { paper: { sx: { zIndex: 2500 } } }
              }}
            >
              {sizes.map((optionValue: string) => (
                <MenuItem key={appearance + ' btn-' + optionValue.toLowerCase()} value={'btn-' + optionValue.toLowerCase()}>
                  {optionValue}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={targetAttribute === '_blank'}
            onChange={() => setTargetAttribute((v) => (v === '_blank' ? '_self' : '_blank'))}
            size="small"
          />
        }
        label="Open in new window"
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <IconButton onClick={handleLinkSubmit} size="small" color="primary">
          <Check />
        </IconButton>
        <IconButton onClick={handleCancel} size="small">
          <Close />
        </IconButton>
      </Box>
    </Box>,
    anchorElem
  );
}
