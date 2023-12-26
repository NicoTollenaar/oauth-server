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
    return res.redirect(`${redirect_uri}`);
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
  console.log("req.query:", req.query);
  const [dbClient] = await Client.find({ clientId: req.query.client_id });
  const queryParametersValid = dbClient && req.query.response_type === "code";
  console.log("dbClient:", dbClient);
  console.log("req.query.response_type:", req.query.response_type);
  console.log("req.query.client_id:", req.query.client_id);
  console.log(
    "req.query.response_type === code",
    req.query.response_type === "code"
  );
  console.log("queryParametersValid", queryParametersValid);

  if (queryParametersValid) {
    next();
  } else {
    res.status(401).send("Really eally Invalid authorisation request");
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
      console.log("dbUpdatedCode", dbUpdatedCode);
    } else {
      const newCode = new Code({
        userId: req.session.user?.id,
        authorisationCode,
        pkceCodeChallenge,
      });
      const dbNewCode = await newCode.save();
      console.log("dbNewCode:", dbNewCode);
    }
    next();
  } catch (error) {
    console.log("In catch block, logging error:", error);
    return res.status(500).send(error);
  }
}
