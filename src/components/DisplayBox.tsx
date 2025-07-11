"use client";

import React from "react";
import { Paper, Box, Typography, Icon } from "@mui/material";
import { HelpIcon } from "./HelpIcon";
import { SmallButton } from "./SmallButton";
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
  id?: string,
  children: React.ReactNode,
  headerIcon?: string,
  headerText: string,
  editFunction?: () => void,
  editContent?: React.ReactNode,
  "data-testid"?: string,
  ariaLabel?: string,
  footerContent?: React.ReactNode,
  help?: string
}

/* "& p": { color: "#666" }, */
const CustomContextBox = styled(Box)({
  marginTop: 10,
  overflowX: "hidden",
  "& label": { color: "#999" },
  "& ul": { paddingLeft: 0 },
  "& li": {
    listStyleType: "none",
    marginBottom: 10,
    "& i": { marginRight: 5 }
  },
  "& td": {
    "& i": { marginRight: 5 }
  },
  "& td:first-of-type": { paddingLeft: 0 },
  "& td:last-of-type": { paddingRight: 0 },
  "& th:first-of-type": { paddingLeft: 0 },
  "& th:last-of-type": { paddingRight: 0 }
});

export const DisplayBox = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const theme = useTheme();
  const headerText = theme?.palette?.InputBox?.headerText ? theme?.palette?.InputBox?.headerText : "primary";

  let editContent: React.ReactNode;
  if (props.editFunction !== undefined) {
    editContent = <SmallButton icon="edit" aria-label={props.ariaLabel || "editButton"} onClick={props.editFunction} />
  }
  else if (props.editContent !== undefined) editContent = props.editContent;

  return (
    <Paper sx={{ padding: 2, marginBottom: 4 }} id={props.id} data-testid={props["data-testid"] || ""}>
      {props.help && <HelpIcon article={props.help} />}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {props.headerIcon && <Icon sx={{ color: headerText }}>{props.headerIcon}</Icon>}
          <Typography component="h2" sx={{ display: "inline-block", marginLeft: props.headerIcon ? 1 : 0 }} variant="h6" color={headerText}>
            {props.headerText}
          </Typography>

        </Box>
        <Box>
          {editContent}
        </Box>
      </Box>
      <CustomContextBox ref={ref} data-testid="display-box-content">{props.children}</CustomContextBox>
      {props.footerContent && (<div style={{ marginLeft: -16, marginRight: -16, marginBottom: -15, marginTop: 15 }}>{props.footerContent}</div>)}
    </Paper>
  );
})

DisplayBox.displayName = "DisplayBox";
