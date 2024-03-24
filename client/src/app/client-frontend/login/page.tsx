"use client";
import LoginOrSignUpForm from "@/app/oauth-frontend/components/LoginOrSignUpForm";
export default function LoginClient() {
  function handleLogin() {
    console.log("called handleLogin");
  }
  const handleSubmit = () => {
    console.log("called handleSubmit");
  };
  return (
    <div className="h-[100vh] bg-[darkblue]">
      <LoginOrSignUpForm server="client" />
    </div>
  );
}
