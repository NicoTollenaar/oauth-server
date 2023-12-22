import express, { Request, Response, NextFunction } from "express";
import isAuthenticated from "./middleware/authenticationMiddleware";

type User = {
  id?: string;
  email: string;
  password: string;
};

// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData {
    user: User;
  }
}

const router = express.Router();

router.get("/code", async (req: Request, res: Response, next: NextFunction) => {
  console.log("in /code, logging req.sessionID:", req.sessionID);
  console.log(
    "in /code, logging req.session, logging req.session:",
    req.session
  );
  if (req.session.user) {
    
    // req.session.save(function (err) {
    //   if (err) return next(err);
    //   const authorisationCode = "authorisation_code";
    //   res.redirect(
    //     `http://localhost:3000/get-resources?code=${authorisationCode}`
    //   );
    // });
    const authorisationCode = "authorisation_code";
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
  (req: Request, res: Response, next: NextFunction) => {
    req.session.user = req.body;
    console.log("in post /login route, logging req.body:", req.body);
    console.log("in post /login route, logging req.sessionID:", req.sessionID);
    console.log("in post /login route, logging req.session:", req.session);
    req.session.save(function (err) {
      if (err) {
        console.log("session.save error, logging error:", err);
        next(err);
      }
    });
    res.status(200).end();
  }
);

router.post("/token", (req, res) => {
  const reqBody = req.body;
  const accessToken = "access_token";
  return res.status(200).send(accessToken);
});

export default router;
