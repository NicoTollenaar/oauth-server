"use client";
import useFormData from "@/app/hooks/useFormData";
import InputField from "./InputField";
import { FormData } from "@/app/types/customTypes";
import { ReactElement } from "react";
import Button from "./Button";
import {
  loginEndpointClient,
  loginEndpointOAuth,
  redirect_uri,
  signupEndpointClient,
  signupEndpointOAuth,
} from "@/app/constants/urls";
import { Utils } from "@/app/utils/utils";
import { useRouter } from "next/navigation";
import { ServerType } from "@/app/types/customTypes";

interface LoginFormProps {
  server: ServerType;
}

export default function LoginForm({ server }: LoginFormProps): ReactElement {
  const router = useRouter();
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

  console.log("formData", formData);

  async function handleLogin() {
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

  const handleSignUp = () => {
    console.log("called handleSinUp");
  };

  return (
    <div className="flex flex-row justify-center pt-10 mb-10 w-[vw]">
      <div className="w-[50%]">
        <form className="flex flex-col gap-5">
          <InputField
            name="firstName"
            value={formData.firstName}
            type="text"
            placeholder="First Name"
            changeFormData={changeFormData}
          />
          <InputField
            name="lastName"
            value={formData.lastName}
            type="text"
            placeholder="Last Name"
            changeFormData={changeFormData}
          />
          <InputField
            name="email"
            value={formData.email}
            type="text"
            placeholder="Email"
            changeFormData={changeFormData}
          />
          <InputField
            name="password"
            value={formData.password}
            type="text"
            placeholder="Password"
            changeFormData={changeFormData}
          />
        </form>
        <div className="flex flex-row justify-between mt-5">
          <Button
            buttonText="Login"
            buttonColor="bg-blue-500"
            handleClick={handleLogin}
          />
          <Button
            buttonText="Signup"
            buttonColor="bg-blue-500"
            handleClick={handleSignUp}
          />
        </div>
      </div>
    </div>
  );
}
