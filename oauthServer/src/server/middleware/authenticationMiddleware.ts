import { NextFunction, Request, Response } from "express";
// import { Session } from "express-session";

// import type { Response } from "express";
export async function isLoggedOut(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.user) {
    return res.redirect(`http://localhost:3000/get-resources`);
  } else {
    next();
  }
}

export async function isLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.user) {
    next();
  } else {
    req.session.destroy((err) => {
      if (err) next(err);
    });
    return res.redirect(`http://localhost:3000/oauth-provider/login`);
  }
}
