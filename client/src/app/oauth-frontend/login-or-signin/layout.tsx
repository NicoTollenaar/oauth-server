"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "../components/Button";
import { redirect_uri } from "@/app/constants/urls";
import Logout from "../components/Logout";

export default function OAuthNavBar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="w-[vw] flex flex-col">
      <div className="w-[100%] flex flex-row justify-center">
        <div className="w-[25%]">
          <div className="mt-10 ms-10">
            <Logout changeMessage={() => {}} />
          </div>
        </div>
        <div className="w-[50%] flex flex-row justify-center">
          <h1 className="mt-10 text-[1.5em] text-center font-extrabold m-5">
            OAUTH SERVER
          </h1>
        </div>
        <div className="w-[25%] flex flex-row justify-end mt-10 me-10">
          <Link href={redirect_uri}>
            <Button
              buttonText={"Client App"}
              buttonColor="bg-orange-500"
              handleClick={() => {}}
            />
          </Link>
        </div>
      </div>
      <div className="children-div">{children}</div>
    </section>
  );
}
