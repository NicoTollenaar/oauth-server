"use client";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  loggedInStatusEndpointClient,
  loggedInStatusEndpointOAuth,
} from "../constants/urls";
import { ServerType } from "../types/customTypes";

export default function useLoggedInStatus(server: ServerType): {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
} {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const loggedInStatusEndpoint: string =
    server === "oauth"
      ? loggedInStatusEndpointOAuth
      : loggedInStatusEndpointClient;

  // =====  block below is temporary until login routes for server have been made =========

  // if (server === "client") {
  //   setIsLoggedIn(false);
  //   return { isLoggedIn, setIsLoggedIn };
  // }

  // =============================================

  useEffect(() => {
    if (server === "client") {
      setIsLoggedIn(false);
      return;
    }
    async function getLoggedInStatus() {
      try {
        console.log("getLoggedInStatus called!");
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
