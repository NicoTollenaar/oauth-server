import { authorisationEndpoint, redirect_uri } from "../constants/urls";

export class Utils {
  static generateAuthorisationRequestUrl(randomString: string) {
    const querystring = 
    `response_type=code&`+
    `scope=no_scope_yet&`+
    `client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&`+
    `state=${randomString}&`+
    `redirect_uri=${redirect_uri}&`+
    `code_challenge=code_challenge_not_yet_used&`+
    `&code_challenge_method=S256`;
    const authorisationRequestUrl = `${authorisationEndpoint}?${querystring}`;
    return authorisationRequestUrl;
  }
}
