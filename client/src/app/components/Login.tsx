"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Utils } from "../utils/utils";
import { redirect_uri, confirmEndpoint } from "../constants/urls";
import Confirm from "./Confirm";

interface LoginProps {
  loggedInStatus: boolean;
  client_id: string;
  scope: string;
}

export default function Login({
  loggedInStatus,
  client_id,
  scope,
}: LoginProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(loggedInStatus);
  const router = useRouter();
  const [firstName, setFirstName] = useState("Piet");
  const [lastName, setLastName] = useState("Pieterszoon");
  const [email, setEmail] = useState("piet@email.com");
  const [password, setPassword] = useState("pietsPassword");

  async function handleLogin() {
    const loginFormData = {
      firstName,
      lastName,
      email,
      password,
    };
    try {
      const response = await Utils.postLoginRequest(loginFormData);
      console.log(
        "In handleLogin, logging response postLoginRequest:",
        response
      );
      if (response?.ok) {
        setIsLoggedIn(true);
      } else {
        router.push(`${redirect_uri}?error=true`);
      }
    } catch (error) {
      console.log("in catch block handleLogin, logging error:", error);
    }
  }

  return (
    <div>
      {isLoggedIn ? (
        <Confirm client_id={client_id} scope={scope} />
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
