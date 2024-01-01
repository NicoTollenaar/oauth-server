"use client";
import { useState, useEffect } from "react";
import { loggedInStatusEndpoint } from "../../constants/urls";

export default function useLoggedInStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    async function getLoggedInStatus() {
      try {
        const response = await fetch(loggedInStatusEndpoint, {
          credentials: "include",
        });
        const { isLoggedIn } = await response.json();
        console.log("In custom hook, logging isLoggedIn:", isLoggedIn);
        setIsLoggedIn(isLoggedIn);
      } catch (error) {
        console.log("In catch block, logging error:", error);
      }
    }
    getLoggedInStatus();
  }, []);

  return isLoggedIn;
}
