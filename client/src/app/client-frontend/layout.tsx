"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "../oauth-frontend/components/Button";
import { clientLoginUrl, redirect_uri } from "../constants/urls";

export default function ClientNavBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();

  const href =
    pathName === "/client-frontend/get-resources"
      ? clientLoginUrl
      : redirect_uri;
  const linkText =
    pathName === "/client-frontend/get-resources" ? "Login" : "Back";

  return (
    <section className="w-[vw] flex flex-col">
      <div className="w-[100%] flex flex-row justify-center">
        <div className="w-[25%]">
          <Link href={"http://localhost:3000/oauth-frontend/login-or-signin"}>
            <Button
              buttonText={"OAuth Server"}
              buttonColor="bg-orange-500"
              handleClick={() => {}}
            />
          </Link>
        </div>
        <div className="w-[50%] flex flex-row justify-center">
          <h1 className="mt-10 text-[1.5em] text-center font-extrabold m-5">
            CLIENT APPLICATION
          </h1>
        </div>
        <div className="w-[25%] flex flex-row justify-end mt-10 me-10">
          <Link href={href}>
            <Button
              buttonText={linkText}
              buttonColor="bg-orange-500"
              handleClick={() => {}}
            />
          </Link>
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
