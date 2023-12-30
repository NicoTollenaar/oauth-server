import express, { Request, Response, NextFunction } from "express";
import {
  isLoggedIn,
  isLoggedOut,
  isValidRequest,
  saveCodesInDatabase,
} from "./middleware/authenticationMiddleware";
import Code from "../database/Code.Model";
import { User } from "../database/User.Model";
import Utils from "../utils/utils";
import { redirect_uri } from "../constants/urls";

const router = express.Router();

router.get("/confirm-or-login", async (req: Request, res: Response) => {
  const queryString = new URLSearchParams(
    <Record<string, string>>req.query
  ).toString();
  if (req.session.user) {
    return res.redirect(
      `http://localhost:3000/oauth-provider/confirm?${queryString}`
    );
  } else {
    return res.redirect(
      `http://localhost:3000/oauth-provider/login?${queryString}`
    );
  }
});

router.get(
  "/authorize",
  isLoggedIn,
  isValidRequest,
  saveCodesInDatabase,
  async (req: Request, res: Response, next: NextFunction) => {
    const queryString = `code=${req.authorisationCode}&state=${req.query.state}`;
    return res.redirect(
      // add other queryStringparameters
      `${redirect_uri}?${queryString}`
    );
  }
);

router.post("/login", isLoggedOut, async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  // validate posted login credentials
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
  // const dbUser =
  // const newUser = new User({
  //   firstName,
  //   lastName,
  //   email,
  //   hashedPassword,
  //   timestamps: true,
  // });
  // const { id } = await newUser.save();
});

router.post("/confirm", isLoggedIn, async (req: Request, res: Response) => {
  const { client_id, scope } = req.body;
  // validate posted login credentials
  // subdocument of User
  const dbUpdatedUser = await User.findByIdAndUpdate(req.session.user?.id, {
    oauthConsents: {
      clientId: client_id,
      scope,
      date: Date.now(),
    },
  });
  console.log("dbUpdatedUser:", dbUpdatedUser);
  if (dbUpdatedUser) {
    return res.status(200).end();
  } else {
    return res.status(400).end();
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
