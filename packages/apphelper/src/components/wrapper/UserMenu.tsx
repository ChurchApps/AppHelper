"use client";

import React from "react";
import { ApiHelper, UserHelper, LoginUserChurchInterface, UserContextInterface, CommonEnvironmentHelper } from "@churchapps/helpers";
import { Avatar, Menu, Typography, Icon, Button, Box, Badge, Modal, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { NavItem, AppList } from ".";
import { ChurchList } from "./ChurchList";
import { TabPanel } from "../TabPanel";
import { Locale } from "../../helpers";
import { PrivateMessages } from "./PrivateMessages";
import { Notifications } from "./Notifications";
import { useCookies, CookiesProvider } from "react-cookie";


interface Props {
	notificationCounts: { notificationCount: number, pmCount: number };
	loadCounts: () => void;
  userName: string;
  profilePicture: string;
  userChurches: LoginUserChurchInterface[];
  currentUserChurch: LoginUserChurchInterface;
  context: UserContextInterface;
  appName: string;
  onNavigate: (url: string) => void;
}

const UserMenuContent: React.FC<Props> = (props) => {
  const userName = props.userName;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showPM, setShowPM] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [, , removeCookie] = useCookies(["lastChurchId"]);
  const open = Boolean(anchorEl);


  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setTabIndex(0);
    setAnchorEl(null);
  };

  const handleSwitchChurch = () => {
    removeCookie("lastChurchId", { path: "/" });
    setTabIndex(2);
  };

  const getMainLinks = () => {
    const jwt = ApiHelper.getConfig("MembershipApi").jwt;
    const churchId = UserHelper.currentUserChurch.church.id;
    let result: React.ReactElement[] = [];

    // Helper function to get label with fallback
    const getLabel = (key: string, fallback: string) => {
      const label = Locale.label(key);
      return label && label !== key ? label : fallback;
    };

    result.push(<NavItem onClick={() => {setShowPM(true)}} label={getLabel("wrapper.messages", "Messages")} icon="mail" key="/messages" onNavigate={props.onNavigate} badgeCount={props.notificationCounts.pmCount} />);

    result.push(<NavItem onClick={() => {setShowNotifications(true)}} label={getLabel("wrapper.notifications", "Notifications")} icon="notifications" key="/notifications" onNavigate={props.onNavigate} badgeCount={props.notificationCounts.notificationCount} />);

    if (props.appName === "CHUMS") result.push(<NavItem url={"/profile"} key="/profile" label={getLabel("wrapper.profile", "Profile")} icon="person" onNavigate={props.onNavigate} />);
    else result.push(<NavItem url={`${CommonEnvironmentHelper.ChumsRoot}/login?jwt=${jwt}&churchId=${churchId}&returnUrl=/profile`} key="/profile" label={getLabel("wrapper.profile", "Profile")} icon="person" external={true} onNavigate={props.onNavigate} />);
    // Create logout URL with current page as return URL
    const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
    const logoutUrl = `/login?action=logout&returnUrl=${encodeURIComponent(currentPath)}`;
    result.push(<NavItem url={logoutUrl} label={getLabel("wrapper.logout", "Logout")} icon="logout" key="/logout" onNavigate={props.onNavigate} />);
    result.push(<div style={{borderTop:"1px solid #CCC", paddingTop:2, paddingBottom:2}}></div>)
    result.push(<NavItem label={getLabel("wrapper.switchApp", "Switch App")} key="Switch App" icon="apps" onClick={() => { setTabIndex(1); }} />);
    result.push(<NavItem label={getLabel("wrapper.switchChurch", "Switch Church")} key="Switch Church" icon="church" onClick={handleSwitchChurch} />);
    return result;
  }

  const getProfilePic = () => {
    if (props.profilePicture) return props.profilePicture
    else return "/images/sample-profile.png";
  }

  const paperProps = {
    elevation: 0,
    sx: {
      overflow: "visible",
      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
      mt: 1.5,
      "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
      minWidth: 450
    }
  };

  const handleItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Handle menu item clicks if needed
  }

  const [tabIndex, setTabIndex] = React.useState(0);

  const getTabs = () => (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <TabPanel value={tabIndex} index={0}>
        {getMainLinks()}
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <NavItem label="Back" key="AppBack" icon="arrow_back" onClick={() => { setTabIndex(0); }} />
        <AppList currentUserChurch={props.currentUserChurch} appName={props.appName} onNavigate={props.onNavigate} />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <div style={{ maxHeight: '70vh', overflowY: "auto" }}>
          <NavItem label="Back" key="ChurchBack" icon="arrow_back" onClick={() => { setTabIndex(0); }} />
          <ChurchList userChurches={props.userChurches} currentUserChurch={props.currentUserChurch} context={props.context} onDelete={handleClose} />
        </div>
      </TabPanel>

    </Box>
  );

  const getModals = () => {
    // Helper function to get label with fallback
    const getLabel = (key: string, fallback: string) => {
      const label = Locale.label(key);
      return label && label !== key ? label : fallback;
    };
    
    if (showPM) return (
      <Dialog 
        open 
        onClose={() => setShowPM(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            maxHeight: '700px',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle>{getLabel("wrapper.messages", "Messages")}</DialogTitle>
        <DialogContent 
          sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: 0,
            overflow: 'hidden',
            minHeight: 0
          }}
        >
          <PrivateMessages context={props.context} refreshKey={refreshKey} onUpdate={props.loadCounts} />
        </DialogContent>
      </Dialog>);
    else if (showNotifications) return (<Dialog open onClose={() => setShowNotifications(false)} maxWidth="md" fullWidth>
      <DialogTitle>{getLabel("wrapper.notifications", "Notifications")}</DialogTitle>
      <DialogContent>
      		<Notifications context={props.context} appName={props.appName} onUpdate={props.loadCounts} onNavigate={props.onNavigate} />
      	</DialogContent>
    </Dialog>);
    else return <></>;
  }

  const totalNotifcations = props.notificationCounts.notificationCount + props.notificationCounts.pmCount;

  React.useEffect(() => {
    setRefreshKey(Math.random());
  }, [props.notificationCounts]);

  return (
    <>
      <Button onClick={handleClick} color="inherit" aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} style={{ textTransform: "none" }} endIcon={<Icon>expand_more</Icon>}>
        <Badge badgeContent={totalNotifcations} color="error" invisible={totalNotifcations===0}>
          <Avatar src={getProfilePic()} sx={{ width: 32, height: 32, marginRight: 1 }}></Avatar>
        </Badge>
      </Button>

      <Menu anchorEl={anchorEl} id="account-menu" open={open} onClose={handleClose} onClick={(e) => { handleItemClick(e) }} slotProps={{ paper: paperProps }} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} sx={{ "& .MuiBox-root": { borderBottom: 0 } }}>
        {getTabs()}
      </Menu>
      {getModals()}
    </>
  );
};

export const UserMenu: React.FC<Props> = (props) => {
  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <UserMenuContent {...props} />
    </CookiesProvider>
  );
};
