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
  async (req: Request, res: Response, next: NextFunction) => {
    const { authorisationCode } = req.body;
    console.log("in tokenendpoint, logging req.body:", req.body);
    try {
      const dbUserCode = await Code.findOne({ authorisationCode });
      console.log(
        "In post /token route, logging dbUpdatedUserCode:",
        dbUserCode
      );
      if (dbUserCode) {
        const accessToken = crypto.randomUUID();
        console.log("in tokenendpoint, logging accesstoken:", accessToken);
        const dbUpdatedUserCode = await Code.findOneAndUpdate(
          { authorisationCode },
          { authorisationCode: null, accessToken },
          { new: true, runValidators: true }
        );
        console.log(
          "In post /token route, lgging dbUpdatedUserCode:",
          dbUpdatedUserCode
        );
        return res.status(200).json({ accessToken });
      } else {
        return res.status(400).json({ error: "Database operation failed" });
      }
    } catch (error) {
      console.log("In catch block, logging error:", error);
      return res
        .status(400)
        .json({ error: "Something went wrong in post /token route" });
    }
  }
);

router.post(
  "/userId-and-scope",
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.body;
    console.log(
      "In validate-access-token route, logging, accesstoken:",
      accessToken
    );
    try {
      const dbCode = await Code.findOne({ accessToken }).populate("userId");
      console.log("In validate-access-token route, logging, dbCode:", dbCode);
      if (dbCode) {
        const { userId, requestedScope } = dbCode;
        return res.status(200).json({ userId, requestedScope });
      } else {
        return res.json(400).json({ error: "Database request failed" });
      }
    } catch (error) {
      console.log(
        "In catch block validate access token route, logging error:",
        error
      );
      return res.status(200).json({
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
