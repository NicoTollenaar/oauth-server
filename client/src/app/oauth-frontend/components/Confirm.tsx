import { useRouter } from "next/navigation";
import { Utils } from "../../utils/utils";
import { redirect_uri } from "../../constants/urls";
import type { QueryObject } from "@/app/types/customTypes";

interface ConfirmProps {
  queryObject: QueryObject;
}

export default function Confirm({ queryObject }: ConfirmProps) {
  const router = useRouter();
  async function handleConfirm() {
    try {
      const response = await Utils.postConsentAndGetAuthorisationCode(
        queryObject
      );
      const responseObject = await response?.json();
      if (response?.ok) {
        router.push(
          `${redirect_uri}?code=${responseObject.authorisationCode}&state=${queryObject.state}`
        );
      } else {
        router.push(`${redirect_uri}?error=${responseObject.error}`);
      }
    } catch (error) {
      console.log("in catch block handleConfirm, logging error:", error);
      router.push(`${redirect_uri}?error=${error}`);
    }
  }
  return (
    <div>
      <h1>
        Application with clientID {queryObject.client_id} is asking to access
        information with the following scope:
      </h1>
      <br />
      <ul>{JSON.stringify(queryObject.scope)}</ul>
      <br />
      <h1>Do you consent?</h1>
      <br />
      <button onClick={handleConfirm}>Confirm</button>
      <br />
    </div>
  );
}
