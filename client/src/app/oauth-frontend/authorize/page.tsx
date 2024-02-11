"use client";
import { useSearchParams, useRouter } from "next/navigation";
import useLoggedInStatus from "@/app/hooks/useLoggedInStatus";
import Login from "../components/Login";
import Confirm from "../components/Confirm";
import { Utils } from "@/app/utils/utils";
import { QueryObject } from "@/app/types/customTypes";
import { redirect_uri } from "@/app/constants/urls";
import { ReactElement } from "react";

export default function Authorize(): ReactElement<any, any> {
  const router = useRouter();
  const isLoggedIn: boolean = useLoggedInStatus();
  const queryParams: URLSearchParams = useSearchParams();
  let queryObject: Record<string, string> = Utils.getQueryObject(queryParams);
  if (!Utils.isProfileQueryObject(queryObject))
    router.push(`${redirect_uri}?error=incorrect query parameters`);

  return (
    <div className="h-screen w-[vw] bg-slate-500">
      <h1 className="m-5 text-[1.5em] text-center font-extrabold">
        Authorisation Server
      </h1>
      <div>
        {isLoggedIn ? (
          <Confirm queryObject={queryObject as unknown as QueryObject} />
        ) : (
          <Login
            loggedInStatus={isLoggedIn}
            queryObject={queryObject as unknown as QueryObject}
          />
        )}
      </div>
    </div>
  );
}
