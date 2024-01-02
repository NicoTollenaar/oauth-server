"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { authorisationEndpointFrontend } from "../../constants/urls";
import { Utils } from "../../utils/utils";
import useResource from "@/app/oauth-frontend/hooks/useResource";

export default function GetResources() {
  // const [resource, setResource] = useState<null | string>(null);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const queryParams = useSearchParams();
  const { resource, resourceMessage } = useResource();

  // useEffect(() => {
  //   const queryCode = queryParams.get("code");
  //   const queryState = queryParams.get("state");
  //   const storageState = localStorage.getItem("state");
  //   const queryError = queryParams.has("error");
  //   if (!queryCode || !queryState || !storageState) {
  //     localStorage.removeItem("state");
  //     return;
  //   }
  //   if (queryError) {
  //     setMessage(queryParams.get("error") as string);
  //   } else if (storageState === queryState) {
  //     getAccessTokenAndResource(queryCode);
  //   } else {
  //     setMessage("someone tampered with state");
  //   }
  //   localStorage.removeItem("state");
  // });

  // still need to swap authorisation code for accestoken
  // async function getAccessTokenAndResource(code: string) {
  //   const response = await Utils.requestAccessTokenAndResource(code);
  //   const responseJSON = await response.json();
  //   if (response.ok) {
  //     setResource(responseJSON.resource);
  //     setMessage("Succes!");
  //   } else {
  //     setResource(`request failed: ${responseJSON.resource}`);
  //     setMessage("Oops, something went wrong");
  //   }
  // }

  function handleClick() {
    // when implementing PKCE get code challenge and code method from client server
    initiateOauthFlow();
  }
  function initiateOauthFlow() {
    const randomString = crypto.randomUUID();
    localStorage.setItem("state", randomString);
    const scope = "openId+profile+email";
    const queryString = Utils.buildQueryStringAuthorize(randomString, scope);
    const authorisationUrl = `${authorisationEndpointFrontend}?${queryString}`;
    router.push(authorisationUrl);
  }

  return (
    <>
      <button className="text-red-500 outline-2 m-5" onClick={handleClick}>
        Get Resources - complete here!
      </button>
      <br />
      <h1>Resource:{resource}</h1>
      <br />
      {message && <h1>{message}</h1>}
      <br />
      {resourceMessage && <h1>{resourceMessage}</h1>}
    </>
  );
}

// todo
// 1. verify redirect including randomstring
