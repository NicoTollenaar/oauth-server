"use client";
import LoginOrSignUpForm from "@/app/oauth-frontend/components/LoginOrSignUpForm";
export default function LoginClient() {

  return (
    <div className="pt-[5%] h-[100vh] bg-[darkblue]">
      <div>
        <LoginOrSignUpForm server="client" />
      </div>
      
    </div>
  );
}
