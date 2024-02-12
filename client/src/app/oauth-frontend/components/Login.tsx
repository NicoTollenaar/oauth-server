"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Utils } from "../../utils/utils";
import { redirect_uri } from "../../constants/urls";
import { QueryObject } from "../../types/customTypes";
import Button from "./Button";
import ConsentText from "./ConsentText";

interface LoginProps {
  loggedInStatus: boolean;
  queryObject: QueryObject;
  handlerFunction: () => void;
}

export default function Login({ queryObject, handlerFunction }: LoginProps) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("Piet");
  const [lastName, setLastName] = useState("Pieterszoon");
  const [email, setEmail] = useState("piet@email.com");
  const [password, setPassword] = useState("pietsPassword");

  async function handleLogin() {
    const loginFormData = {
      email,
      password,
    };
    try {
      const response = await Utils.postLoginRequest(loginFormData);
      if (response?.ok) {
        handlerFunction();
      } else {
        router.push(`${redirect_uri}?error=login_failed`);
      }
    } catch (error) {
      console.log("in catch block handleLogin, logging error:", error);
      router.push(`${redirect_uri}?error=catch_error: ${error}`);
    }
  }

  function handleCancel(): void {
    router.push(`${redirect_uri}?error=access_denied`);
  }

  return (
    <div className="h-[vh] w-[vw] bg-slate-500 flex flex-col items-center gap-12">
      <ConsentText queryObject={queryObject} />
      <div className="flex justify-center gap-20">
        <Button
          buttonText="Login"
          handleClick={handleLogin}
          buttonColor={"bg-gray-500"}
        />
        <Button
          buttonText="Cancel"
          handleClick={handleCancel}
          buttonColor={"bg-gray-500"}
        />
      </div>
    </div>
  );
}
