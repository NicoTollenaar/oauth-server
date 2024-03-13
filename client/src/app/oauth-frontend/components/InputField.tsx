"use client";
import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { ReactElement } from "react";

interface InputFieldProps {
  name: string;
  type: string;
  placeholder: string;
  changeFormData: (field: string, value: string) => void;
}

export default function InputField({
  name,
  type,
  placeholder,
  changeFormData,
}: InputFieldProps): ReactElement {
  const [input, setInput] = useState<string>("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    changeFormData(name, e.target.value);
  }

  return (
    <input
      name={name}
      className="text-lg"
      type={type}
      placeholder={placeholder}
      value={input}
      onChange={(e) => {
        handleChange(e);
      }}
    />
  );
}
