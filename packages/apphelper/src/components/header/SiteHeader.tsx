import React from "react";
import { AppBar, Link, styled, Toolbar } from "@mui/material";
import { UserHelper } from "../../helpers/UserHelper"
import { UserMenu } from "../wrapper/UserMenu";
import { PersonHelper } from "../../helpers/PersonHelper";
import { PrimaryMenu } from "./PrimaryMenu";
import { SecondaryMenu } from "./SecondaryMenu";
import { SecondaryMenuAlt } from "./SecondaryMenuAlt";
import { SupportDrawer } from "./SupportDrawer";
import { UserContextInterface, CommonEnvironmentHelper } from "@churchapps/helpers";
import { NotificationService } from "../../helpers/NotificationService";

type Props = {
  primaryMenuLabel: string;
  primaryMenuItems:{ url: string, icon:string, label: string }[];
  secondaryMenuLabel: string;
  secondaryMenuItems:{ url: string, label: string }[];
  context: UserContextInterface;
  appName: string;
  onNavigate: (url: string) => void;
}

export const SiteHeader = React.memo((props:Props) => {
  // Initialize NotificationService without subscribing to count changes to prevent re-renders
  React.useEffect(() => {
    const initializeNotifications = async () => {
      if (props.context?.person?.id && props.context?.userChurch?.church?.id) {
        const service = NotificationService.getInstance();
        await service.initialize(props.context);
      }
    };
    
    initializeNotifications();
  }, [props.context?.person?.id, props.context?.userChurch?.church?.id]);
  
  const refresh = React.useCallback(async () => {
    // Direct access to NotificationService for refresh functionality
    await NotificationService.getInstance().refresh();
  }, []);
  
  // Memoize userName to prevent recreation
  const userName = React.useMemo(() => {
    if (props.context?.user) {
      return `${props.context.user.firstName} ${props.context.user.lastName}`;
    }
    return '';
  }, [props.context?.user?.firstName, props.context?.user?.lastName]);
  
  // Memoize profilePicture URL
  const profilePicture = React.useMemo(() => {
    return PersonHelper.getPhotoUrl(props.context?.person);
  }, [props.context?.person]);
  
  // Create a stable context object to prevent UserMenu recreation
  const stableContext = React.useMemo(() => {
    if (!props.context) return undefined;
    
    return {
      user: props.context.user,
      person: props.context.person,
      userChurch: props.context.userChurch,
      userChurches: props.context.userChurches,
      setUser: props.context.setUser,
      setPerson: props.context.setPerson,
      setUserChurch: props.context.setUserChurch,
      setUserChurches: props.context.setUserChurches
    };
  }, [
    props.context?.user?.id,
    props.context?.user?.firstName,
    props.context?.user?.lastName,
    props.context?.person?.id,
    props.context?.userChurch?.church?.id,
    props.context?.userChurches,
    props.context?.setUser,
    props.context?.setPerson,
    props.context?.setUserChurch,
    props.context?.setUserChurches
  ]);

  const CustomAppBar = styled(AppBar)(
    ({ theme }) => ({
      zIndex: theme.zIndex.drawer + 1,
      backgroundColor: "var(--c1, #1565C0)",
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      "& .MuiIcon-root": { color: "#FFFFFF" }
    })
  );

  const getRelatedArticles = () => {
    let result: any [] = [];
    if (props.appName === "CHUMS") {
      if (props.primaryMenuLabel === "People") {
        if (props.secondaryMenuLabel === "People") result = ["chums/adding-people", "chums/advanced-search", "chums/assigning-roles"];
        else if (props.secondaryMenuLabel === "Groups") result = ["chums/group-roster", "chums/groups", "chums/group-calendar"];
        else if (props.secondaryMenuLabel === "Attendance") result = ["chums/attendance", "chums/checkin"];
      }
      else if (props.primaryMenuLabel === "Donations") {
        if (props.secondaryMenuLabel === "Summary") result = ["chums/donation-report"];
        else if (props.secondaryMenuLabel === "Batches" || props.secondaryMenuLabel === "Funds") result = ["chums/giving", "chums/manual-input"];
      }
      else if (props.primaryMenuLabel === "Serving") {
        if (props.secondaryMenuLabel === "Plans") result = ["chums/plans"];
        else if (props.secondaryMenuLabel === "Tasks") result = ["chums/tasks", "chums/automations"];
      }
      else if (props.primaryMenuLabel === "Settings") {
        if (props.secondaryMenuLabel === "Settings") result = ["chums/assigning-roles", "chums/exporting-data", "chums/import-csv", "chums/import-from-breeze"];
        else if (props.secondaryMenuLabel === "Forms") result = ["chums/forms"];
      }
    } else if (props.appName === "B1") {
      if (props.primaryMenuLabel === "Mobile App") result = ["b1/admin/portal", "b1/mobile/setup"];
      else if (props.primaryMenuLabel === "Website") result = ["b1/admin/portal", "b1/admin/website-elements", "b1/admin/website-setup"];
      else if (props.primaryMenuLabel === "Sermons") result = ["b1/admin/sermons", "b1/admin/stream-setup"];
      else if (props.primaryMenuLabel === "Calendars") result = ["b1/portal/calendars"];
    }
    return result;
  }

  /*<Typography variant="h6" noWrap>{UserHelper.currentUserChurch?.church?.name || ""}</Typography>*/
  return (<>
    <div style={{
      '--c1': '#1565C0',
      '--c1d1': '#1358AD', 
      '--c1d2': '#114A99',
      '--c1l2': '#568BDA',
      backgroundColor:"var(--c1)", 
      color: "#FFF"
    } as React.CSSProperties}>
      <CustomAppBar position="absolute">
        <Toolbar sx={{ pr: "24px", backgroundColor: "var(--c1)", minHeight: "64px !important" }}>
          <PrimaryMenu label={props.primaryMenuLabel} menuItems={props.primaryMenuItems} onNavigate={props.onNavigate} />
          <SecondaryMenu label={props.secondaryMenuLabel} menuItems={props.secondaryMenuItems} onNavigate={props.onNavigate} />
          <div style={{ flex: 1 }}>
            <SecondaryMenuAlt label={props.secondaryMenuLabel} menuItems={props.secondaryMenuItems} onNavigate={props.onNavigate} />
          </div>
          {props.context?.user?.id && (
            <UserMenu 
              key="user-menu-stable" 
              profilePicture={profilePicture} 
              userName={userName} 
              userChurches={props.context?.userChurches} 
              currentUserChurch={props.context?.userChurch} 
              context={stableContext} 
              appName={props.appName} 
              loadCounts={refresh} 
              notificationCounts={{notificationCount: 0, pmCount: 0}} 
              onNavigate={props.onNavigate} 
            />
          )}
          {!props.context?.user?.id && <Link href="/login" color="inherit" style={{ textDecoration: "none" }}>Login</Link>}
          <SupportDrawer appName={props.appName} relatedArticles={getRelatedArticles()} />
        </Toolbar>
      </CustomAppBar>
      <div id="appBarSpacer"></div>
    </div>
  </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  
  // Check if essential props have changed
  if (prevProps.primaryMenuLabel !== nextProps.primaryMenuLabel ||
      prevProps.secondaryMenuLabel !== nextProps.secondaryMenuLabel ||
      prevProps.appName !== nextProps.appName) {
    return false;
  }
  
  // Check if menu items arrays have changed (shallow comparison)
  if (prevProps.primaryMenuItems?.length !== nextProps.primaryMenuItems?.length ||
      prevProps.secondaryMenuItems?.length !== nextProps.secondaryMenuItems?.length) {
    return false;
  }
  
  // Check if user context has actually changed (deep comparison of essential parts)
  const prevUser = prevProps.context?.user;
  const nextUser = nextProps.context?.user;
  
  if (prevUser?.id !== nextUser?.id ||
      prevUser?.firstName !== nextUser?.firstName ||
      prevUser?.lastName !== nextUser?.lastName) {
    return false;
  }
  
  // Check if person context has changed
  if (prevProps.context?.person?.id !== nextProps.context?.person?.id) {
    return false;
  }
  
  // Check if church context has changed
  if (prevProps.context?.userChurch?.church?.id !== nextProps.context?.userChurch?.church?.id) {
    return false;
  }
  
  // Check if onNavigate function reference has changed
  if (prevProps.onNavigate !== nextProps.onNavigate) {
    return false;
  }
  
  // All essential props are the same, skip re-render
  return true;
});

SiteHeader.displayName = 'SiteHeader';
