import React from "react";
import { type LoginUserChurchInterface, type PersonInterface, type UserContextInterface, type UserInterface, ApiHelper, UserHelper } from "@churchapps/apphelper";
import { mockUser, mockPerson, mockUserChurch, mockUserChurches } from "./mockData";

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

  // Mock authentication function
  const mockLogin = () => {
    setUser(mockUser);
    setPerson(mockPerson);
    setUserChurch(mockUserChurch);
    setUserChurches(mockUserChurches);
    ApiHelper.isAuthenticated = true;
    
    // Initialize ApiHelper with mock data to prevent JWT null errors
    try {
      UserHelper.setupApiHelper(mockUserChurch);
    } catch (error) {
      console.warn('ApiHelper setup failed in mock environment:', error);
      // Fallback: manually set up API configs to prevent null errors
      ApiHelper.apiConfigs = mockUserChurch.apis.map(api => ({
        ...api,
        permissions: []
      }));
    }
  };

  // Mock logout function
  const mockLogout = () => {
    setUser(null);
    setPerson(null);
    setUserChurch(null);
    setUserChurches(null);
    ApiHelper.isAuthenticated = false;
    
    // Clear API configs on logout
    ApiHelper.clearPermissions();
  };

  // Initialize authentication state
  React.useEffect(() => {
    // Check if we should start logged in (for demo purposes)
    const isDemo = window.location.search.includes('demo=true');
    if (isDemo) {
      mockLogin();
    }
  }, []);

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
        mockLogin,
        mockLogout,
      } as UserContextInterface & { mockLogin: () => void; mockLogout: () => void }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;