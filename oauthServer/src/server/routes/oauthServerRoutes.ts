import express, { Request, Response, NextFunction } from "express";
import {
  isLoggedIn,
  isLoggedOut,
  isValidRequest,
  saveConsent,
  generateAndSaveCodes,
  returnAuthorisationCode,
  isAuthenticatedResourceServer,
  isAuthenticatedClient,
  validateRequestParameters,
} from "../middleware/oauthRoutesMiddleware";
import Code from "../../database/models/Code.Model";
import { User } from "../../database/models/User.Model";
import Utils from "../../utils/utils";
import {
  AccessTokenResponse,
  OAuthError,
  TokenInfo,
} from "../../types/customTypes";

const router = express.Router();

// ---------     ONLY FOR RUNNING TESTRESPONSE.TS SCRIPT ------------
// router.get("/test", isValidated, async (req: Request, res: Response) => {
// return res.status(200).json({ message: "SUCCESFUL DESPITE ERROR CODE!" });
// return res.status(401).json({ message: "status code 401" });
// return res.status(500).json({ message: "status code 500" });
// });

// async function isValidated(req: Request, res: Response, next: NextFunction) {
//   if (req.headers.authorization === "its me!") {
//     next();
//   } else {
//     return res.status(401).json({ message: "unauthorized" });
//   }
// }
// ---------------------------------------------------------------------------

router.get("/logged-in-status", (req: Request, res: Response) => {
  console.log("In logged-in-status, logging req.sessionId:", req.sessionID);
  console.log("In logged-in-status, logging req.session:", req.session);
  console.log(
    "In logged-in-status, logging req.session.user:",
    req.session.user
  );
  if (req.session.user) {
    return res.json({ isLoggedIn: true });
  } else {
    return res.json({ isLoggedIn: false });
  }
});

router.post(
  "/authorize",
  isLoggedIn,
  isValidRequest,
  saveConsent,
  generateAndSaveCodes,
  returnAuthorisationCode
);

router.post("/login", isLoggedOut, async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  // const hashedPassword = await Utils.hashStringWithSalt(password);
  try {
    // check login credentials more thoroughly
    const dbUser = await User.findOne({ email: "piet@email.com" });
    if (!dbUser) return res.status(400).end();
    req.session.user = { id: dbUser._id };
    return res.status(200).end();
  } catch (error) {
    console.log("in catch block, /login route, logging error:", error);
    const oauthError: OAuthError = {
      error: "catch_error",
      error_description: `catch_error in isLoggedOut: ${error}`,
    };
    return res.status(401).json(oauthError);
  }
});

// see oauth.com:
// If an authorization code is used more than once, the authorization server must deny the subsequent requests. This is easy to accomplish if the authorization codes are stored in a database, since they can simply be marked as used. If a code is used more than once, it should be treated as an attack. If possible, the service should revoke the previous access tokens that were issued from this authorization code.
// This has not been implemented

router.post(
  "/oauth/token",
  isAuthenticatedClient,
  validateRequestParameters,
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { code } = req.body;
    if (!code) {
      const oauthError: OAuthError = {
        error: "no authorization code",
        error_description:
          "token endpoint rejected request do to lacking authorisation code",
      };
      return res.status(401).json(oauthError);
    }
    try {
      const dbUserCode = await Code.findOne({
        "authorisationCode.identifier": code,
      });
      if (!dbUserCode) {
        const oauthError: OAuthError = {
          error: "authorization code not found",
          error_description:
            "token endpoint rejected request due to invalid or non-existent authorization code",
        };
        return res.status(401).json(oauthError);
      }
      const accessTokenIdentifier = crypto.randomUUID();
      const dbUpdatedUserCode = await Code.findOneAndUpdate(
        { "authorisationCode.identifier": code },
        {
          authorisationCode: null,
          accessToken: {
            identifier: accessTokenIdentifier,
            revoked: false,
            expires: Date.now() + 2000, // expires in 2 seconds
          },
        },
        { new: true }
      );
      if (dbUpdatedUserCode?.validateSync())
        throw new Error("Mongoose validation error");
      if (!dbUpdatedUserCode) {
        const oauthError: OAuthError = {
          error: "failed database operation",
          error_description:
            "updating database (exchanging authorization code for accesstoken) failed in token endpoint",
        };
        return res.status(401).json(oauthError);
      }
      const accessTokenResponse: AccessTokenResponse = {
        access_token: dbUpdatedUserCode.accessToken?.identifier as string,
        token_type: "Bearer",
        expires_in:
          dbUpdatedUserCode.accessToken?.expires === undefined
            ? 0
            : dbUpdatedUserCode.accessToken?.expires - Date.now(),
        scope: dbUpdatedUserCode.requestedScope,
      };
      res.set("Cache-Control", "no-store");
      return res.status(200).json(accessTokenResponse);
    } catch (error) {
      console.log("In catch block /oauth/token, logging error:", error);
      const oauthError: OAuthError = {
        error: "catch_error",
        error_description: `catch_error in token endpoint: ${error}`,
      };
      return res.status(401).json(oauthError);
    }
  }
);

router.post(
  "/token_info",
  isAuthenticatedResourceServer,
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const token: string = req.body.token;
    try {
      let tokenInfo: TokenInfo = await Utils.validateAccesTokenAndGetInfo(
        token
      );
      const status = "error" in tokenInfo ? 401 : 200;
      return res.status(status).json(tokenInfo);
    } catch (error) {
      console.log(
        "In catch block validate access token route, logging error:",
        error
      );
      return res.status(401).json({
        error: "catch block error",
        error_description: "Error in catch block in route /token_info",
      });
    }
  }
);

router.delete("/logout", (req: Request, res: Response, next: NextFunction) => {
  console.log("In /logout, logging req.sessionId:", req.sessionID);
  console.log("In /logout, logging req.session BEFORE destroy:", req.session);
  console.log(
    "In /logout, logging req.session.user destroy:",
    req.session.user
  );
  if (req.session.user) {
    req.session.destroy((err): Response => {
      console.log("in /logout destroy callback, logging err:", err);
      if (err) {
        console.log("Error in dstroy session callback, logging error:", err);
        return res.status(400).send(`Unable to logout: ${err}`);
      } else {
        console.log(
          "In /logout, logging req.session AFTER destroy:",
          req.session
        );
        res.clearCookie("connect.sid");
        return res
          .status(200)
          .send("Logout successful (message from server /logout");
      }
    });
  } else {
    return res.status(200).send("User was already logged out");
  }
});

export default router;

// todo
// add other query string parameters when redturn authorization code
// check udemy whether query string redirect contains more than authorisation code and state
// check login credential more thoroughly
// add expiry time to authorisation code
// still to authenticateClient and add appropriate authorization headers in request /oauth/token
