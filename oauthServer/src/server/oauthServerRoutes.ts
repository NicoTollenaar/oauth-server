import express, { Request, Response, NextFunction } from "express";
import { isLoggedIn, isLoggedOut } from "./middleware/authenticationMiddleware";
import Code from "../database/Code.Model";
import { IUser, User } from "../database/User.Model";
import type { ObjectId, Document } from "mongodb";
import Utils from "../utils/utils";

type User = {
  id: ObjectId;
};
// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

const router = express.Router();

router.get(
  "/code",
  isLoggedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("req.session.user?.id", req.session.user?.id);
    const authorisationCode = crypto.randomUUID();
    try {
      const dbCode = await Code.findOne({ userId: req.session.user?.id });
      if (dbCode) {
        const dbUpdatedCode = await Code.findByIdAndUpdate(dbCode._id, {
          authorisationCode,
        });
        console.log("dbUpdatedCode", dbUpdatedCode);
      } else {
        const newCode = new Code({
          userId: req.session.user?.id,
          authorisationCode,
        });
        newCode.save();
      }
    } catch (error) {
      console.log("In catch block, logging error:", error);
      return res.status(500).send(error);
    }
    return res.redirect(
      `http://localhost:3000/get-resources?code=${authorisationCode}`
    );
  }
);

router.post("/login", isLoggedOut, async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = await Utils.hashPassword(password);
  const newUser = new User({
    firstName,
    lastName,
    email,
    hashedPassword,
  });
  const { id } = await newUser.save();
  console.log("in lost route /login, logging user id returned from db:", id);
  req.session.user = { id };
  // req.session.save(function (err) {
  //   if (err) {
  //     console.log("session.save error, logging error:", err);
  //     next(err);
  //   }
  // });
  res.status(200).end();
});

router.post(
  "/token",
  isLoggedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("in post /token route, logging req.body:", req.body);
    const { authorisationCode } = req.body;
    console.log("extracting and logging code:", authorisationCode);
    try {
      const dbUserCodes = await Code.findOne({ userId: req.session.user?.id });
      console.log("dbUserCodes", dbUserCodes);
      if (dbUserCodes?.authorisationCode === authorisationCode) {
        const accessToken = "access_token";
        const dbUpdatedCUserCodes = await Code.findOneAndUpdate(
          { userId: req.session.user?.id },
          { authorisationCode: null, accessToken }
        );
        console.log("dbUpdatedCUserCodes:", dbUpdatedCUserCodes);
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
