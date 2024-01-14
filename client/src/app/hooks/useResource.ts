"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Utils } from "@/app/utils/utils";

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
      return;
    }
    if (queryError) {
      setResourceMessage(queryParams.get("error") as string);
    } else if (storageState === queryState) {
      getAccessTokenAndResource(queryCode);
    } else {
      setResourceMessage("someone tampered with state");
    }
    localStorage.removeItem("state");
  });

  async function getAccessTokenAndResource(code: string): Promise<void> {
    try {
      const tokenInfo = await Utils.requestAccessTokenAndResource(code);
      if (!tokenInfo) {
        setResource(null);
        setResourceMessage(
          `error: failed request \n error_description: "calling requestAccessTokenAndResource failed"`
        );
      }
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
      setResourceMessage(
        `error: catch error \n error_description: Catch error in getAccessTokenAndResource`
      );
    }
  }
  return { resource, resourceMessage };
}
