"use client";
import LoginForm from "@/app/oauth-frontend/components/LoginForm";
export default function LogOrSignInClient() {
  function handleLogin() {
    console.log("called handleLogin");
  }
  const handleSubmit = () => {
    console.log("called handleSubmit");
  };
  return (
    <div className="h-[100vh] bg-[darkblue]">
      <LoginForm handleLogin={handleLogin} handleSubmit={handleSubmit} />
    </div>
  );
}
