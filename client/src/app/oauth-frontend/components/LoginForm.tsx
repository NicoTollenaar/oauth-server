"use client";
import useFormData from "@/app/hooks/useFormData";
import InputField from "./InputField";
import { FormData } from "@/app/types/customTypes";
import { ReactComponentElement, ReactElement } from "react";
import Button from "./Button";

interface LoginFormProps {
  handleLogin: () => void;
  handleSubmit: () => void;
}

export default function LoginForm({handleLogin, handleSubmit}: LoginFormProps): ReactElement {
  const { formData, setFormData } = useFormData();
  console.log("formData", formData);

  function changeFormData(field: string, value: string): void {
    setFormData((formData: FormData): FormData => {
      return { ...formData, [`${field}`]: value };
    });
  }

  return (
    <div className="flex flex-row justify-center pt-10 mb-10 w-[vw]">
      <div className="w-[50%]">
        <form className="flex flex-col gap-5">
          <InputField
            name="firstName"
            type="text"
            placeholder="First Name"
            changeFormData={changeFormData}
          />
          <InputField
            name="lastName"
            type="text"
            placeholder="Last Name"
            changeFormData={changeFormData}
          />
          <InputField
            name="email"
            type="text"
            placeholder="Email"
            changeFormData={changeFormData}
          />
          <InputField
            name="password"
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
            handleClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
