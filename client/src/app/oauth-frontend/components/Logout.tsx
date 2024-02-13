import { ReactElement } from "react";
import Button from "./Button";
import { logoutEndpoint } from "@/app/constants/urls";
import useLoggedInStatus from "@/app/hooks/useLoggedInStatus";
import type { SetStateAction, Dispatch } from "react";

interface LogoutProps {
  changeMessage: (newMessage: string | null) => void;
}

export default function Logout({ changeMessage }: LogoutProps): ReactElement {
  const {
    isLoggedIn,
    setIsLoggedIn,
  }: { isLoggedIn: boolean; setIsLoggedIn: Dispatch<SetStateAction<boolean>> } =
    useLoggedInStatus();

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
        buttonColor={isLoggedIn ? "bg-yellow-500" : "bg-orange-300"}
        disabled={!isLoggedIn}
      />
    </>
  );
}
