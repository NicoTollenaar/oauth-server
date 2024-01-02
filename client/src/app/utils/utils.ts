import {
  authorisationEndpointBackend,
  redirect_uri,
  resourcesEndpoint,
  loginEndpoint,
} from "../constants/urls";
import type { URLSearchParams } from "url";
import { LoginFormData, QueryObject } from "../types/customTypes";
import { queryParameters } from "../constants/otherConstants";

export class Utils {
  static buildQueryStringAuthorize(randomState: string, scope: string) {
    const queryString =
      `response_type=code&` +
      `scope=${scope}&` +
      `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&` +
      `state=${randomState}&` +
      `redirect_uri=${redirect_uri}&` +
      `code_challenge=code_challenge_not_yet_used&` +
      `&code_challenge_method=S256`;
    return queryString;
  }
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
      console.log("In catch block, logging error:", err);
    }
  }

  // still need to swap authorisation code for accestoken
  static async requestAccessTokenAndResource(code: string) {
    const response = await fetch(resourcesEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: code,
    });
    return response;
  }

  static isProfileQueryObject(queryObject: Record<string, string>) {
    const queryObjectKeys = Object.keys(queryObject);
    if (queryObjectKeys.length !== queryParameters.length) return false;
    for (let parameter of queryParameters) {
      if (!queryObjectKeys.includes(parameter)) return false;
    }
    return true;
  }
}

// todo
// still need to swap authorisation code for accestoken
