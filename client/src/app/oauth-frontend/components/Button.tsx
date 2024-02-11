"use client";
import { ReactElement, useState } from "react";
import { useRouter } from "next/navigation";
import { redirect_uri } from "@/app/constants/urls";
import { logoutEndpoint } from "@/app/constants/urls";

interface ButtonProps {
  buttonText: string;
  parentFunction: () => void;
}

export default function Button({
  buttonText,
  parentFunction,
}: ButtonProps): ReactElement {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function handleClick() {
    router.push(redirect_uri);
    router.refresh();
    localStorage.clear();
    await logout();
  }

  async function logout() {
    const response = await fetch(logoutEndpoint, {
      method: "DELETE",
      credentials: "include",
    });
    const responseBody = await response.text();
    setMessage(responseBody);
    setTimeout(() => {
      setMessage(null);
    }, 1000);
    parentFunction();
  }
  return (
    <div className="flex justify-end">
      <button
        className="m-5 bg-orange-500 text-white font-bold text-xl hover:bg-orange-300 border border-white"
        onClick={handleClick}
      >
        Refresh
      </button>
      {message && <h1>{message}</h1>}
    </div>
  );
}
