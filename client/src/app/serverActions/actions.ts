"use server";

import { OAuthError } from "../types/customTypes";
import connectDB from "@/database/connect-db";
import PKCECode from "@/database/models/PKCECode";
import crypto from "crypto";

export default async function getAndSaveCodeVerifierAndChallenge(): Promise<
  string | OAuthError
> {
  try {
    const codeVerifier = crypto.randomBytes(22).toString("hex");
    const codeChallenge = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest("base64url");
    await connectDB();
    const dbPKCECode = new PKCECode({
      codeVerifier,
      codeChallenge,
    });
    dbPKCECode.save();
    if (!dbPKCECode) throw new Error("database operation PKCECode failed");
    return dbPKCECode.codeChallenge;
  } catch (error) {
    console.log(
      "In catch getAndSaveCodeVerifierAndChallenge, logging error:",
      error
    );
    const oauthError: OAuthError = {
      error: "catch_error",
      error_description: `catch_error in getAndSaveCodeVerifierAndChallenge: ${error}`,
    };
    return oauthError;
  }
}
