"use client";
import { useSearchParams, useRouter } from "next/navigation";
import useLoggedInStatus from "@/app/hooks/useLoggedInStatus";
import Login from "../components/Login";
import Confirm from "../components/Confirm";
import { Utils } from "@/app/utils/utils";
import { QueryObject } from "@/app/types/customTypes";
import { redirect_uri } from "@/app/constants/urls";
import { ReactElement, useState } from "react";
import { OAuthError } from "@/app/types/customTypes";

export default function Authorize(): ReactElement<any, any> | undefined {
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const { isLoggedIn }: { isLoggedIn: boolean } = useLoggedInStatus("oauth");
  console.log("isLoggedIn:", isLoggedIn);
  const queryParams: URLSearchParams = useSearchParams();
  let queryObject: Record<string, string> = Utils.getQueryObject(queryParams);
  if (!Utils.isProfileQueryObject(queryObject)) {
    router.push(`${redirect_uri}?error=incorrect query parameters`);
    return;
  }

  async function handleConfirm() {
    try {
      console.log("queryObject", queryObject);
      const authorisationCode: string | OAuthError =
        await Utils.postConsentAndGetAuthorisationCode(
          queryObject as unknown as QueryObject
        );
      console.log("authorisationCode:", authorisationCode);
      if (typeof authorisationCode === "string") {
        router.push(
          `${redirect_uri}?code=${authorisationCode}&state=${queryObject.state}`
        );
      } else {
        if (
          authorisationCode.error === "Invalid redirect URL" ||
          authorisationCode.error === "Unrecognized client_id"
        ) {
          setMessage(
            `Error: ${authorisationCode.error}; error_description: ${authorisationCode.error_description}`
          );
        } else {
          router.push(
            `${redirect_uri}?error=error ${authorisationCode.error}, error description: ${authorisationCode.error_description}`
          );
        }
      }
    } catch (error) {
      console.log("in catch block handleConfirm, logging error:", error);
      router.push(`${redirect_uri}?error=${error}`);
    }
  }

  function changeMessage(newMessage: string | null): void {
    setMessage(newMessage);
  }

  return (
    <div className="h-screen w-[vw]">
      {/* <h1 className="m-5 text-[1.5em] text-center font-extrabold">
        Authorisation Server
      </h1>
      <div className="me-[10%]">
        <Logout changeMessage={changeMessage} server="oauth" />
      </div> */}
      <div>
        {isLoggedIn ? (
          <Confirm
            queryObject={queryObject as unknown as QueryObject}
            handlerFunction={handleConfirm}
          />
        ) : (
          <Login
            loggedInStatus={isLoggedIn}
            queryObject={queryObject as unknown as QueryObject}
            handlerFunction={handleConfirm}
          />
        )}
      </div>
      <div>{message && <h1 className="text-red-500">{message}</h1>}</div>
    </div>
  );
}
