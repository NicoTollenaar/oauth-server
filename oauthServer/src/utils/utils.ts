import crypto from "crypto";
import { introspectionEndpoint } from "../constants/urls";
import Code from "../database/models/Code.Model";
import { User } from "../database/models/User.Model";

export default class Utils {
  static async hashString(stringToHash: string, existingSalt?: Buffer) {
    const salt = existingSalt ? existingSalt : crypto.randomBytes(16);
    const hash = crypto.scryptSync(stringToHash, salt, 64).toString("hex");
    return { hash, salt };
  }

  // see RFC 7662, OAuth 2.0 Token Introspection
  static async introspectionRequest(
    token: string,
    resourceServerId: string,
    resourceServerSecret: string
  ) {
    try {
      const response = await fetch(introspectionEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${resourceServerId}:${resourceServerSecret}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(`token=${token}`),
      });
      if (response.ok) {
        const tokenInfo = await response.json();
        return tokenInfo;
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
    if (authorizationHeader === undefined) return { id: null, secret: null };
    const encodedCredentials = authorizationHeader.split(" ")[1];
    const decodedCredentials = Buffer.from(
      encodedCredentials,
      "base64"
    ).toString();
    const [id, secret] = decodedCredentials.split(":");
    return { id, secret };
  }

  static async validateAccesTokenAndGetInfo(token: string) {
    try {
      const dbCode = await Code.findOne({ "accessToken.identifier": token });
      if (
        !dbCode ||
        dbCode?.accessToken.revoked ||
        dbCode?.accessToken.expires <= Date.now()
      )
        return { active: false };
      const dbUser = await User.findOne(dbCode.userId);
      if (!dbUser) throw new Error("user not found");
      return {
        active: true,
        scope: dbCode.requestedScope,
        clientId: dbCode.recipientClientId,
        username: dbUser.email,
      };
    } catch (error) {
      console.log(
        "In catch block validateAccesTokenAndGetInfo, logging error:",
        error
      );
    }
  }
}
