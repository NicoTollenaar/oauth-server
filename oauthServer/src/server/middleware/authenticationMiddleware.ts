import { NextFunction, Request, Response } from "express";
import Client from "../../database/Client.Model";
import Code from "../../database/Code.Model";
import { redirect_uri } from "../../constants/urls";
// import { Session } from "express-session";

export async function isLoggedOut(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.user) {
    return res.redirect(`${redirect_uri}?loggedIn=true`);
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

export async function isValidRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const [dbClient] = await Client.find({ clientId: req.query.client_id });
  const queryParametersValid = dbClient && req.query.response_type === "code";
  if (queryParametersValid) {
    next();
  } else {
    res.status(401).send("Invalid authorisation request");
  }
}

export async function saveCodesInDatabase(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authorisationCode = crypto.randomUUID();
  req.authorisationCode = authorisationCode;
  const pkceCodeChallenge = req.query.code_challenge;
  try {
    const dbCode = await Code.findOne({ userId: req.session.user?.id });
    if (dbCode) {
      const dbUpdatedCode = await Code.findByIdAndUpdate(dbCode._id, {
        authorisationCode,
        pkceCodeChallenge,
      });
    } else {
      const newCode = new Code({
        userId: req.session.user?.id,
        authorisationCode,
        pkceCodeChallenge,
      });
      const dbNewCode = await newCode.save();
    }
    next();
  } catch (error) {
    console.log("In catch block, logging error:", error);
    return res.status(500).send(error);
  }
}
