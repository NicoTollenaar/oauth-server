"use client";
import useFormData from "@/app/hooks/useFormData";
import InputField from "./InputField";
import { FormData } from "@/app/types/customTypes";
import { ReactElement, useState } from "react";
import Button from "./Button";
import {
  loginEndpointClient,
  loginEndpointOAuth,
  redirect_uri,
  signupEndpointClient,
  signupEndpointOAuth,
} from "@/app/constants/urls";
import { Utils } from "@/app/utils/utils";
import { usePathname, useRouter } from "next/navigation";
import { ServerType } from "@/app/types/customTypes";

interface FormProps {
  server: ServerType;
}

export default function LoginOrSignUpForm({ server }: FormProps): ReactElement {
  const router = useRouter();
  const pathName = usePathname();
  const lastPathSegment = pathName.split("/")[pathName.split("/").length - 1];
  console.log("lastPathSegment:", lastPathSegment);
  const [message, setMessage] = useState<string>("");
  const { formData, changeFormData } = useFormData<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  let redirectUrl: string;
  let loginEndpoint: string;
  let signupEndpoint: string;

  switch (server) {
    case "client":
      redirectUrl = redirect_uri;
      loginEndpoint = loginEndpointClient;
      signupEndpoint = signupEndpointClient;
      break;
    case "oauth":
      redirectUrl = redirect_uri;
      loginEndpoint = loginEndpointOAuth;
      signupEndpoint = signupEndpointOAuth;
      break;
    default:
      redirectUrl = "";
      loginEndpoint = "";
      signupEndpoint = "";
      break;
  }

  async function handleLogin(): Promise<void> {
    try {
      const response = await Utils.postLoginRequest(formData, loginEndpoint);
      console.log("response:", response);
      if (response?.ok) {
        console.log(
          "Succesfully logged in, logging keys of response:",
          Object.keys(response)
        );
      } else {
        router.push(`${redirect_uri}?error=login_failed`);
      }
    } catch (error) {
      console.log("in catch block handleLogin, logging error:", error);
      router.push(`${redirect_uri}?error=catch_error: ${error}`);
    }
  }

  async function handleSignUp() {
    console.log("called handleSinUp");
    try {
      const response: Response = await fetch(signupEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok)
        throw new Error(`status code:${JSON.stringify(response.status)}`);
      setMessage(await response.text());
      setTimeout(() => {
        setMessage("");
      }, 2000);
    } catch (error) {
      console.log(`Catch error in handleSignup oauth: ${error}`);
      setMessage(`Request failed: ${JSON.stringify(error)}`);
      setTimeout(() => {
        setMessage("");
      }, 2000);
      setMessage;
    }
  }

  return (
    <div className="flex flex-row justify-center pt-10 mb-10 w-[vw]">
      <div className="flex flex-col gap-5 w-[50%]">
        <form className="flex flex-col gap-5">
          {lastPathSegment === "signup" && (
            <div className="flex flex-col gap-5">
              <InputField
                name="firstName"
                value={formData.firstName}
                type="text"
                placeholder="First Name"
                changeFormData={changeFormData}
                required={true}
              />
              <InputField
                name="lastName"
                value={formData.lastName}
                type="text"
                placeholder="Last Name"
                changeFormData={changeFormData}
                required={true}
              />
            </div>
          )}
          <InputField
            name="email"
            value={formData.email}
            type="text"
            placeholder="Email"
            changeFormData={changeFormData}
            required={true}
          />
          <InputField
            name="password"
            value={formData.password}
            type="text"
            placeholder="Password"
            changeFormData={changeFormData}
            required={true}
          />
        </form>
        <div className="mt-5">
          <Button
            buttonText={lastPathSegment === "login" ? "Login" : "SignUp"}
            buttonColor="bg-blue-500"
            handleClick={
              lastPathSegment === "login" ? handleLogin : handleSignUp
            }
          />
        </div>
        {message && (
          <h1 className="text-white text-lg font-bold mt-5">{message}</h1>
        )}
      </div>
    </div>
  );
}
