import {
  AccessTokenValidationError,
  ActiveTokenInfo,
  IInActiveTokenInfo,
} from "../types/customTypes";

export default class TypePredicament {
  static isActiveTokenInfo(
    object: ActiveTokenInfo | IInActiveTokenInfo | AccessTokenValidationError
  ): object is ActiveTokenInfo {
    return "clientId" in object;
  }
}
