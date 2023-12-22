"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GetResources() {
  const [resource, setResource] = useState<null | string>(null);
  const router = useRouter();
  const queryParams = useSearchParams();

  useEffect(() => {
    const code = queryParams.get("code");
    if (code) {
      getResource(code);
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
    router.push("http://localhost:4000/oauth-server/code");
  }

  return (
    <>
      <button className="text-red-500 outline-2 m-5" onClick={handleClick}>
        Get Resources - complete here!
      </button>
      <h1>Resource:{resource}</h1>
    </>
  );
}
