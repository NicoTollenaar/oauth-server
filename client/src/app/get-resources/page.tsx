"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  redirect_uri,
  authorisationEndpointFrontend,
  tokenEndpoint,
} from "../constants/urls";
import { Utils } from "../utils/utils";

export default function GetResources() {
  const [resource, setResource] = useState<null | string>(null);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const queryParams = useSearchParams();

  useEffect(() => {
    // if (queryParams.get("confir")) {
    //   requestAuthorisationCode();
    //   return;
    // } else if (queryParams.get("error")) {
    //   setMessage("Confirmation failed");
    //   return;
    // }
    const queryCode = queryParams.get("code");
    const queryState = queryParams.get("state");
    const storageState = localStorage.getItem("state");
    const queryError = queryParams.has("error");
    console.log("queryCode", queryCode);
    console.log("queryState", queryState);
    console.log("storageState", storageState);
    console.log("queryError", queryError);

    if (!queryCode || !queryState || !storageState) {
      localStorage.removeItem("state");
      return;
    }
    if (queryError) {
      setMessage(queryParams.get("error") as string);
    } else if (storageState === queryState) {
      getResource(queryCode);
    } else {
      setMessage("someone tampered with state");
    }
    localStorage.removeItem("state");
  }, []);

  async function getResource(code: string) {
    const response = await fetch("/api/get-resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: code,
    });
    const { retrievedResource } = await response.json();
    if (retrievedResource) {
      setResource(retrievedResource);
    } else {
      setResource(`resource request failed: ${retrievedResource}`);
    }
  }

  function requestAuthorisationCode() {
    const randomString = crypto.randomUUID();
    localStorage.setItem("state", randomString);
    const scope = "openId+profile+email";
    const queryString = Utils.buildQueryStringAuthorize(randomString, scope);
    const authorisationUrl = `${authorisationEndpointFrontend}?${queryString}`;
    router.push(authorisationUrl);
  }

  function handleClick() {
    // when implementing PKCE get code challenge and code method from client server
    requestAuthorisationCode();
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
    </>
  );
}

// todo
// 1. verify redirect including randomstring
