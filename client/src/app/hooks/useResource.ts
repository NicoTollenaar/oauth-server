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
    console.log("resource:", resource);
    console.log("resourceMessage:", resourceMessage);
  });

  async function getAccessTokenAndResource(code: string) {
    const retrievedResource = await Utils.requestAccessTokenAndResource(code);
    if (retrievedResource) {
      setResource(retrievedResource);
      setResourceMessage("Succes!");
    } else {
      setResourceMessage(`request failed`);
    }
  }

  return { resource, resourceMessage };
}
