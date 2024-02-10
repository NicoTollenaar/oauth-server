import type { ObjectId } from "mongodb";

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

export interface ActiveTokenInfo {
  active: boolean;
  scope: string[];
  clientId: string;
  username: string;
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
