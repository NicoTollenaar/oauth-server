"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Utils } from "@/app/utils/utils";
import { redirect_uri, confirmEndpoint } from "@/app/constants/urls";

export default function Confirm() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const { client_id, scope } = Utils.getQueryObject(queryParams);

  async function handleConfirm() {
    try {
      const response = await Utils.postConsentDataToConfirmEndpoint(client_id, scope);
       if (response?.ok) {
         router.push(`${redirect_uri}?confirmed=true`);
       } else {
         router.push(`${redirect_uri}?error=true`);
       }
    } catch (error) {
      console.log("in catch block handleConfirm, logging error:", error);
      router.push(`${redirect_uri}?error=true`);
    }
  }
  return (
    <div>
      <h1>
        Application with clientID {client_id} is asking to access information
        with the following scope:
      </h1>
      <br />
      <ul>{JSON.stringify(scope)}</ul>
      <br />
      <h1>Do you consent?</h1>
      <br />
      <button onClick={handleConfirm}>Confirm</button>
      <br />
    </div>
  );
}
