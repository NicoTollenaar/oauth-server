import type { ObjectId } from "mongodb";

export type CurrentUser = {
  id: ObjectId;
};

export const scopes = ["openId", "email", "profile"];

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  hashedPassword: string;
  oauthConsents: [
    {
      clientId: String;
      scope: ["openId" | "email" | "profile"];
      date: Date;
    }
  ];
}

