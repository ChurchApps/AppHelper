"use client";

import React from "react";
import { Paper, Box, Typography, Stack, Button, Icon, PaperProps } from "@mui/material";
import { HelpIcon } from "./HelpIcon";
import { Locale } from "../helpers";
import { styled, useTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    InputBox: { headerText: string; };
  }
  interface PaletteOptions {
    InputBox?: { headerText?: string; };
  }
}


interface Props {
  id?: string;
  children?: React.ReactNode;
  headerIcon?: string;
  headerText?: string;
  help?: string;
  saveText?: string;
  deleteText?: string;
  cancelText?: string;
  headerActionContent?: React.ReactNode;
  cancelFunction?: () => void;
  deleteFunction?: () => void;
  saveFunction?: () => void;
  "data-testid"?: string;
  className?: string;
  isSubmitting?: boolean;
  ariaLabelDelete?: string;
  ariaLabelSave?: string;
  saveButtonType?: "submit" | "button";
  mainContainerCssProps?: PaperProps;
}

const CustomContextBox = styled(Box)({
  name: "InputBox",
  slot: "root",
  marginTop: 10,
  overflowX: "hidden",
  "& p": { color: "#666" },
  "& label": { color: "#999" },
  "& ul": { paddingLeft: 15 },
  "& li": {
    marginBottom: 10,
    "& i": { marginRight: 5 }
  },
  "& td": {
    "& i": { marginRight: 5 }
  }
})


export function InputBox({ mainContainerCssProps = {}, ...props }: Props) {
  const theme = useTheme();
  const headerText = theme?.palette?.InputBox?.headerText ? theme?.palette?.InputBox?.headerText : "primary";

  let buttons = [];
  if (props.cancelFunction) buttons.push(<Button key="cancel" onClick={props.cancelFunction} color="warning" sx={{ "&:focus": { outline: "none" } }}>{props.cancelText || Locale.label("common.cancel")}</Button>);
  if (props.deleteFunction) buttons.push(<Button key="delete" id="delete" variant="outlined" aria-label={props.ariaLabelDelete} onClick={props.deleteFunction} color="error" sx={{ "&:focus": { outline: "none" } }}>{props.deleteText || Locale.label("common.delete")}</Button>);
  if (props.saveFunction) buttons.push(<Button key="save" type={props.saveButtonType || "button"} variant="contained" disableElevation aria-label={props.ariaLabelSave} onClick={props.saveFunction} disabled={props.isSubmitting} sx={{ "&:focus": { outline: "none" } }}>{props.saveText || Locale.label("common.save")}</Button>);

  let classNames = ["inputBox"];
  if (props.className) {
    classNames.push(props.className);
  }

  return (
    <Paper id={props.id} sx={{ padding: 2, marginBottom: 4 }} data-testid={props["data-testid"]} {...mainContainerCssProps}>
      {props.help && <HelpIcon article={props.help} />}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }} data-testid="input-box-header">
        <Box display="flex" alignItems="center">
          {props.headerIcon && <Icon sx={{ color: headerText }}>{props.headerIcon}</Icon>}
          {props.headerText && (
            <Typography component="h2" sx={{ display: "inline-block", marginLeft: props.headerIcon ? 1 : 0 }} variant="h6" color={headerText}>
              {props.headerText}
            </Typography>
          )}
        </Box>
        <Box>
          {props.headerActionContent}
        </Box>
      </Box>
      <CustomContextBox>{props.children}</CustomContextBox>
      <Stack direction="row" sx={{ marginTop: 1 }} spacing={1} justifyContent="end">
        {buttons}
      </Stack>
    </Paper>
  );
}
