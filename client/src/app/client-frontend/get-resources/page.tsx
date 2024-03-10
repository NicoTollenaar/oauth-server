"use client";
import { useRouter } from "next/navigation";
import { redirect_uri } from "../../constants/urls";
import { Utils } from "../../utils/utils";
import useResource from "@/app/hooks/useResource";
import { OAuthError } from "@/app/types/customTypes";
import Button from "@/app/oauth-frontend/components/Button";
import Logout from "@/app/oauth-frontend/components/Logout";
import { REQUESTED_SCOPE } from "@/app/constants/otherConstants";

export default function GetResources() {
  const router = useRouter();
  const { resource, setResource, message, setMessage } = useResource();

  async function startOauth(): Promise<void> {
    const scope: string = REQUESTED_SCOPE;
    const authorisationUrl: string | OAuthError =
      await Utils.buildAuthorisationUrl(scope);
    if (typeof authorisationUrl !== "string") {
      setMessage(authorisationUrl.error_description);
      router.push(
        `${redirect_uri}?error=${authorisationUrl.error_description}`
      );
    }
    router.push(authorisationUrl as string);
  }

  async function handleReset() {
    router.push(redirect_uri);
    router.refresh();
    localStorage.clear();
    setResource(null);
    setMessage(null);
  }

  function changeMessage(newMessage: string | null): void {
    setMessage(newMessage);
  }

  return (
    <>
      <div className="w-[vw] flex flex-row">
        <div className="w-[30%]"></div>
        <div className="flex justify-center w-[40%]">
          <h1 className="text-[1.5em] text-center font-extrabold m-5">
            Application
          </h1>
        </div>
        <div className="flex justify-end w-[30%] m-5">
          <Logout changeMessage={changeMessage} />
        </div>
      </div>
      <div className="flex justify-center">
        <Button
          buttonText={"Oauth"}
          buttonColor="bg-green-500"
          handleClick={startOauth}
        />
        <Button
          buttonText={"Reset"}
          buttonColor="bg-red-500"
          handleClick={handleReset}
        />
      </div>
      <div className="flex flex-col justify-center gap-10 h-[50%] w-[50%] items-center">
        <pre className="w-[40%] text-left">
          {resource && `Resource: ${JSON.stringify(resource, null, 2)}`}
        </pre>
        {message && <h2 className="w-[40%] text-left">{message}</h2>}
      </div>
    </>
  );
}

// todo
// 1. verify redirect including randomstring
