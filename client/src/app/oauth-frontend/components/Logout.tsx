import { ReactElement, useContext } from "react";
import Button from "./Button";
import {
  logoutClientEndpoint,
  logoutOAuthEndpoint,
} from "@/app/constants/urls";
import { ServerType } from "@/app/types/customTypes";
import { AuthenticationContext } from "../authProvider";

interface LogoutProps {
  changeMessage: (newMessage: string) => void;
  server: ServerType;
}

export default function Logout({
  changeMessage,
  server,
}: LogoutProps): ReactElement {
  const {
    isLoggedIn,
    changeLoggedInStatus,
  }: {
    isLoggedIn: boolean;
    changeLoggedInStatus: (newStatus: boolean) => void;
  } = useContext(AuthenticationContext);

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

  async function handleLogout(): Promise<void> {
    const response = await fetch(logoutEndpoint, {
      method: "DELETE",
      credentials: "include",
    });
    const responseBody = await response.text();
    changeMessage(responseBody);
    setTimeout(() => {
      changeMessage("");
    }, 3000);
    if (response.ok) changeLoggedInStatus(false);
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
