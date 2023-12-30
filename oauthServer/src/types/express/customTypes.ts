import type { ObjectId } from "mongodb";

export type CurrentUser = {
  id: ObjectId;
};

export enum Scope {
  OpenID,
  Profile,
  Email,
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword: string;
  oauthConsents: [
    {
      clientId: String;
      scope: ["openId" | "profile" | "email" | ""];
      date: Date;
    }
  ];
}

// export interface QueryObject {
//   // [key: string]: string;
//   response_type: string;
//   scope: string;
//   client_id: string;
//   state: string;
//   redirect_uri: string;
//   code_challenge: string;
//   code_challenge_method: string;
// }
