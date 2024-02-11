"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Utils } from "@/app/utils/utils";
import { TokenInfo } from "../types/customTypes";

export default function useResource() {
  const [resource, setResource] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const queryParams = useSearchParams();

  useEffect(() => {
    const queryCode: string | null = queryParams.get("code");
    const queryState: string | null = queryParams.get("state");
    const storageState: string | null = localStorage.getItem("state");
    const isQueryError: boolean = queryParams.has("error");
    const queryError: string | null = queryParams.get("error");
    if (isQueryError) {
      setMessage(queryError);
    } else if (!queryCode || !queryState || !storageState) {
      localStorage.removeItem("state");
      if (storageState) localStorage.removeItem(storageState);
      return;
    } else if (storageState === queryState) {
      getAccessTokenAndResource(queryCode, storageState);
    } else {
      setMessage("invalid state");
    }
    localStorage.removeItem("state");
    if (storageState) localStorage.removeItem(storageState);
  });

  async function getAccessTokenAndResource(
    authorisationCode: string,
    storageState: string
  ): Promise<void> {
    try {
      const storedCodeChallenge: string | null =
        localStorage.getItem(storageState);
      if (!storedCodeChallenge)
        throw new Error("storedCodeChallenge not found");
      const tokenInfo: TokenInfo = await Utils.requestAccessTokenAndResource(
        authorisationCode,
        storedCodeChallenge
      );
      if (!tokenInfo)
        throw new Error("requestAccessTokenAndResource returned null");
      setResource(JSON.stringify(tokenInfo));
      if ("error" in tokenInfo) {
        setResource(
          `error: ${tokenInfo.error}; error_description: ${tokenInfo.error_description}`
        );
        setMessage("Request failed");
      } else if (tokenInfo.active) {
        setMessage("Request successful!");
      } else {
        setMessage(`accesstoken expired, invalid or non-existent`);
      }
    } catch (error) {
      console.log(
        "Error in catch block getAccessTokenAndResource, logging error:",
        error
      );
      setResource(null);
      setMessage(`catch_error in getAccessTokenResource: ${error}`);
    }
  }
  return { resource, setResource, message, setMessage };
}
