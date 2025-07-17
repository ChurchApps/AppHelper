import React from "react";
import { type LoginUserChurchInterface, type PersonInterface, type UserContextInterface, type UserInterface } from "@churchapps/apphelper";

const UserContext = React.createContext<UserContextInterface | undefined>(undefined);

// Create a mock UserContextInterface that allows null values
interface MockUserContextInterface {
  user: UserInterface | null;
  setUser: React.Dispatch<React.SetStateAction<UserInterface | null>>;
  userChurch: LoginUserChurchInterface | null;
  setUserChurch: React.Dispatch<React.SetStateAction<LoginUserChurchInterface | null>>;
  userChurches: LoginUserChurchInterface[] | null;
  setUserChurches: React.Dispatch<React.SetStateAction<LoginUserChurchInterface[] | null>>;
  person: PersonInterface | null;
  setPerson: React.Dispatch<React.SetStateAction<PersonInterface | null>>;
}

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = React.useState<UserInterface | null>(null);
  const [person, setPerson] = React.useState<PersonInterface | null>(null);
  const [userChurch, setUserChurch] = React.useState<LoginUserChurchInterface | null>(null);
  const [userChurches, setUserChurches] = React.useState<LoginUserChurchInterface[] | null>(null);

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
      } as UserContextInterface}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;