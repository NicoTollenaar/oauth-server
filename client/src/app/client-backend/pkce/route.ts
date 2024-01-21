import { Utils } from "@/app/utils/utils";
import PKCECode from "../../../../../oauthServer/src/database/models/PKCECode";
import { OAuthError } from "@/app/types/customTypes";
export async function GET(req: Request): Promise<Response> {
  try {
    const codeChallenge: string | OAuthError =
      Utils.generateCodeVerifierAndChallenge();
    if (typeof codeChallenge !== "string")
      throw new Error("generateCodeVerifierAndChallenge failed");
    return Response.json(codeChallenge, { status: 200 });
  } catch (error) {
    console.log(
      "In catch generateCodeVerifierAndChallenge, lgging error:",
      error
    );
    const oauthError: OAuthError = {
      error: "catch error",
      error_description: `Catch error in generateCodeVerifierAndChallenge: ${error}`,
    };
    return Response.json(oauthError, { status: 401 });
  }
}
