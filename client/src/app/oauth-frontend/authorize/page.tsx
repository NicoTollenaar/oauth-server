"use client";
import { useSearchParams } from "next/navigation";
import useLoggedInStatus from "@/app/oauth-frontend/hooks/useLoggedInStatus";
import Login from "../components/Login";
import Confirm from "../components/Confirm";
import { Utils } from "@/app/utils/utils";
import { QueryObject } from "@/app/types/customTypes";

export default function Authorize() {
  const queryParams = useSearchParams();
  const queryObject = Utils.getQueryObject(queryParams);
  const isLoggedIn = useLoggedInStatus();
  return (
    <div>
      {isLoggedIn ? (
        <Confirm queryObject={queryObject} />
      ) : (
        <Login loggedInStatus={isLoggedIn} queryObject={queryObject} />
      )}
    </div>
  );
}
