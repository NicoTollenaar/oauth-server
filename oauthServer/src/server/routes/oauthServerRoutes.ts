import express, { Request, Response, NextFunction } from "express";
import {
  isLoggedIn,
  isLoggedOut,
  isValidRequest,
  saveConsent,
  generateAndSaveCodes,
  returnAuthorisationCode,
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
  const hashedPassword = await Utils.hashPassword(password);
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

router.post(
  "/oauth/token",
  isLoggedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorisationCode } = req.body;
    try {
      const dbUserCodes = await Code.findOne({ userId: req.session.user?.id });
      if (dbUserCodes?.authorisationCode === authorisationCode) {
        const accessToken = "access_token";
        const dbUpdatedCUserCodes = await Code.findOneAndUpdate(
          { userId: req.session.user?.id },
          { authorisationCode: null, accessToken }
        );
        return res.status(200).send(accessToken);
      } else {
        return res.status(401).send("Incorrect authorisation code");
      }
    } catch (error) {
      console.log("In catch block, logging error:", error);
      return res.status(500).end();
    }
  }
);

export default router;

// todo
// add other query string parameters when redturn authorization code
// check udemy whether query string redirect contains more than authorisation code and state
// check login credential more thoroughly
// add expiry time to authorisation code
