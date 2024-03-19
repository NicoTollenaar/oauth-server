"use client";
import Button from "@/app/oauth-frontend/components/Button";
import LoginForm from "@/app/oauth-frontend/components/LoginForm";
export default function LogOrSignInClient() {
  function handleLogin() {
    console.log("called handleLogin");
  }
  const handleSubmit = () => {
    console.log("called handleSubmit");
  };
  return <LoginForm handleLogin={handleLogin} handleSubmit={handleSubmit} />;
}
