"use client";
import { useSearchParams } from "next/navigation";
import useLoggedInStatus from "@/app/hooks/useLoggedInStatus";
import Login from "../../components/Login";
import Confirm from "../../components/Confirm";
import { Utils } from "@/app/utils/utils";

export default function Authorize() {
  const queryParams = useSearchParams();
  const { client_id, scope } = Utils.getQueryObject(queryParams);
  const isLoggedIn = useLoggedInStatus();
  return (
    <div>
      {isLoggedIn ? (
        <Confirm client_id={client_id} scope={scope} />
      ) : (
        <Login
          loggedInStatus={isLoggedIn}
          client_id={client_id}
          scope={scope}
        />
      )}
    </div>
  );
}
