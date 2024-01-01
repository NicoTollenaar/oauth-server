import { Express } from "express";
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

// declare global {
//   namespace Express {
//     export interface Request {
//       authorisationCode?: string;
//     }
//   }
// }
