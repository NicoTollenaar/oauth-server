import { NextFunction, Request, Response } from "express";
import Client from "../../database/models/Client.Model";
import Code from "../../database/models/Code.Model";
import { redirect_uri } from "../../constants/urls";
import { User } from "../../database/models/User.Model";
import { Document } from "mongodb";
import Utils from "../../utils/utils";
import ResourceServer from "../../database/models/ResourceServer.Model";
import { OAuthError } from "../../types/customTypes";
import crypto from "crypto";

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
): Promise<void> {
  try {
    const queryObject = req.body;
    console.log("req.body:", req.body);
    const dbClient = await Client.findOne({ clientId: queryObject.client_id });
    let errorDescription: string = "";
    if (!dbClient) errorDescription = "client application unknown";
    if (queryObject.response_type !== "code")
      errorDescription = "invalid response type";
    if (!queryObject.code_challenge)
      errorDescription = "code challenge required";
    if (queryObject.code_challenge_method !== "S256")
      errorDescription = "transform algorithm not supported";
    if (errorDescription) {
      const oauthError: OAuthError = Utils.createOauthError(
        "invalid request",
        errorDescription
      );
      res.status(401).json(oauthError);
    } else {
      next();
    }
  } catch (error) {
    console.log("in catch is ValidRequest, logging error:", error);
    const oauthError: OAuthError = Utils.createOauthError(
      "catch error",
      `Catch error in isValidRequest: ${error}`
    );
    res.status(401).json(oauthError);
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
      { new: true }
    );
    dbUpdatedUser?.validateSync();
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
  try {
    const dbCode = await Code.findOne({
      userId: req.session.user?.id,
      recipientClientId: queryObject.client_id,
      redirectUri: queryObject.redirect_uri,
    });
    if (dbCode) {
      dbUpdatedCode = await Code.findByIdAndUpdate(
        dbCode._id,
        {
          authorisationCode: {
            identifier: authorisationCode,
            expires: Date.now() + 2000,
          },
          pkceCodeChallenge,
          requestedScope,
        },
        { new: true } // runValidators option not working, see caveats documentation under update()
      );
      dbCode.validateSync(); // because runValidators option not working
    } else {
      const newCode = new Code({
        userId: req.session.user?.id,
        authorisationCode: {
          identifier: authorisationCode,
          expires: Date.now() + 2000,
        },
        pkceCodeChallenge,
        requestedScope,
        recipientClientId: queryObject.client_id,
        redirectUri: queryObject.redirect_uri,
      });
      dbNewCode = await newCode.save();
    }
    if (dbUpdatedCode || dbNewCode) {
      next();
    } else if (!dbUpdatedCode && !dbNewCode) {
      const oauthError: OAuthError = {
        error: "database operation error",
        error_description: "failed to save codes in database",
      };
      return res.status(400).json(oauthError);
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
  const { hash } = await Utils.hashStringWithSalt(
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
  const { hash } = await Utils.hashStringWithSalt(
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

export async function validateRequestParameters(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    code,
    grant_type,
    client_id,
    redirect_uri,
    code_verifier,
  }: {
    code: string;
    grant_type: string;
    client_id: string;
    redirect_uri: string;
    code_verifier: string;
  } = req.body;
  try {
    const dbCode = await Code.findOne({ "authorisationCode.identifier": code });
    if (!dbCode) throw new Error("invalid code (not found)");
    if (
      dbCode?.authorisationCode?.expires &&
      dbCode?.authorisationCode?.expires <= Date.now()
    )
      throw new Error("Authorisation code expired");

    if (client_id !== dbCode.recipientClientId)
      throw new Error("invalid client_id, client unauthorized");
    if (redirect_uri !== dbCode.redirectUri)
      throw new Error("invalid redirect_uri");
    if (grant_type !== "authorization_code")
      throw new Error("invalid grant_type");
    const hashedCodeVerifier = crypto
      .createHash("sha256")
      .update(code_verifier)
      .digest("base64url");
    if (hashedCodeVerifier !== dbCode.pkceCodeChallenge)
      throw new Error("PKCE code challenge failed");
    next();
  } catch (error) {
    console.log(
      "In catch block validateRequestParameters, logging error:",
      error
    );
    const oauthError: OAuthError = {
      error: "Catch error",
      error_description: `Catch error in validateRequestParameters: ${error}`,
    };
    return res.status(401).json(oauthError);
  }
}
