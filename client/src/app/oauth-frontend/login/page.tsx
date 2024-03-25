"use client";
import { useState } from "react";
import LoginForm from "@/app/oauth-frontend/components/LoginOrSignUpForm";
import { Utils } from "@/app/utils/utils";
import { useRouter } from "next/router";
import { oauthSignUpUrl, redirect_uri } from "@/app/constants/urls";
import useFormData from "@/app/hooks/useFormData";
import { FormData } from "@/app/types/customTypes";
import LoginOrSignUpForm from "@/app/oauth-frontend/components/LoginOrSignUpForm";
import Link from "next/link";

export default function LogInAuthServer() {
  return (
    <div className="bg-[black] text-white h-[100vh]">
      <LoginOrSignUpForm server="oauth" />;
      <h1 className="ms-[25%] me-[25%] text-white">
        Don't have an account yet?{"  "}
        <Link
          href={oauthSignUpUrl}
          className="text-white hover:underline font-bold"
        >
          SignUp
        </Link>
      </h1>
    </div>
  );
}
