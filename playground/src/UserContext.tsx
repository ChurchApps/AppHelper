import React from "react";
import { type LoginUserChurchInterface, type PersonInterface, type UserContextInterface, type UserInterface, ApiHelper, CommonEnvironmentHelper, Locale } from "@churchapps/apphelper";

const UserContext = React.createContext<UserContextInterface | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  // Start with null user to simulate unauthenticated state
  const [user, setUser] = React.useState<UserInterface | null>(null);
  const [person, setPerson] = React.useState<PersonInterface | null>(null);
  const [userChurch, setUserChurch] = React.useState<LoginUserChurchInterface | null>(null);
  const [userChurches, setUserChurches] = React.useState<LoginUserChurchInterface[] | null>(null);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  // Configure ApiHelper and Locale like ChumsApp does
  React.useEffect(() => {
    // Initialize the staging environment like ChumsApp
    CommonEnvironmentHelper.init("staging");
    
    // Initialize locale with English translations
    Locale.init(["/locales/{{lng}}.json"]).catch(console.error);
    
    // Set up all API configurations like ChumsApp
    ApiHelper.apiConfigs = [
      {
        keyName: "AttendanceApi",
        url: CommonEnvironmentHelper.AttendanceApi,
        jwt: "",
        permissions: [],
      },
      {
        keyName: "GivingApi",
        url: CommonEnvironmentHelper.GivingApi,
        jwt: "",
        permissions: [],
      },
      {
        keyName: "MembershipApi",
        url: CommonEnvironmentHelper.MembershipApi,
        jwt: "",
        permissions: [],
      },
      {
        keyName: "ReportingApi",
        url: CommonEnvironmentHelper.ReportingApi,
        jwt: "",
        permissions: [],
      },
      {
        keyName: "DoingApi",
        url: CommonEnvironmentHelper.DoingApi,
        jwt: "",
        permissions: [],
      },
      {
        keyName: "MessagingApi",
        url: CommonEnvironmentHelper.MessagingApi,
        jwt: "",
        permissions: [],
      },
      {
        keyName: "ContentApi",
        url: CommonEnvironmentHelper.ContentApi,
        jwt: "",
        permissions: [],
      },
    ];
    
    console.log("API configuration set for staging environment:", ApiHelper.apiConfigs);
  }, []);

  // Standard logout function
  const logout = () => {
    setUser(null);
    setPerson(null);
    setUserChurch(null);
    setUserChurches(null);
    ApiHelper.isAuthenticated = false;
    
    // Clear API configs on logout
    ApiHelper.clearPermissions();
  };


  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userChurch,
        setUserChurch,
        userChurches,
        setUserChurches,
        person,
        setPerson,
        logout,
        loginError,
        clearLoginError: () => setLoginError(null),
      } as UserContextInterface & { 
        logout: () => void;
        loginError: string | null;
        clearLoginError: () => void;
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;