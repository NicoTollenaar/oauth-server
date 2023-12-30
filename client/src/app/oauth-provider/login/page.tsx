"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Utils } from "@/app/utils/utils";
import { redirect_uri } from "@/app/constants/urls";
export const dynamic = "force-dynamic";

export default function Login() {
  const router = useRouter();
  const queryParams = useSearchParams();
  const queryObject = Utils.getQueryObject(queryParams);

  async function handleLogin() {
    const body = JSON.stringify({
      firstName: "Piet",
      lastName: "Pietszoon",
      email: "Piet@email.com",
      password: "some password",
    });
    try {
      const response = await fetch("http://localhost:4000/oauth-server/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      if (response.ok) {
        router.push(`${redirect_uri}?loggedIn=true`);
      } else {
        throw new Error("response not ok");
      }
    } catch (error) {
      console.log("in catch block handleLogin, logging error:", error);
    }
  }
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <br />
      <p>{JSON.stringify(queryObject)}</p>
      <br />
    </div>
  );
}
