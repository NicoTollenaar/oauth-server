import type { CurrentUser } from "./customTypes";

declare module "express-serve-static-core" {
  export interface Request {
    authorisationCode?: string;
    clientId?: string | null | undefined;
  }
}

declare module "express-session" {
  export interface SessionData {
    user: CurrentUser;
  }
}
