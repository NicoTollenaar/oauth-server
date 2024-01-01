"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Utils } from "@/app/utils/utils";
import { redirect_uri } from "@/app/constants/urls";

export default function Login() {
  const [firstName, setFirstName] = useState("Piet");
  const [lastName, setLastName] = useState("Pieterszoon");
  const [email, setEmail] = useState("piet@email.com");
  const [password, setPassword] = useState("pietsPassword");

  const router = useRouter();
  const queryParams = useSearchParams();
  const { client_id, scope } = Utils.getQueryObject(queryParams);

  async function handleLogin() {
    const loginFormData = {
      firstName,
      lastName,
      email,
      password,
    };
    try {
    const responseLogin = await Utils.postLoginRequest(loginFormData);
      if (responseLogin?.ok) {
        const responseConfirm = await Utils.postConsentDataToConfirmEndpoint(client_id, scope);
        if (responseConfirm?.ok) {
          router.push(`${redirect_uri}?confirmed=true`);
        } else {
          router.push(`${redirect_uri}?error=true`);
        }
      } else {
        router.push(`${redirect_uri}?error=true`);
      }
    } catch (error) {
      console.log("in catch block handleLogin, logging error:", error);
      router.push(`${redirect_uri}?error=true`);
    }
  }
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <br />
    </div>
  );
}
