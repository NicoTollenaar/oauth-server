"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { FormData } from "../types/customTypes";

export default function useFormData<FormData>(initialFormData: FormData): {
  formData: FormData;
  changeFormData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormData: Dispatch<SetStateAction<FormData>>;
} {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  function changeFormData(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((formData) => {
      const newFormData = { ...formData, [e.target.name]: e.target.value };
      return newFormData;
    });
  }

  return { formData, setFormData, changeFormData };
}
