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

export interface AccessTokenValidationError {
  error: string;
  error_description: string;
}
