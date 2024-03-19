"use client";
import LoginForm from "@/app/oauth-frontend/components/LoginForm";
export default function LogOrSignInOAuthServer() {
  function handleLogin() {
    console.log("called handleLogin");
  }
  const handleSubmit = () => {
    console.log("called handleSubmit");
  };

  return <LoginForm handleLogin={handleLogin} handleSubmit={handleSubmit} />;
}
