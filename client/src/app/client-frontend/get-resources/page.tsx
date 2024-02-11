"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  redirect_uri,
} from "../../constants/urls";
import { Utils } from "../../utils/utils";
import useResource from "@/app/hooks/useResource";
import { OAuthError } from "@/app/types/customTypes";
import Button from "@/app/oauth-frontend/components/Button";

export default function GetResources() {
  const [message, setMessage] = useState<string | null>("");
  const router = useRouter();
  const { resource, setResource, resourceMessage, setResourceMessage } = useResource();

  function handleClick() {
    // when implementing PKCE get code challenge and code method from client server
    initiateOauthFlow();
  }

  function reset() {
    setResource(null);
    setResourceMessage(null);
  }

  async function initiateOauthFlow(): Promise<void> {
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

  return (
    <>
    <Button buttonText={"Refresh"} parentFunction={reset}/>
      <button className="text-red-500 outline-2 m-5" onClick={handleClick}>
        Get Resources - complete here!
      </button>
      <br />
      <h1>Resource:{resource && JSON.stringify(resource)}</h1>
      <br />
      {message && <h1>Normal message{message}</h1>}
      <br />
      {resourceMessage && <h1>Resource message: {resourceMessage}</h1>}
    </>
  );
}

// todo
// 1. verify redirect including randomstring
