"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Utils } from "../../utils/utils";
import { redirect_uri } from "../../constants/urls";
import Confirm from "./Confirm";
import { QueryObject } from "../../types/customTypes";

interface LoginProps {
  loggedInStatus: boolean;
  queryObject: QueryObject;
}

export default function Login({ loggedInStatus, queryObject }: LoginProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(loggedInStatus);
  const router = useRouter();
  const [firstName, setFirstName] = useState("Piet");
  const [lastName, setLastName] = useState("Pieterszoon");
  const [email, setEmail] = useState("piet@email.com");
  const [password, setPassword] = useState("pietsPassword");

  async function handleLogin() {
    const loginFormData = {
      email,
      password,
    };
    try {
      const response = await Utils.postLoginRequest(loginFormData);
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
        <Confirm queryObject={queryObject} />
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
