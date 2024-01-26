// import { Utils } from "@/app/utils/utils";
// import { OAuthError } from "@/app/types/customTypes";

// export async function GET(req: Request): Promise<Response> {
//   try {
//     const codeChallenge: string | OAuthError =
//       Utils.getAndSaveCodeVerifierAndChallenge();
//     if (typeof codeChallenge !== "string")
//       throw new Error("getAndSaveCodeVerifierAndChallenge failed");
//     return Response.json(codeChallenge, { status: 200 });
//   } catch (error) {
//     console.log(
//       "In catch getAndSaveCodeVerifierAndChallenge, lgging error:",
//       error
//     );
//     const oauthError: OAuthError = {
//       error: "catch error",
//       error_description: `Catch error in getAndSaveCodeVerifierAndChallenge: ${error}`,
//     };
//     return Response.json(oauthError, { status: 401 });
//   }
// }
