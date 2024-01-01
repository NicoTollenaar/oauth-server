import {
  authorisationEndpoint,
  redirect_uri,
  confirmEndpoint,
  loginEndpoint,
} from "../constants/urls";
import type { URLSearchParams } from "url";
import { LoginFormData } from "../types/customTypes";

export class Utils {
  static buildQueryStringConfirm(scope: string) {
    const queryString =
      `scope=${scope}&` + `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&`;
    return queryString;
  }
  static buildQueryStringAuthorize(randomState: string) {
    const queryString =
      `response_type=code&` +
      `scope=no_scope_yet&` +
      `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&` +
      `state=${randomState}&` +
      `redirect_uri=${redirect_uri}&` +
      `code_challenge=code_challenge_not_yet_used&` +
      `&code_challenge_method=S256`;
    return queryString;
  }
  static getQueryObject(searchParamsIterator: URLSearchParams) {
    const queryObject: Record<string, string> = {};
    for (const [key, value] of searchParamsIterator.entries()) {
      queryObject[`${key}`] = value;
    }
    return queryObject;
  }
  static async postConsentDataToConfirmEndpoint(
    client_id: string,
    scope: string
  ) {
    const body = JSON.stringify({
      client_id,
      scope,
    });
    try {
      const response = await fetch(confirmEndpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      return response;
    } catch (err) {
      console.log("In utils, catch block, logging error:", err);
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
}
