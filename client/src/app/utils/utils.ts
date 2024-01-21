import {
  authorisationEndpointBackend,
  authorisationEndpointFrontend,
  redirect_uri,
  loginEndpoint,
  clientBackendGetResourcesEndpoint,
  clientBackendPKCEEndpoint,
} from "../constants/urls";
import { URLSearchParams } from "url";
import {
  LoginFormData,
  OAuthError,
  QueryObject,
  TokenInfo,
} from "../types/customTypes";
import { queryParameters } from "../constants/otherConstants";
import crypto from "crypto";
import PKCECode from "../../../../oauthServer/src/database/models/PKCECode";
import { IPKCECode } from "../../../../oauthServer/src/database/models/PKCECode";

export class Utils {
  static getQueryObject(searchParamsIterator: URLSearchParams) {
    let queryObject: Record<string, string> = {};
    for (const [key, value] of searchParamsIterator.entries()) {
      queryObject[`${key}`] = value;
    }
    return queryObject;
  }

  static async postConsentAndGetAuthorisationCode(queryObject: QueryObject) {
    try {
      const response = await fetch(authorisationEndpointBackend, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryObject),
      });
      return response;
    } catch (err) {
      console.log("In catch block utils, logging error:", err);
    }
  }

  static async postLoginRequest(loginFormData: LoginFormData) {
    const body = JSON.stringify(loginFormData);
    try {
      const response = await fetch(loginEndpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      return response;
    } catch (err) {
      console.log("In catch block postLoginRequest, logging error:", err);
    }
  }

  // still need to swap authorisation code for accestoken
  static async requestAccessTokenAndResource(
    authorisationCode: string,
    codeChallenge: string
  ): Promise<TokenInfo> {
    try {
      const response = await fetch(clientBackendGetResourcesEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ authorisationCode, codeChallenge }),
      });
      const tokenInfo: TokenInfo = await response.json();
      return tokenInfo;
    } catch (error) {
      console.log(
        "catch error in requestAccesTokenAndResource, logging error:",
        error
      );
      const oauthError: OAuthError = {
        error: "catch error",
        error_description: `Catch error in requestAccessTokenAndResource: ${error}`,
      };
      return oauthError;
    }
  }

  static isProfileQueryObject(queryObject: Record<string, string>) {
    const queryObjectKeys = Object.keys(queryObject);
    if (queryObjectKeys.length !== queryParameters.length) return false;
    for (let parameter of queryParameters) {
      if (!queryObjectKeys.includes(parameter)) return false;
    }
    return true;
  }

  static async getCodeChallenge(): Promise<string | OAuthError> {
    try {
      const response: Response = await fetch(clientBackendPKCEEndpoint);
      const codeChallenge: string | OAuthError = await response.json();
      if (!response.ok) throw new Error("request to get codeChallenge failed");
      return codeChallenge;
    } catch (error) {
      console.log("In catch getCodeChallenge, logging error:", error);
      const oauth: OAuthError = {
        error: "catch error",
        error_description: `Catch error in getCodeChalleng: ${error}`,
      };
      return oauth;
    }
  }

  static async buildAuthorisationUrl(
    scope: string
  ): Promise<string | OAuthError> {
    try {
      const state = crypto.randomUUID();
      localStorage.setItem("state", state);
      const codeChallenge: string | OAuthError = await this.getCodeChallenge();
      if (typeof codeChallenge !== "string")
        throw new Error("getCodeChallenge failed");
      localStorage.setItem(state, codeChallenge);
      const queryString: string = this.buildQueryStringAuthorize(
        state,
        scope,
        codeChallenge
      );
      const authorisationUrl = `${authorisationEndpointFrontend}?${queryString}`;
      return authorisationUrl;
    } catch (error) {
      console.log("In catch buildAuthorisationUrl, logging error:", error);
      const oauthError: OAuthError = {
        error: "catch error",
        error_description: `Catch error in buildQueryStringAuthorize: ${error}`,
      };
      return oauthError;
    }
  }

  static buildQueryStringAuthorize(
    state: string,
    scope: string,
    codeChallenge: string
  ): string {
    const queryString =
      `response_type=code&` +
      `scope=${scope}&` +
      `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&` +
      `state=${state}&` +
      `redirect_uri=${redirect_uri}&` +
      `code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;
    return queryString;
  }

  static generateCodeVerifierAndChallenge(): string | OAuthError {
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
        "In catch generateCodeVerifierAndChallenge, logging error:",
        error
      );
      const oauthError: OAuthError = {
        error: "catch error",
        error_description: `Catch error in generateCodeVerifierAndChallenge: ${error}`,
      };
      return oauthError;
    }
  }
}

// todo
// still need to swap authorisation code for accestoken
// still to implement pkce
// need to delete pkce where necessary
