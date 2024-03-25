"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "./components/Button";
import {
  oauthLoginUrl,
  oauthSignUpUrl,
  redirect_uri,
} from "@/app/constants/urls";
import Logout from "./components/Logout";

export default function OAuthNavBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const lastPathSegment = pathName.split("/")[pathName.split("/").length - 1];
  console.log("lastPathSegment", lastPathSegment);

  let hrefFirstLink: string;
  let firstLinkText: string;

  switch (lastPathSegment) {
    case "login":
      hrefFirstLink = oauthSignUpUrl;
      firstLinkText = "SignUp";
      break;
    case "signup":
      hrefFirstLink = oauthLoginUrl;
      firstLinkText = "Login";
      break;
    default:
      hrefFirstLink = "";
      firstLinkText = "";
  }

  return (
    <section className="w-[vw] flex flex-col">
      <div className="w-[100%] flex flex-row justify-center">
        <div className="w-[25%] mt-10 ms-10">
          <Logout changeMessage={() => {}} server="oauth" />
        </div>
        <div className="w-[50%] flex flex-row justify-center">
          <h1 className="mt-10 text-[1.5em] text-center font-extrabold m-5">
            OAUTH SERVER
          </h1>
        </div>
        <div className="w-[25%] flex flex-row justify-end mt-10 me-10">
          <div className="flex flex-row justify-between gap-8">
            <Link href={hrefFirstLink}>
              <Button
                buttonText={firstLinkText}
                buttonColor="bg-orange-500"
                handleClick={() => {}}
              />
            </Link>
            {/* <Link href={hrefSecondLink}>
              <Button
                buttonText={secondLinkText}
                buttonColor="bg-orange-500"
                handleClick={() => {}}
              />
            </Link> */}
            <Link href={redirect_uri}>
              <Button
                buttonText={"Client App"}
                buttonColor="bg-orange-500"
                handleClick={() => {}}
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="children-div">{children}</div>
    </section>
  );
}
