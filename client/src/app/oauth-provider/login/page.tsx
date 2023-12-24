"use client";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function Login() {
  const router = useRouter();
  async function handleLogin() {
    console.log("handleLogin!");
    const body = JSON.stringify({ 
      firstName: "Piet",
      lastName: "Pietszoon",
      email: "Piet@email.com", 
      password: "some password" });
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
        router.push("http://localhost:4000/oauth-server/code");
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
    </div>
  );
}
