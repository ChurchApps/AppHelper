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
import { NotificationService } from "../../helpers/NotificationService";
import { SocketHelper } from "../../helpers";


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

// Create a persistent store for modal state that survives component re-renders
const modalStateStore = {
  showPM: false,
  showNotifications: false,
  listeners: new Set<() => void>(),
  
  setShowPM(value: boolean) {
    this.showPM = value;
    this.listeners.forEach((listener: () => void) => listener());
  },
  
  setShowNotifications(value: boolean) {
    this.showNotifications = value;
    this.listeners.forEach((listener: () => void) => listener());
  },
  
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
};

const UserMenuContent: React.FC<Props> = React.memo((props) => {
  const userName = props.userName;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  const [refreshKey, setRefreshKey] = React.useState(() => Math.random());
  const [, , removeCookie] = useCookies(["lastChurchId"]);
  const [directNotificationCounts, setDirectNotificationCounts] = React.useState(() => props.notificationCounts || { notificationCount: 0, pmCount: 0 });
  const open = Boolean(anchorEl);

  // Subscribe to modal state changes
  React.useEffect(() => {
    return modalStateStore.subscribe(forceUpdate);
  }, [forceUpdate]);
  
  // Subscribe directly to NotificationService to update badge counts without re-renders
  React.useEffect(() => {
    const notificationService = NotificationService.getInstance();
    const unsubscribe = notificationService.subscribe((newCounts) => {
      setDirectNotificationCounts(newCounts);
    });
    
    // Initialize with current counts
    if (notificationService.isReady()) {
      setDirectNotificationCounts(notificationService.getCounts());
    }
    
    return unsubscribe;
  }, []);

  const showPM = modalStateStore.showPM;
  const showNotifications = modalStateStore.showNotifications;

  // Create a stable callback for onUpdate that doesn't depend on props
  const stableOnUpdate = React.useCallback(() => {
    // Use NotificationService directly to avoid dependency on props.loadCounts
    NotificationService.getInstance().refresh();
  }, []);


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

    result.push(<NavItem onClick={() => {modalStateStore.setShowPM(true)}} label={getLabel("wrapper.messages", "Messages")} icon="mail" key="/messages" onNavigate={props.onNavigate} badgeCount={directNotificationCounts.pmCount} />);

    result.push(<NavItem onClick={() => {modalStateStore.setShowNotifications(true)}} label={getLabel("wrapper.notifications", "Notifications")} icon="notifications" key="/notifications" onNavigate={props.onNavigate} badgeCount={directNotificationCounts.notificationCount} />);

    if (props.appName === "CHUMS") result.push(<NavItem url={"/profile"} key="/profile" label={getLabel("wrapper.profile", "Profile")} icon="person" onNavigate={props.onNavigate} />);
    else result.push(<NavItem url={`${CommonEnvironmentHelper.ChumsRoot}/login?jwt=${jwt}&churchId=${churchId}&returnUrl=/profile`} key="/profile" label={getLabel("wrapper.profile", "Profile")} icon="person" external={true} onNavigate={props.onNavigate} />);
    // Create logout URL with current page as return URL
    const currentPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';
    const logoutUrl = `/login?action=logout&returnUrl=${encodeURIComponent(currentPath)}`;
    result.push(<NavItem url={logoutUrl} label={getLabel("wrapper.logout", "Logout")} icon="logout" key="/logout" onNavigate={props.onNavigate} />);
    result.push(<div key="divider" style={{borderTop:"1px solid #CCC", paddingTop:2, paddingBottom:2}}></div>)
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
    
    return (
      <>
        <Dialog 
          id="private-messages-modal"
          open={showPM}
          onClose={() => {
            modalStateStore.setShowPM(false);
          }} 
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
          <DialogTitle id="private-messages-title">{getLabel("wrapper.messages", "Messages")}</DialogTitle>
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
            <PrivateMessages context={props.context} refreshKey={currentRefreshKey} onUpdate={stableOnUpdate} />
          </DialogContent>
        </Dialog>
        
        <Dialog 
          id="notifications-modal"
          open={showNotifications} 
          onClose={() => {
            modalStateStore.setShowNotifications(false);
          }} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle id="notifications-title">{getLabel("wrapper.notifications", "Notifications")}</DialogTitle>
          <DialogContent>
            <Notifications context={props.context} appName={props.appName} onUpdate={props.loadCounts} onNavigate={props.onNavigate} />
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const totalNotifcations = directNotificationCounts.notificationCount + directNotificationCounts.pmCount;

  // Use a ref to track if we should update refresh key
  const stableRefreshKeyRef = React.useRef(refreshKey);
  
  // Set up WebSocket handlers to update refreshKey when messages arrive
  React.useEffect(() => {
    if (!props.context?.person?.id) return;
    
    const handleMessageUpdate = (data: any) => {
      // Only update refreshKey if a modal is open to trigger child updates
      if (modalStateStore.showPM || modalStateStore.showNotifications) {
        const newKey = Math.random();
        setRefreshKey(newKey);
        stableRefreshKeyRef.current = newKey;
      }
    };
    
    const handlePrivateMessage = (data: any) => {
      // Only update refreshKey if PM modal is open
      if (modalStateStore.showPM) {
        const newKey = Math.random();
        setRefreshKey(newKey);
        stableRefreshKeyRef.current = newKey;
      }
    };
    
    const handleNotification = (data: any) => {
      // Update refreshKey if any modal is open to trigger child updates
      if (modalStateStore.showPM || modalStateStore.showNotifications) {
        const newKey = Math.random();
        setRefreshKey(newKey);
        stableRefreshKeyRef.current = newKey;
      }
    };
    
    // Register WebSocket handlers
    const messageHandlerId = `UserMenu-MessageUpdate-${props.context.person.id}`;
    const privateMessageHandlerId = `UserMenu-PrivateMessage-${props.context.person.id}`;
    const notificationHandlerId = `UserMenu-Notification-${props.context.person.id}`;
    
    SocketHelper.addHandler("message", messageHandlerId, handleMessageUpdate);
    SocketHelper.addHandler("privateMessage", privateMessageHandlerId, handlePrivateMessage);
    SocketHelper.addHandler("notification", notificationHandlerId, handleNotification);
    
    // Cleanup
    return () => {
      SocketHelper.removeHandler(messageHandlerId);
      SocketHelper.removeHandler(privateMessageHandlerId);
      SocketHelper.removeHandler(notificationHandlerId);
    };
  }, [props.context?.person?.id]); // Removed showPM, showNotifications dependencies
  
  
  // Use current refresh key
  const currentRefreshKey = refreshKey;

  return (
    <>
      <Button id="user-menu-button" onClick={handleClick} color="inherit" aria-controls={open ? "account-menu" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} style={{ textTransform: "none" }} endIcon={<Icon>expand_more</Icon>}>
        <Badge id="user-menu-notification-badge" badgeContent={totalNotifcations} color="error" invisible={totalNotifcations===0}>
          <Avatar id="user-menu-avatar" src={getProfilePic()} sx={{ width: 32, height: 32, marginRight: 1 }}></Avatar>
        </Badge>
      </Button>

      <Menu anchorEl={anchorEl} id="user-menu-dropdown" open={open} onClose={handleClose} onClick={(e) => { handleItemClick(e) }} slotProps={{ paper: paperProps }} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} sx={{ "& .MuiBox-root": { borderBottom: 0 } }}>
        {getTabs()}
      </Menu>
      {getModals()}
    </>
  );
});

export const UserMenu: React.FC<Props> = React.memo((props) => {
  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
      <UserMenuContent {...props} />
    </CookiesProvider>
  );
}, (prevProps, nextProps) => {
  // Only re-render if essential props change, ignore notification count changes completely
  if (prevProps.userName !== nextProps.userName) {
    return false;
  }
  
  if (prevProps.profilePicture !== nextProps.profilePicture) {
    return false;
  }
  
  if (prevProps.appName !== nextProps.appName) {
    return false;
  }
  
  // Check if context has actually changed (deep comparison of relevant parts)
  if (prevProps.context?.person?.id !== nextProps.context?.person?.id ||
      prevProps.context?.userChurch?.church?.id !== nextProps.context?.userChurch?.church?.id) {
    return false;
  }
  
  // Check if userChurches array changed
  if (prevProps.userChurches?.length !== nextProps.userChurches?.length) {
    return false;
  }
  
  // Check if loadCounts function reference changed (important for functionality)
  if (prevProps.loadCounts !== nextProps.loadCounts) {
    return false;
  }
  
  // Ignore both notificationCounts and onNavigate changes as they don't affect the component
  return true; // Skip re-render
});
