

import {
  OAuthError,
  ActiveTokenInfo,
  IInActiveTokenInfo,
} from "../types/customTypes";

export default class TypePredicament {
  static isActiveTokenInfo(
    object: ActiveTokenInfo | IInActiveTokenInfo | OAuthError
  ): object is ActiveTokenInfo {
    return "clientId" in object;
  }
  static isAccesTokenValidationError(
    object: Response | ActiveTokenInfo | IInActiveTokenInfo | OAuthError
  ): object is OAuthError {
    return "error_description" in object;
  }
  
  static isOAuthError(
    object: ActiveTokenInfo | IInActiveTokenInfo | OAuthError
  ): object is OAuthError {
    return "error" in object;
  }
}
