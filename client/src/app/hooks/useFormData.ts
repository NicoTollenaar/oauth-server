"use client";
import { useState } from "react";
import { SetStateAction, Dispatch } from "react";
import { FormData } from "../types/customTypes";
export default function useFormData(): {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
} {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  return { formData, setFormData };
}
