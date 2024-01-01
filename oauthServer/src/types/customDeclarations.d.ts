import type { CurrentUser } from "./customTypes";

declare module "express-serve-static-core" {
  export interface Request {
    authorisationCode?: string;
  }
}

declare module "express-session" {
  export interface SessionData {
    user: CurrentUser;
  }
}
