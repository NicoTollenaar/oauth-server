import { NextFunction, Request, Response } from "express";
import Client from "../../database/models/Client.Model";
import Code from "../../database/models/Code.Model";
import { redirect_uri } from "../../constants/urls";
import { User } from "../../database/models/User.Model";
import { Document } from "mongodb";
import Utils from "../../utils/utils";
import ResourceServer from "../../database/models/ResourceServer.Model";

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
            consentedScope: scopeArray,
          },
        },
      },
      { new: true, runValidators: true }
    );
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
  const requestedScope = queryObject.scope.split(" ");
  let dbUpdatedCode: Document | null = null;
  let dbNewCode: Document | null = null;
  const inactiveAccessToken = {
    identifier: "inactive",
    revoked: true,
    expires: 0,
  };
  try {
    const dbCode = await Code.findOne({
      userId: req.session.user?.id,
      recipientClientId: queryObject.client_id,
    });
    if (dbCode) {
      dbUpdatedCode = await Code.findByIdAndUpdate(
        dbCode._id,
        {
          authorisationCode,
          pkceCodeChallenge,
          requestedScope,
          accessToken: inactiveAccessToken,
        },
        { new: true, runValidators: true }
      );
    } else {
      const newCode = new Code({
        userId: req.session.user?.id,
        authorisationCode,
        pkceCodeChallenge,
        requestedScope,
        recipientClientId: queryObject.client_id,
        accessToken: inactiveAccessToken,
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
    console.log("In catch block generateAndSaveCodes, logging error:", error);
    return res.status(500).send(error);
  }
}

export async function returnAuthorisationCode(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.status(200).json({ authorisationCode: req.authorisationCode });
}

// see RFC 7662, OAuth 2.0 Token Introspection
// and RFC 6749, The OAuth 2.0 Authorization Framework,
export async function isAuthenticatedClient(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id, secret } = Utils.extractCredentialsFromBasicAuthHeader(
    req.headers.authorization
  );
  req.clientId = id;
  const dbClient = await Client.findOne({ clientId: id }).populate(
    "hashedClientSecret"
  );
  const { hash } = await Utils.hashString(
    secret as string,
    dbClient?.hashedClientSecret.salt
  );
  const isHashEqual = dbClient?.hashedClientSecret.hash === hash;

  // const dbClient = await Client.findOne({ clientId, hashedClientSecret });
  if (dbClient && isHashEqual) {
    next();
  } else {
    return res.status(401).json({ error: "Unauthorized client" });
  }
}
export async function isAuthenticatedResourceServer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id, secret } = Utils.extractCredentialsFromBasicAuthHeader(
    req.headers.authorization
  );
  const dbResourceServer = await ResourceServer.findOne({
    resourceServerId: id,
  }).populate("hashedResourceServerSecret");
  const { hash } = await Utils.hashString(
    secret as string,
    dbResourceServer?.hashedResourceServerSecret.salt
  );
  const isHashEqual =
    dbResourceServer?.hashedResourceServerSecret.hash === hash;

  if (dbResourceServer && isHashEqual) {
    next();
  } else {
    return res.status(401).json({
      error: "invalid_client",
      error_description: "The client authentication was invalid",
    });
  }
}
