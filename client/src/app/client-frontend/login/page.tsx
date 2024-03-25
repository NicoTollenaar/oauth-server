"use client";
import { clientSignUpUrl } from "@/app/constants/urls";
import LoginOrSignUpForm from "@/app/oauth-frontend/components/LoginOrSignUpForm";
import LoginForm from "@/app/oauth-frontend/components/LoginOrSignUpForm";
import Link from "next/link";
export default function SignUpClient() {
  function handleLogin() {
    console.log("called handleLogin");
  }
  const handleSubmit = () => {
    console.log("called handleSubmit");
  };
  return (
    <div className="pt-[10%] h-[100vh] bg-[darkblue]">
      <LoginOrSignUpForm server="client" />
      <h1 className="ms-[25%] me-[25%] text-white">
        Don't have an account yet?{"  "}
        <Link href={clientSignUpUrl} className="hover:underline font-bold">
          SignUp
        </Link>
      </h1>
    </div>
  );
}
