"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Utils } from "../../utils/utils";
import { redirect_uri } from "../../constants/urls";
import type { OAuthError, QueryObject } from "@/app/types/customTypes";

interface ConfirmProps {
  queryObject: QueryObject;
}

export default function Confirm({ queryObject }: ConfirmProps) {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  async function handleConfirm() {
    try {
      const authorisationCode: string | OAuthError =
        await Utils.postConsentAndGetAuthorisationCode(queryObject);
      if (typeof authorisationCode === "string") {
        router.push(
          `${redirect_uri}?code=${authorisationCode}&state=${queryObject.state}`
        );
      } else {
        if (
          authorisationCode.error === "Invalid redirect URL" ||
          authorisationCode.error === "Unrecognized client_id"
        ) {
          setMessage(
            `Error: ${authorisationCode.error}; error_description: ${authorisationCode.error_description}`
          );
        } else {
          router.push(
            `${redirect_uri}?error=error: ${authorisationCode.error}, error description: ${authorisationCode.error_description}`
          );
        }
      }
    } catch (error) {
      console.log("in catch block handleConfirm, logging error:", error);
      router.push(`${redirect_uri}?error=${error}`);
    }
  }
  return (
    <div>
      <h1>
        Application with clientID {queryObject.client_id} is asking to access
        information with the following scope:
      </h1>
      <br />
      <ul>{JSON.stringify(queryObject.scope)}</ul>
      <br />
      <h1>Do you consent?</h1>
      <br />
      <button onClick={handleConfirm}>Confirm</button>
      <br />
      <br />
      {message && <h1 className="text-red-500">{message}</h1>}
    </div>
  );
}
