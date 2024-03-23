import { ReactElement } from "react";
import Button from "./Button";
import {
  logoutClientEndpoint,
  logoutOAuthEndpoint,
} from "@/app/constants/urls";
import useLoggedInStatus from "@/app/hooks/useLoggedInStatus";
import type { SetStateAction, Dispatch } from "react";
import { ServerType } from "@/app/types/customTypes";

interface LogoutProps {
  changeMessage: (newMessage: string | null) => void;
  server: ServerType;
}

export default function Logout({
  changeMessage,
  server,
}: LogoutProps): ReactElement {
  const {
    isLoggedIn,
    setIsLoggedIn,
  }: { isLoggedIn: boolean; setIsLoggedIn: Dispatch<SetStateAction<boolean>> } =
    useLoggedInStatus(server);

  let logoutEndpoint: string;

  switch (server) {
    case "client":
      logoutEndpoint = logoutClientEndpoint;
      break;
    case "oauth":
      logoutEndpoint = logoutOAuthEndpoint;
      break;
    default:
      logoutEndpoint = "";
  }

  async function handleLogout() {
    const response = await fetch(logoutEndpoint, {
      method: "DELETE",
      credentials: "include",
    });
    const responseBody = await response.text();
    changeMessage(responseBody);
    setTimeout(() => {
      changeMessage(null);
    }, 1000);
    if (response.ok) setIsLoggedIn(false);
  }
  return (
    <>
      <Button
        buttonText={isLoggedIn ? "Logout" : "Logged out"}
        handleClick={handleLogout}
        buttonColor={isLoggedIn ? "bg-orange-500" : "bg-orange-300"}
        disabled={!isLoggedIn}
      />
    </>
  );
}
