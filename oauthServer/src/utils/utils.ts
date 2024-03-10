import crypto from "crypto";
import { introspectionEndpoint } from "../constants/urls";
import Code, { ICode } from "../database/models/Code.Model";
import { User } from "../database/models/User.Model";
import {
  InActiveTokenInfo,
  OAuthError,
  IUser,
  TokenInfo,
} from "../types/customTypes";

export default class Utils {
  static async hashStringWithSalt(stringToHash: string, existingSalt?: Buffer) {
    const salt = existingSalt ? existingSalt : crypto.randomBytes(16);
    const hash = crypto.scryptSync(stringToHash, salt, 64).toString("hex");
    return { hash, salt };
  }

  // see RFC 7662, OAuth 2.0 Token Introspection
  static async introspectionRequest(
    token: string,
    resourceServerId: string,
    resourceServerSecret: string
  ): Promise<Response | OAuthError> {
    try {
      const response: Response = await fetch(introspectionEndpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${resourceServerId}:${resourceServerSecret}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(`token=${token}`),
      });
      if (!response.ok) {
        const oauthError: OAuthError = {
          error: "introspection error",
          error_description: `Request to introspection endpoint failed`,
        };
        return oauthError;
      }
      return response;
    } catch (error) {
      console.log("In catch block introspectionRequest, logging error:", error);
      const oauthError: OAuthError = {
        error: "catch block error",
        error_description: `Error in catch block introspectionRequest: ${error}`,
      };
      return oauthError;
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

  static async validateAccesTokenAndGetInfo(token: string): Promise<TokenInfo> {
    try {
      const dbCode: ICode | null = await Code.findOne({
        "accessToken.identifier": token,
      });
      const hasAccessTokenExpired = dbCode?.accessToken?.expires
        ? dbCode?.accessToken?.expires <= Date.now()
        : true;
      if (!dbCode || dbCode?.accessToken?.revoked || hasAccessTokenExpired)
        return InActiveTokenInfo;
      const dbUser: IUser | null = await User.findOne(dbCode.userId);
      if (dbUser) {
        return {
          active: true,
          scope: dbCode.requestedScope,
          clientId: dbCode.recipientClientId,
          username: dbUser.email,
        };
      } else {
        // according to Oauth specs, the response should actually be inactive token.
        // Error only when resource server authentication fails.
        return {
          error: "user not found",
          error_description: "user not found when validating acces token",
        };
      }
    } catch (error) {
      console.log(
        "In catch block validateAccesTokenAndGetInfo, logging error:",
        error
      );
      return {
        error: "catch_error",
        error_description: "error in catch block validateAccessTokenandGetInfo",
      };
    }
  }

  static createOauthError(
    error: string,
    error_description: string
  ): OAuthError {
    return {
      error,
      error_description,
    };
  }
}
