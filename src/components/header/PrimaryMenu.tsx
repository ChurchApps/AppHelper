import React from "react";
import { Box, Button, Icon, Menu } from "@mui/material";
import { NavItem } from "../wrapper/NavItem";

interface Props {
  label: string,
  menuItems: { url: string, icon:string, label: string }[]
	onNavigate: (url: string) => void,
}

export const PrimaryMenu = (props:Props) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => { setAnchorEl(null); };

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const paperProps = {
    elevation: 0,
    sx: {
      backgroundColor: "var(--c1)",
      color: "#FFF",
      overflow: "visible",
      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",

      "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
      minWidth: 300
    }
  };

  const getNavItems = () => {
    let result: React.ReactElement[] = [];
    props.menuItems.forEach(item => {
      result.push(<NavItem url={item.url} label={item.label.toUpperCase()} icon={item.icon} key={item.url} onNavigate={props.onNavigate} />);
    });
    return result;
  }

  return (<>
    <Button onClick={handleClick} color="inherit" aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} endIcon={<Icon>expand_more</Icon>} id="primaryNavButton">
      <img src="/images/logo-icon.png" alt="Primary Menu" />
      <h2>{props.label}</h2>
    </Button>

    <Menu anchorEl={anchorEl} id="account-menu" open={anchorEl!==null} onClose={handleClose} slotProps={{ paper: paperProps }} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} sx={{ "& .MuiBox-root": { borderBottom: 0 } }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }} id="primaryMenu">
        {getNavItems()}
      </Box>
    </Menu>
  </>

  )
}
