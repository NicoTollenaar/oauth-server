import crypto from "crypto";
import { introspectionEndpoint } from "../constants/urls";

export default class Utils {
  static async hashString(stringToHash: string, existingSalt?: Buffer) {
    const salt = existingSalt ? existingSalt : crypto.randomBytes(16);
    console.log(
      "In hashstring, logging existingSalt and salt:",
      existingSalt,
      salt
    );
    const hash = crypto.scryptSync(stringToHash, salt, 64).toString("hex");
    return { hash, salt };
  }

  // see RFC 7662, OAuth 2.0 Token Introspection
  static async introspectionRequest(
    accessToken: string,
    clientId: string,
    clientSecret: string
  ) {
    try {
      const response = await fetch(introspectionEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(`token=${accessToken}`),
      });
      if (response.ok) {
        const { userId, requestedScope } = await response.json();
        return { userId, requestedScope };
      } else {
        return null;
      }
    } catch (error) {
      console.log("In catch block introspectionRequest, logging error:", error);
      return null;
    }
  }

  static extractCredentialsFromBasicAuthHeader(
    authorizationHeader: string | undefined
  ) {
    if (authorizationHeader === undefined)
      return { clientId: null, clientSecret: null };
    const encodedCredentials = authorizationHeader.split(" ")[1];
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      "base64"
    ).toString();
    const [clientId, clientSecret] = decodedCredentials.split(":");
    return { clientId, clientSecret };
  }
}
