"use client";
import { useState } from "react";
import LoginForm from "@/app/oauth-frontend/components/LoginForm";
import { Utils } from "@/app/utils/utils";
import { useRouter } from "next/router";
import { redirect_uri } from "@/app/constants/urls";
import useFormData from "@/app/hooks/useFormData";
import { FormData } from "@/app/types/customTypes";

export default function LogOrSignInOAuthServer() {
  return <LoginForm server="oauth" />;
}
