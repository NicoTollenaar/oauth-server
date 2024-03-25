"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "../oauth-frontend/components/Button";
import {
  clientLoginUrl,
  clientSignUpUrl,
  oauthLoginUrl,
  redirect_uri,
} from "../constants/urls";
import Logout from "../oauth-frontend/components/Logout";

export default function ClientNavBar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const lastPathSegment = pathName.split("/")[pathName.split("/").length - 1];
  console.log("lastPathSegment", lastPathSegment);

  let hrefFirstLink: string;
  let hrefSecondLink: string;
  let hrefThirdLink: string;
  let secondLinkText: string;
  let thirdLinkText: string;

  switch (lastPathSegment) {
    case "get-resources":
      hrefFirstLink = clientLoginUrl;
      hrefSecondLink = clientLoginUrl;
      secondLinkText = "Login";
      hrefThirdLink = clientSignUpUrl;
      thirdLinkText = "SignUp";
      break;
    case "login":
      hrefFirstLink = redirect_uri;
      hrefSecondLink = clientSignUpUrl;
      secondLinkText = "SignUp";
      hrefThirdLink = redirect_uri;
      thirdLinkText = "Back to Start";
      break;
    case "signup":
      hrefFirstLink = redirect_uri;
      hrefSecondLink = clientLoginUrl;
      secondLinkText = "Login";
      hrefThirdLink = redirect_uri;
      thirdLinkText = "Back to Start";
      break;
    default:
      hrefFirstLink = "";
      hrefSecondLink = "";
      hrefThirdLink = "";
      secondLinkText = "";
      thirdLinkText = "";
  }

  return (
    <section className="w-[vw] flex flex-col">
      <div className="w-[100%] flex flex-row justify-center bg-[darkblue]">
        <div className="w-[25%] flex flex-row justify-start mt-10 ms-10">
          {hrefFirstLink === redirect_uri ? (
            <Logout changeMessage={() => {}} server="client" />
          ) : (
            <Link href={oauthLoginUrl}>
              <Button
                buttonText={"OAuth Server"}
                buttonColor="bg-orange-500"
                handleClick={() => {}}
              />
            </Link>
          )}
        </div>
        <div className="w-[50%] flex flex-row justify-center">
          <h1 className="mt-10 text-[1.5em] text-center text-white font-extrabold m-5">
            CLIENT APPLICATION
          </h1>
        </div>
        <div className="w-[25%] flex flex-row justify-end mt-10 me-10">
          <div className="flex flex-row justify-between gap-8">
            <Link href={hrefSecondLink}>
              <Button
                buttonText={secondLinkText}
                buttonColor="bg-orange-500"
                handleClick={() => {}}
              />
            </Link>
            <Link href={hrefThirdLink}>
              <Button
                buttonText={thirdLinkText}
                buttonColor="bg-orange-500"
                handleClick={() => {}}
              />
            </Link>
          </div>
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
}
