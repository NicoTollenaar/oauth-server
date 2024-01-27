"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Utils } from "@/app/utils/utils";
import { TokenInfo } from "../types/customTypes";

export default function useResource() {
  const [resource, setResource] = useState<string | null>(null);
  const [resourceMessage, setResourceMessage] = useState<string | null>(null);
  const router = useRouter();
  const queryParams = useSearchParams();

  useEffect(() => {
    const queryCode = queryParams.get("code");
    const queryState = queryParams.get("state");
    const storageState = localStorage.getItem("state");
    const queryError = queryParams.has("error");
    if (!queryCode || !queryState || !storageState) {
      localStorage.removeItem("state");
      if (storageState) localStorage.removeItem(storageState);
      return;
    }
    if (queryError) {
      setResourceMessage(queryParams.get("error") as string);
    } else if (storageState === queryState) {
      getAccessTokenAndResource(queryCode, storageState);
    } else {
      setResourceMessage("invalid state");
    }
    localStorage.removeItem("state");
    localStorage.removeItem(storageState);
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
        setResourceMessage("Request failed");
      } else if (tokenInfo.active) {
        setResourceMessage("Request successful!");
      } else {
        setResourceMessage(`accesstoken expired, invalid or non-existent`);
      }
    } catch (error) {
      console.log(
        "Error in catch block getAccessTokenAndResource, logging error:",
        error
      );
      setResource(null);
      setResourceMessage(`Catch error in getAccessTokenResource: ${error}`);
    }
  }
  return { resource, resourceMessage };
}
