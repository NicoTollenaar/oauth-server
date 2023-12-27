"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  redirect_uri,
  authorisationEndpoint,
  tokenEndpoint,
} from "../constants/urls";
import { Utils } from "../utils/utils";

export default function GetResources() {
  const [resource, setResource] = useState<null | string>(null);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const queryParams = useSearchParams();

  useEffect(() => {
    if (queryParams.get("loggedIn")) {
      handleClick();
      return;
    }
    const queryCode = queryParams.get("code");
    const queryState = queryParams.get("state");
    if (!queryCode) return;
    if (!queryState) return;
    if (localStorage.getItem("state") === queryState) getResource(queryCode);
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

  function handleClick() {
    // when implementing PKCE get code challenge and code method from client server
    const randomString = crypto.randomUUID();
    localStorage.setItem("state", randomString);
    const authorisationRequestUrl =
      Utils.generateAuthorisationRequestUrl(randomString);
    router.push(authorisationRequestUrl);
  }

  return (
    <>
      <button className="text-red-500 outline-2 m-5" onClick={handleClick}>
        Get Resources - complete here!
      </button>
      <br />
      <h1>Resource:{resource}</h1>
      <br />
    </>
  );
}

// todo
// 1. verify redirect including randomstring
