import React from "react";
import { type LoginUserChurchInterface, type PersonInterface, type UserContextInterface, type UserInterface, ApiHelper } from "@churchapps/apphelper";

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

  // Configure ApiHelper with MembershipAPI
  React.useEffect(() => {
    // Set up the MembershipAPI URL for playground
    ApiHelper.apiConfigs = [
      { 
        keyName: "MembershipApi", 
        url: "https://membershipapi.staging.churchapps.org", 
        jwt: "",
        permissions: []
      }
    ];
    
    // Also set up the default API configuration
    ApiHelper.setDefaultPermissions("");
    console.log("API configuration set:", ApiHelper.apiConfigs);
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