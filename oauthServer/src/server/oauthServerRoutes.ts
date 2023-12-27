import express, { Request, Response, NextFunction } from "express";
import {
  isLoggedIn,
  isLoggedOut,
  isValidRequest,
  saveCodesInDatabase,
} from "./middleware/authenticationMiddleware";
import Code from "../database/Code.Model";
import { IUser, User } from "../database/User.Model";
import type { ObjectId, Document } from "mongodb";
import Utils from "../utils/utils";
import { redirect_uri } from "../constants/urls";
import type { CurrentUser } from "../types/express/customTypes";

const router = express.Router();

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
  const newUser = new User({
    firstName,
    lastName,
    email,
    hashedPassword,
  });
  const { id } = await newUser.save();
  req.session.user = { id };
  return res.status(200).end();
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
