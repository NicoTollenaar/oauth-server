import crypto from "crypto";
import { introspectionEndpoint } from "../constants/urls";
import Code, { ICode } from "../database/models/Code.Model";
import { User } from "../database/models/User.Model";
import {
  ActiveTokenInfo,
  InActiveTokenInfo,
  AccessTokenValidationError,
  IUser,
  IInActiveTokenInfo,
} from "../types/customTypes";

export interface CatchError {
  ok: boolean;
  error: string;
  error_description: string;
}

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
      return response;
    } catch (error) {
      console.log("In catch block introspectionRequest, logging error:", error);
      return {
        ok: false,
        error: "catch block error",
        error_description: "Error in catch block introspectionRequest",
      };
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

  static async validateAccesTokenAndGetInfo(token: string): Promise<ActiveTokenInfo | IInActiveTokenInfo | AccessTokenValidationError | > {
    try {
      const dbCode: ICode | null = await Code.findOne({
        "accessToken.identifier": token,
      });
      if (
        !dbCode ||
        dbCode?.accessToken.revoked ||
        dbCode?.accessToken.expires <= Date.now()
      )
        return InActiveTokenInfo;
      const dbUser: IUser | null = await User.findOne(dbCode.userId);
      if (dbUser) {
        return <ActiveTokenInfo>{
          active: true,
          scope: dbCode.requestedScope,
          clientId: dbCode.recipientClientId,
          username: dbUser.email,
        };
      } else {
        return <AccessTokenValidationError>{
          error: "user not found",
          error_description: "user not found when validating acces token",
        };
      }
    } catch (error) {
      console.log(
        "In catch block validateAccesTokenAndGetInfo, logging error:",
        error
      );
      return <AccessTokenValidationError>{
        error: "catch error",
        error_description: "error in catch block validateAccessTokenandGetInfo",
      };
    }
  }
}
