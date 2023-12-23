import express, { Request, Response, NextFunction } from "express";
import isAuthenticated from "./middleware/authenticationMiddleware";
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

router.get("/code", async (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    const authorisationCode = crypto.randomUUID();
    const dbResult = await Code.findOneAndUpdate(
      { userId: req.session.user.id },
      { authorisationCode }
    );
    console.log("dbResult", dbResult);
    res.redirect(
      `http://localhost:3000/get-resources?code=${authorisationCode}`
    );
  } else {
    req.session.destroy((err) => {
      if (err) next(err);
    });
    console.log(
      "in /code, logging req.session AFTER DESTRY, logging req.session:",
      req.session
    );
    res.redirect(`http://localhost:3000/oauth-provider/login`);
  }
});

router.post(
  "/login",
  isAuthenticated,
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password } = req.body;
    const hashedPassword = await Utils.hashPassword(password);
    const newUser = new User({
      firstName,
      lastName,
      email,
      hashedPassword,
    });
    const { id } = await newUser.save();
    console.log("id:", id);
    req.session.user = { id };
    // req.session.save(function (err) {
    //   if (err) {
    //     console.log("session.save error, logging error:", err);
    //     next(err);
    //   }
    // });
    res.status(200).end();
  }
);

router.post("/token", (req, res) => {
  const reqBody = req.body;
  const accessToken = "access_token";
  return res.status(200).send(accessToken);
});

export default router;
