import { authorisationEndpoint, redirect_uri } from "../constants/urls";
import type { URLSearchParams } from "url";

export class Utils {
  static buildQueryString(randomState: string) {
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
}
