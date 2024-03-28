"use client";

import { createContext } from "react";
import useLoggedInStatus from "../hooks/useLoggedInStatus";

export const AuthenticationContext = createContext({
  isLoggedIn: false,
  changeLoggedInStatus: (newStatus: boolean) => {},
});

export default function AuthenticationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, setIsLoggedIn } = useLoggedInStatus("oauth");

  function changeLoggedInStatus(newStatus: boolean): void {
    console.log("changeLoggedInStatus called, logging newStatus:", newStatus);
    setIsLoggedIn(newStatus);
  }

  return (
    <AuthenticationContext.Provider
      value={{ isLoggedIn, changeLoggedInStatus }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
