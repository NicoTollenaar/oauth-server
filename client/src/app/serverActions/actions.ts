"use server";

import { OAuthError } from "../types/customTypes";
import connectDB from "@/database/connect-db";
import PKCECode from "@/database/models/PKCECode";
import crypto from "crypto";

// export async function getCodeChallenge(): Promise<string | OAuthError> {
//   try {
//     await connectDB();
//     const response: Response = await fetch(clientBackendPKCEEndpoint);
//     const codeChallenge: string | OAuthError = await response.json();
//     if (!response.ok) throw new Error("request to get codeChallenge failed");
//     return codeChallenge;
//   } catch (error) {
//     console.log("In catch getCodeChallenge, logging error:", error);
//     const oauth: OAuthError = {
//       error: "catch error",
//       error_description: `Catch error in getCodeChalleng: ${error}`,
//     };
//     return oauth;
//   }
// }

export default async function getAndSaveCodeVerifierAndChallenge(): Promise<
  string | OAuthError
> {
  try {
    const codeVerifier = crypto.randomBytes(22).toString("hex");
    const codeChallenge = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");
    console.log("codeverifier and challenge:", {
      codeVerifier,
      codeChallenge,
    });
    await connectDB();
    const dbPKCECode = new PKCECode({
      codeVerifier,
      codeChallenge,
    });
    dbPKCECode.save();
    if (!dbPKCECode) throw new Error("database operation PKCECode failed");
    console.log("dbPKCECode:", dbPKCECode);
    return dbPKCECode.codeChallenge;
  } catch (error) {
    console.log(
      "In catch getAndSaveCodeVerifierAndChallenge, logging error:",
      error
    );
    const oauthError: OAuthError = {
      error: "catch error",
      error_description: `Catch error in getAndSaveCodeVerifierAndChallenge: ${error}`,
    };
    return oauthError;
  }
}
