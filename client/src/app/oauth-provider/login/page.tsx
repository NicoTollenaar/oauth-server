"use client";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function Login() {
  const router = useRouter();
  async function handleLogin() {
    console.log("handleLogin!");
    const body = JSON.stringify({ email: "Piet", password: "some password" });
    try {
      const response = await fetch("http://localhost:4000/oauth-server/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      console.log("response.ok:", response.ok);
      if (response.ok) {
        console.log("in if statement before router.push");
        router.push("http://localhost:4000/oauth-server/code");
      } else {
        throw new Error("response not ok, logging response:");
      }
    } catch (error) {
      console.log("in catch block handleLogin, logging error:", error);
    }
  }
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
