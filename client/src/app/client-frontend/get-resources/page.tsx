"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { redirect_uri } from "../../constants/urls";
import { Utils } from "../../utils/utils";
import useResource from "@/app/hooks/useResource";
import { OAuthError } from "@/app/types/customTypes";
import Button from "@/app/oauth-frontend/components/Button";
import { logoutEndpoint } from "../../constants/urls";

export default function GetResources() {
  const router = useRouter();
  const { resource, setResource, message, setMessage } = useResource();

  async function startOauth(): Promise<void> {
    const scope: string = "openId+profile+email";
    const authorisationUrl: string | OAuthError =
      await Utils.buildAuthorisationUrl(scope);
    if (typeof authorisationUrl !== "string") {
      setMessage(authorisationUrl.error_description);
      router.push(
        `${redirect_uri}?error=${authorisationUrl.error_description}`
      );
    }
    router.push(authorisationUrl as string);
  }

  async function handleReset() {
    router.push(redirect_uri);
    router.refresh();
    localStorage.clear();
    setResource(null);
    setMessage(null);
    await logout();
  }

  async function logout() {
    const response = await fetch(logoutEndpoint, {
      method: "DELETE",
      credentials: "include",
    });
    const responseBody = await response.text();
    setMessage(responseBody);
    setTimeout(() => {
      setMessage(null);
    }, 1000);
  }

  return (
    <>
    <h1 className="m-5 text-[1.5em] text-center font-extrabold">Application</h1>
      <div className="flex justify-center gap-5">
        <Button
          buttonText={"Oauth"}
          buttonColor="bg-green-500"
          handleClick={startOauth}
        />
        <Button
          buttonText={"Reset"}
          buttonColor="bg-red-500"
          handleClick={handleReset}
        />
      </div>
      <div className="flex flex-col justify-center gap-10 h-[50%] w-[50%]">
        <h1>{resource && `Resource: ${JSON.stringify(resource)}`}</h1>
        {message && <h1>{message}</h1>}
      </div>
    </>
  );
}

// todo
// 1. verify redirect including randomstring
