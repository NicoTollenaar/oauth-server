"use client";
import LoginForm from "@/app/oauth-frontend/components/LoginForm";
import Button from "../components/Button";
export default function LogOrSignInOAuthServer() {
  function handleLogin() {
    console.log("called handleLogin");
  }
  const handleSubmit = () => {
    console.log("called handleSubmit");
  };

  return (
    <div className="flex flex-row justify-center w-[vw]">
      <div className="flex flex-col gap-5 justify-center w-[100%] items-center">
        <LoginForm />
        <div className="flex flex-row justify-between w-[50%]">
          <Button
            buttonText="Login"
            buttonColor="bg-blue-500"
            handleClick={handleLogin}
          />
          <Button
            buttonText="Submit"
            buttonColor="bg-blue-500"
            handleClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
