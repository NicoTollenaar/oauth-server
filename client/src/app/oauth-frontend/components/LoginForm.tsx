"use client";
import useFormData from "@/app/hooks/useFormData";
import InputField from "./InputField";
import { FormData } from "@/app/types/customTypes";
export default function LoginForm() {
  const { formData, setFormData } = useFormData();
  console.log("formData", formData);

  function changeFormData(field: string, value: string): void {
    setFormData((formData: FormData): FormData => {
      return { ...formData, [`${field}`]: value };
    });
  }

  return (
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
  );
}
