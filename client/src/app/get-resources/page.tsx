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
    const code = queryParams.get("code");
    const state = queryParams.get("state");
    if (queryParams.get("loggedIn")) {
      handleClick();
      return;
    }
    if (!code) return;
    if (localStorage.getItem("state") === state) {
      getResource(code);
      localStorage.removeItem("state");
    } else {
      setMessage(
        `Something is wrong with state. State: ${state}, localStorage: ${localStorage.getItem(
          "state"
        )}`
      );
      setTimeout(() => {
        setMessage("");
      }, 1000);
      localStorage.removeItem("state");
      return;
    }
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
    const querystring = `
    response_type=code&
    client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&
    state=${randomString}&
    redirect_uri=${redirect_uri}&
    code_challenge="code_challenge_not_yet_used"&
    code_challenge_method=S256`;
    const authorisationRequestUrl = Utils.generateAuthorisationRequestUrl();
    router.push(authorisationRequestUrl);
  }

  return (
    <>
      <button className="text-red-500 outline-2 m-5" onClick={handleClick}>
        Get Resources - complete here!
      </button>
      <h1>Resource:{resource}</h1>
      <h2>{message && message}</h2>
    </>
  );
}

// todo
// 1. verify redirect including randomstring
