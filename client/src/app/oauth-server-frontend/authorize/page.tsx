"use client";
import { useSearchParams } from "next/navigation";
import useLoggedInStatus from "@/app/hooks/useLoggedInStatus";
import Login from "../../components/Login";
import Confirm from "../../components/Confirm";
import { Utils } from "@/app/utils/utils";

export default function Authorize() {
  const queryParams = useSearchParams();
  const queryObject = Utils.getQueryObject(queryParams);
  const {
    response_type,
    scope,
    client_id,
    state,
    redirect_uri,
    code_challenge,
    code_challenge_method,
  } = Utils.getQueryObject(queryParams);

  const isLoggedIn = useLoggedInStatus();
  return (
    <div>
      {isLoggedIn ? (
        <Confirm queryObject={queryObject} />
      ) : (
        <Login
          loggedInStatus={isLoggedIn}
          queryObject={queryObject}
        />
      )}
    </div>
  );
}
