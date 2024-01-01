import { NextFunction, Request, Response } from "express";
import Client from "../../database/Client.Model";
import Code from "../../database/Code.Model";
import { redirect_uri } from "../../constants/urls";
import { User } from "../../database/User.Model";
import { Document, ObjectId } from "mongodb";
import { ICode } from "../../database/Code.Model";

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
    return res.status(400).json({ isLoggedIn: false });
  }
}

// export async function isLoggedIn(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   if (req.session.user) {
//     next();
//   } else {
//     req.session.destroy((err) => {
//       if (err) next(err);
//     });
//     return res.redirect(`http://localhost:3000/oauth-provider/login`);
//   }
// }

export async function isValidRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const queryObject = req.body;
  const dbClient = await Client.findOne({ clientId: queryObject.client_id });
  const queryParametersValid = dbClient && queryObject.response_type === "code";
  if (queryParametersValid) {
    next();
  } else {
    res.status(401).json({ error: "Invalid authorisation request" });
  }
}

// export async function isValidRequest(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const [dbClient] = await Client.find({ clientId: req.query.client_id });
//   const queryParametersValid = dbClient && req.query.response_type === "code";
//   if (queryParametersValid) {
//     next();
//   } else {
//     res.status(401).send("Invalid authorisation request");
//   }
// }

export async function saveConsent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const queryObject = req.body;
  const scopeArray = queryObject.scope.split(" ");
  try {
    const dbUpdatedUser = await User.findByIdAndUpdate(
      req.session.user?.id,
      {
        $addToSet: {
          oauthConsents: {
            clientId: queryObject.client_id,
            scope: scopeArray,
            date: Date.now(),
          },
        },
      },
      { new: true, runValidators: true }
    );
    console.log("dbUpdatedUser:", dbUpdatedUser);
    if (dbUpdatedUser) {
      next();
    } else {
      return res
        .status(400)
        .json({ error: "updating user consent in database failed" });
    }
  } catch (error) {
    console.log(
      "In catch block of saveConsent middleware, logging error:",
      error
    );
  }
}

export async function generateAndSaveCodes(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const queryObject = req.body;
  const authorisationCode = crypto.randomUUID();
  req.authorisationCode = authorisationCode;
  const pkceCodeChallenge = queryObject.code_challenge;
  let dbUpdatedCode: Document | null = null;
  let dbNewCode: Document | null = null;
  try {
    const dbCode = await Code.findOne({ userId: req.session.user?.id });
    if (dbCode) {
      dbUpdatedCode = await Code.findByIdAndUpdate(dbCode._id, {
        authorisationCode,
        pkceCodeChallenge,
      });
    } else {
      const newCode = new Code({
        userId: req.session.user?.id,
        authorisationCode,
        pkceCodeChallenge,
      });
      dbNewCode = await newCode.save();
    }
    if (dbUpdatedCode || dbNewCode) {
      next();
    } else if (!dbUpdatedCode && !dbNewCode) {
      return res
        .status(400)
        .json({ error: "failed to save codes in database" });
    }
  } catch (error) {
    console.log("In catch block, logging error:", error);
    return res.status(500).send(error);
  }
}
// export async function saveCodesInDatabase(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const authorisationCode = crypto.randomUUID();
//   req.authorisationCode = authorisationCode;
//   const pkceCodeChallenge = req.query.code_challenge;
//   try {
//     const dbCode = await Code.findOne({ userId: req.session.user?.id });
//     if (dbCode) {
//       const dbUpdatedCode = await Code.findByIdAndUpdate(dbCode._id, {
//         authorisationCode,
//         pkceCodeChallenge,
//       });
//     } else {
//       const newCode = new Code({
//         userId: req.session.user?.id,
//         authorisationCode,
//         pkceCodeChallenge,
//       });
//       const dbNewCode = await newCode.save();
//     }
//     next();
//   } catch (error) {
//     console.log("In catch block, logging error:", error);
//     return res.status(500).send(error);
//   }
// }

export async function returnAuthorisationCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.status(200).json({ authorisationCode: req.authorisationCode });
}
