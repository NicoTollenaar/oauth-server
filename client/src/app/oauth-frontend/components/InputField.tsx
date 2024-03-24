"use client";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { ReactElement } from "react";

interface InputFieldProps {
  name: string;
  value: string;
  type: string;
  placeholder: string;
  changeFormData: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
  name,
  type,
  placeholder,
  changeFormData,
  value,
}: InputFieldProps): ReactElement {
  // const [input, setInput] = useState<string>("");

  // function handleChange(e: ChangeEvent<HTMLInputElement>) {
  //   setInput(e.target.value);
  //   changeFormData(name, e.target.value);
  // }

  return (
    <input
      className="text-lg border-2 rounded-md text-black p-2"
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={changeFormData}
    />
  );
}
