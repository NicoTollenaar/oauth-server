"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Utils } from "../../utils/utils";
import { redirect_uri } from "../../constants/urls";
import type { OAuthError, QueryObject } from "@/app/types/customTypes";
import Button from "./Button";
import ConsentText from "./ConsentText";

interface ConfirmProps {
  queryObject: QueryObject;
  handlerFunction: () => void;
}

export default function Confirm({
  queryObject,
  handlerFunction,
}: ConfirmProps) {
  const router = useRouter();

  function handleReject(): void {
    router.push(`${redirect_uri}?error=access_denied`);
  }

  return (
    <div className="flex flex-col items-center gap-12">
      <ConsentText queryObject={queryObject}/>
      {/* <div className="flex flex-col w-[60%] justify-start gap-2 border-white">
        <h1 className="text-lg font-semibold">
          Application with clientID:
          <h1 className="text-yellow-500">{queryObject.client_id}</h1> is asking
          to access information with the following scope:
        </h1>
        <ul className="text-xl font-bold text-yellow-500">
          {JSON.stringify(queryObject.scope)}
        </ul>
        <h1 className="text-xl font-bold">Do you consent?</h1>
      </div> */}
      <div className="flex justify-around gap-20">
        <Button
          handleClick={handlerFunction}
          buttonColor="bg-green-500"
          buttonText="Confirm"
        />
        <Button
          handleClick={handleReject}
          buttonColor="bg-red-500"
          buttonText="Reject"
        />
      </div>
    </div>
  );
}
