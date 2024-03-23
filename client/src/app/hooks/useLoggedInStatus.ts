"use client";
import { useState, useEffect } from "react";
import {
  loggedInStatusEndpointClient,
  loggedInStatusEndpointOAuth,
} from "../constants/urls";
import { ServerType } from "../types/customTypes";

export default function useLoggedInStatus(server: ServerType) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const loggedInStatusEndpoint: string =
    server === "oauth"
      ? loggedInStatusEndpointOAuth
      : loggedInStatusEndpointClient;

  useEffect(() => {
    async function getLoggedInStatus() {
      try {
        const response = await fetch(loggedInStatusEndpoint, {
          credentials: "include",
        });
        const { isLoggedIn } = await response.json();
        setIsLoggedIn(isLoggedIn);
      } catch (error) {
        console.log("In catch block, logging error:", error);
      }
    }
    getLoggedInStatus();
  }, []);
  return { isLoggedIn, setIsLoggedIn };
}
