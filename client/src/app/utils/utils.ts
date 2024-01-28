import {
  authorisationEndpointBackend,
  authorisationEndpointFrontend,
  redirect_uri,
  loginEndpoint,
  clientBackendGetResourcesEndpoint,
} from "../constants/urls";
import {
  LoginFormData,
  OAuthError,
  QueryObject,
  TokenInfo,
} from "../types/customTypes";
import { queryParameters } from "../constants/otherConstants";
import crypto from "crypto";
import getAndSaveCodeVerifierAndChallenge from "../serverActions/actions";

export class Utils {
  static getQueryObject(searchParamsIterator: URLSearchParams) {
    let queryObject: Record<string, string> = {};
    for (const [key, value] of searchParamsIterator.entries()) {
      queryObject[`${key}`] = value;
    }
    return queryObject;
  }

  static async postConsentAndGetAuthorisationCode(
    queryObject: QueryObject
  ): Promise<string | OAuthError> {
    try {
      const response: Response = await fetch(authorisationEndpointBackend, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryObject),
      });
      const responseBody = await response.json();
      return response.ok ? responseBody.authorisationCode : responseBody;
    } catch (error) {
      console.log("In catch block utils, logging error:", error);
      return this.createOauthError(
        "catch_error",
        `catch_error in postConsentAndGetAuthorisationCode: ${error}`
      );
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
        "catch_error in requestAccesTokenAndResource, logging error:",
        error
      );
      const oauthError: OAuthError = {
        error: "catch_error",
        error_description: `catch_error in requestAccessTokenAndResource: ${error}`,
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

  static async buildAuthorisationUrl(
    scope: string
  ): Promise<string | OAuthError> {
    try {
      const state = window.crypto.randomUUID();
      localStorage.setItem("state", state);
      const codeChallenge: string | OAuthError =
        await getAndSaveCodeVerifierAndChallenge();
      if (typeof codeChallenge !== "string")
        throw new Error("getAndSaveCodeVerifierAndChallenge failed");
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
        error: "catch_error",
        error_description: `catch_error in buildQueryStringAuthorize: ${error}`,
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
