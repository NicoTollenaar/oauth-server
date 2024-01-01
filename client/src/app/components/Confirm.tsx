import { useRouter } from "next/navigation";
import { Utils } from "../utils/utils";
import { redirect_uri } from "../constants/urls";

interface ConfirmProps {
  client_id: string;
  scope: string;
}

export default function Confirm({ client_id, scope }: ConfirmProps) {
  const router = useRouter();

  async function handleConfirm() {
    try {
      const responseConfirm = await Utils.postConsentDataToConfirmEndpoint(
        client_id,
        scope
      );
      if (!responseConfirm?.ok) {
        router.push(`${redirect_uri}?error=true`);
      }
      const responseSaveAuthorisationCode = await Utils.postAuthorisationCode()

      //   if (response?.ok) {
      //     router.push(`${redirect_uri}?confirmed=true`);
      //   } else {
      //     router.push(`${redirect_uri}?error=true`);
      //   }
    } catch (error) {
      console.log("in catch block handleConfirm, logging error:", error);
      router.push(`${redirect_uri}?error=true`);
    }
  }
  return (
    <div>
      <h1>
        Application with clientID {client_id} is asking to access information
        with the following scope:
      </h1>
      <br />
      <ul>{JSON.stringify(scope)}</ul>
      <br />
      <h1>Do you consent?</h1>
      <br />
      <button onClick={handleConfirm}>Confirm</button>
      <br />
    </div>
  );
}
