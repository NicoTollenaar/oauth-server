import {
  authorisationEndpointBackend,
  authorisationEndpointFrontend,
  redirect_uri,
  loginEndpoint,
  clientBackendGetResourcesEndpoint,
} from "../constants/urls";
import type { URLSearchParams } from "url";
import { LoginFormData, QueryObject } from "../types/customTypes";
import { queryParameters } from "../constants/otherConstants";

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
  static async requestAccessTokenAndResource(code: string) {
    const response = await fetch(clientBackendGetResourcesEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: code,
    });
    const { retrievedResource } = await response.json();
    return retrievedResource;
  }

  static isProfileQueryObject(queryObject: Record<string, string>) {
    const queryObjectKeys = Object.keys(queryObject);
    if (queryObjectKeys.length !== queryParameters.length) return false;
    for (let parameter of queryParameters) {
      if (!queryObjectKeys.includes(parameter)) return false;
    }
    return true;
  }

  static buildAuthorisationUrl(scope: string) {
    const randomString = crypto.randomUUID();
    localStorage.setItem("state", randomString);
    const queryString = this.buildQueryStringAuthorize(randomString, scope);
    const authorisationUrl = `${authorisationEndpointFrontend}?${queryString}`;
    return authorisationUrl;
  }

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
}

// todo
// still need to swap authorisation code for accestoken
