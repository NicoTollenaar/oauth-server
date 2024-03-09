import { KeyObject } from "crypto";
import type { CurrentUser, JWK, MetaData } from "./customTypes";

declare module "express-serve-static-core" {
  export interface Request {
    authorisationCode?: string;
    clientId?: string | null | undefined;
    metadata?: MetaData;
    publicKeyObject?: KeyObject;
  }
}

declare module "express-session" {
  export interface SessionData {
    user: CurrentUser;
  }
}
