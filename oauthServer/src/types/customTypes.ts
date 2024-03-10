import { X509Certificate } from "crypto";
import type { ObjectId } from "mongodb";
import { JsonWebKey } from "crypto";

export type CurrentUser = {
  id: ObjectId;
};

export const scopes = ["openId", "email", "profile"];

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword: {
    hash: string;
    salt: Buffer;
  };
  oauthConsents: [
    {
      clientId: String;
      consentedScope: ["openId" | "email" | "profile"];
    }
  ];
}

// see RFC 7662, par. 2.2
export interface ActiveTokenInfo {
  active: boolean;
  scope?: string[];
  clientId?: string;
  username?: string;
  token_type?: string;
  exp?: number;
  iat?: number;
  nbf?: number;
  sub?: string;
  aud?: string;
  iss?: string;
  jti?: string;
}
export interface IInActiveTokenInfo {
  active: false;
}

export const InActiveTokenInfo: IInActiveTokenInfo = {
  active: false,
};

export interface OAuthError {
  error: string;
  error_description: string;
}

export type TokenInfo = ActiveTokenInfo | IInActiveTokenInfo | OAuthError;

export interface IAccessTokenIdentifier {
  accessTokenIdentifier: string;
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  refresh_token?: string | "" | null | undefined;
  scope?: string[] | "" | null | undefined;
}
export interface QueryObject {
  response_type: string;
  scope: string;
  client_id: string;
  state: string;
  redirect_uri: string;
  code_challenge: string;
  code_challenge_method: string;
}

export type SupportedScopes =
  | "openid"
  | "profile"
  | "email"
  | "address"
  | "phone"
  | "offline_access";

export interface MetaData {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  token_endpoint_auth_signing_alg_values_supported: ["RS256", "ES256"];
  introspection_endpoint: string;
  revocation_endpoint: string;
  registration_endpoint: string;
  jwks_uri: string;
  grant_types_supported: ["authorization_code", "implicit"];
  response_types_supported: ["code", "code token"];
  scopes_supported: SupportedScopes[];
  code_challenge_methods_supported: ["S256"];
}

export interface JWK extends JsonWebKey {
  kid?: string;
  x5u?: string;
  x5c?: X509Certificate[];
  x5t?: string;
  "x5t#S256"?: string;
}
