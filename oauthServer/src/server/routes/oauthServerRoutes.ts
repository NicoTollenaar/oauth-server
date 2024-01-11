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
} from "../middleware/oauthRoutesMiddleware";
import Code from "../../database/models/Code.Model";
import { User } from "../../database/models/User.Model";
import Utils from "../../utils/utils";

const router = express.Router();

router.get("/logged-in-status", async (req: Request, res: Response) => {
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
  // const hashedPassword = await Utils.hashString(password);
  try {
    // check login credentials more thoroughly
    const dbUser = await User.findOne({ email: "piet@email.com" });
    if (!dbUser) return res.status(400).end();
    req.session.user = { id: dbUser._id };
    return res.status(200).end();
  } catch (error) {
    console.log("in catch block, /login route, logging error:", error);
  }
});

// still to authenticateClient and add appropriate authorization headers in request
router.post(
  "/oauth/token",
  isAuthenticatedClient,
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorisationCode } = req.body;
    try {
      const dbUserCode = await Code.findOne({ authorisationCode });
      if (dbUserCode) {
        const accessTokenIdentifier = crypto.randomUUID();
        const dbUpdatedUserCode = await Code.findOneAndUpdate(
          { authorisationCode },
          {
            authorisationCode: null,
            accessToken: {
              identifier: accessTokenIdentifier,
              revoked: false,
              expires: Date.now() + 2000, // expires in 60 seconds
            },
          },
          { new: true, runValidators: true }
        );
        if (dbUpdatedUserCode) {
          return res.status(200).json({ accessTokenIdentifier });
        } else {
          return res
            .status(400)
            .json({ error: "Database operation (update code) failed" });
        }
      } else {
        return res.status(400).json({ error: "Authorization code not found" });
      }
    } catch (error) {
      console.log("In catch block /oauth/token, logging error:", error);
      return res
        .status(400)
        .json({ error: "Something went wrong in post /token route" });
    }
  }
);

router.post(
  "/token_info",
  isAuthenticatedResourceServer,
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;
    try {
      const tokenInfo = await Utils.validateAccesTokenAndGetInfo(token);
      return res.status(200).json(tokenInfo);
    } catch (error) {
      console.log(
        "In catch block validate access token route, logging error:",
        error
      );
      return res.status(401).json({
        error:
          "Something went wring in catch block validate access token route",
      });
    }
  }
);

export default router;

// todo
// add other query string parameters when redturn authorization code
// check udemy whether query string redirect contains more than authorisation code and state
// check login credential more thoroughly
// add expiry time to authorisation code
// still to authenticateClient and add appropriate authorization headers in request /oauth/token
