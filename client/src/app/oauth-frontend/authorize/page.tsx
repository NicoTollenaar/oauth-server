"use client";
import { useSearchParams, useRouter } from "next/navigation";
import useLoggedInStatus from "@/app/oauth-frontend/hooks/useLoggedInStatus";
import Login from "../components/Login";
import Confirm from "../components/Confirm";
import { Utils } from "@/app/utils/utils";
import { QueryObject } from "@/app/types/customTypes";
import { redirect_uri } from "@/app/constants/urls";

export default function Authorize() {
  const router = useRouter();
  const isLoggedIn = useLoggedInStatus();
  const queryParams = useSearchParams();
  let queryObject = Utils.getQueryObject(queryParams);

  if (!Utils.isProfileQueryObject(queryObject))
    router.push(`${redirect_uri}?error=incorrect query parameters`);

  return (
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
  );
}
