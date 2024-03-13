import express, { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import fs from "fs";
import {
  isLoggedIn,
  isLoggedOut,
  isValidRequest,
  saveConsent,
  generateAndSaveCodes,
  returnAuthorisationCode,
  isAuthenticatedResourceServer,
  isAuthenticatedClient,
  validateRequestParameters,
} from "../middleware/oauthRoutesMiddleware";
import Code, { ICode } from "../../database/models/Code.Model";
import { User } from "../../database/models/User.Model";
import Utils from "../../utils/utils";
import {
  AccessTokenResponse,
  JWK,
  MetaData,
  OAuthError,
  TokenInfo,
} from "../../types/customTypes";
import {
  authorisationEndpointBackend,
  baseUrlOauthBackend,
  baseUrlResourceServer,
  introspectionEndpoint,
  registrationEndpoint,
  revocationEndpoint,
  tokenEndpoint,
} from "../../constants/urls";
import {
  ACCESS_TOKEN_LIFETIME,
  ID_PRIVATE_KEY_USED_FOR_SIGNING,
  ID_PUBLIC_KEY_USED_FOR_SIGNING,
  PRE_EXISTING_PUBLIC_KEYS_OAUTH_SERVER,
  REFRESH_TOKEN_LIFETIME,
  SCOPES_SUPPORTED_BY_OAUTH_SERVER,
} from "../../constants/parameters";
import crypto from "node:crypto";

const router = express.Router();

router.get("/logged-in-status", (req: Request, res: Response) => {
  if (req.session.user) {
    return res.json({ isLoggedIn: true });
  } else {
    return res.json({ isLoggedIn: false });
  }
});

router.post(
  "/authorize",
  isLoggedIn,
  isValidRequest,
  saveConsent,
  generateAndSaveCodes,
  returnAuthorisationCode
);

router.post("/login", isLoggedOut, async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  // const hashedPassword = await Utils.hashStringWithSalt(password);
  try {
    // check login credentials more thoroughly
    const dbUser = await User.findOne({ email: "piet@email.com" });
    if (!dbUser) return res.status(400).end();
    req.session.user = { id: dbUser._id };
    return res.status(200).end();
  } catch (error) {
    console.log("in catch block, /login route, logging error:", error);
    const oauthError: OAuthError = {
      error: "catch_error",
      error_description: `catch_error in isLoggedOut: ${error}`,
    };
    return res.status(401).json(oauthError);
  }
});

// see oauth.com:
// If an authorization code is used more than once, the authorization server must deny the subsequent requests. This is easy to accomplish if the authorization codes are stored in a database, since they can simply be marked as used. If a code is used more than once, it should be treated as an attack. If possible, the service should revoke the previous access tokens that were issued from this authorization code.
// This has not been implemented

// use this route below for reference access token (i.e. if access token not jwt)

router.post(
  "/oauth/token-non-jwt",
  isAuthenticatedClient,
  validateRequestParameters,
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { code } = req.body;
    try {
      const accessTokenIdentifier = crypto.randomUUID();
      const dbUpdatedUserCode = await Code.findOneAndUpdate(
        { "authorisationCode.identifier": code },
        {
          authorisationCode: null,
          accessToken: {
            identifier: accessTokenIdentifier,
            revoked: false,
            expires: Date.now() + 2000, // expires in 2 seconds
          },
          refreshToken: "still to be added",
        },
        { new: true }
      );
      if (dbUpdatedUserCode?.validateSync())
        throw new Error("Mongoose validation error");

      if (!dbUpdatedUserCode) {
        const oauthError: OAuthError = {
          error: "failed database operation",
          error_description:
            "updating database (exchanging authorization code for accesstoken) failed in token endpoint",
        };
        return res.status(401).json(oauthError);
      }
      const accessTokenResponse: AccessTokenResponse = {
        access_token: dbUpdatedUserCode.accessToken?.identifier as string,
        token_type: "Bearer",
        expires_in:
          dbUpdatedUserCode.accessToken?.expires === undefined
            ? 0
            : dbUpdatedUserCode.accessToken?.expires - Date.now(),
        scope: dbUpdatedUserCode.requestedScope, // todo; check whether fits in consented scope, otherwise more narrow
        // consented scope; see Oauth.com par 12.4
        refresh_token: "still to be added",
      };
      res.set("Cache-Control", "no-store");
      return res.status(200).json(accessTokenResponse);
    } catch (error) {
      console.log("In catch block /oauth/token, logging error:", error);
      const oauthError: OAuthError = {
        error: "catch_error",
        error_description: `catch_error in token endpoint: ${error}`,
      };
      return res.status(401).json(oauthError);
    }
  }
);

router.post(
  "/oauth/token",
  isAuthenticatedClient,
  validateRequestParameters,
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { code } = req.body;
    try {
      const jwtAccessToken: string | null = await createJwtAccessToken(code);
      if (!jwtAccessToken) throw new Error("createJwtAccessToken failed");
      const dbUpdatedUserCode = await Code.findOneAndUpdate(
        { "authorisationCode.identifier": code },
        {
          authorisationCode: null,
          accessToken: {
            identifier: jwtAccessToken,
            revoked: false,
            expires: Date.now() + ACCESS_TOKEN_LIFETIME,
          },
          refreshToken: {
            identifier: crypto.randomUUID(),
            revoked: false,
            expires: Date.now() + REFRESH_TOKEN_LIFETIME,
          },
        },
        { new: true }
      );
      if (dbUpdatedUserCode?.validateSync())
        throw new Error("Mongoose validation error");
      console.log("dbUpdatedUserCode:", dbUpdatedUserCode);
      if (!dbUpdatedUserCode) {
        const oauthError: OAuthError = {
          error: "failed database operation",
          error_description:
            "updating database (exchanging authorization code for accesstoken) failed in token endpoint",
        };
        return res.status(401).json(oauthError);
      }
      const accessTokenResponse: AccessTokenResponse = {
        access_token: dbUpdatedUserCode.accessToken?.identifier as string,
        token_type: "Bearer",
        expires_in:
          dbUpdatedUserCode.accessToken?.expires === undefined
            ? 0
            : dbUpdatedUserCode.accessToken?.expires - Date.now(),
        scope: dbUpdatedUserCode.requestedScope, // todo; check whether fits in consented scope, otherwise more narrow
        // consented scope; see Oauth.com par 12.4
        refresh_token: "still to be added",
      };
      res.set("Cache-Control", "no-store");

      // Building in a delay for testing purposes
      // setTimeout(() => {f
      //   return res.status(200).json(accessTokenResponse);
      // }, ACCESS_TOKEN_LIFETIME * 2000);
      return res.status(200).json(accessTokenResponse);
    } catch (error) {
      console.log("In catch block /oauth/token, logging error:", error);
      const oauthError: OAuthError = {
        error: "Catch_error",
        error_description: `Catch_error in token endpoint: ${error}`,
      };
      return res.status(401).json(oauthError);
    }
  }
);

async function createJwtAccessToken(code: string): Promise<string | null> {
  try {
    const dbCode = await Code.findOne({ "authorisationCode.identifier": code });

    const payload = {
      scope: dbCode?.requestedScope,
      client_id: dbCode?.recipientClientId,
    };
    const signOptions: SignOptions = {
      algorithm: "ES256",
      expiresIn: ACCESS_TOKEN_LIFETIME,
      header: { typ: "at+jwt", alg: "ES256" },
      audience: baseUrlResourceServer,
      issuer: baseUrlOauthBackend,
      subject: dbCode?.userId.toString(),
      keyid: ID_PUBLIC_KEY_USED_FOR_SIGNING,
    };
    const privateKey = fs.readFileSync(
      "./src/constants/oauthServerPrivateKey.pem",
      "utf-8"
    );
    const jwtAccessToken: string = jwt.sign(payload, privateKey, signOptions);
    return jwtAccessToken;
  } catch (error) {
    console.log(`Catch error in createJwtAccessToken: ${error}`);
    return null;
  }
}

router.post(
  "/token_info",
  isAuthenticatedResourceServer,
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const token: string = req.body.token;
    try {
      let tokenInfo: TokenInfo = await Utils.validateAccesTokenAndGetInfo(
        token
      );
      const status = "error" in tokenInfo ? 401 : 200;
      return res.status(status).json(tokenInfo);
    } catch (error) {
      console.log(
        "In catch block validate access token route, logging error:",
        error
      );
      return res.status(400).json({
        error: "catch block error",
        error_description: "Error in catch block in route /token_info",
      });
    }
  }
);

router.delete("/logout", (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    req.session.destroy((err): Response => {
      if (err) {
        console.log("Error in destroy session callback, logging error:", err);
        return res.status(400).send(`Unable to logout: ${err}`);
      } else {
        res.clearCookie("connect.sid");
        return res.status(200).send("Logged out");
      }
    });
  } else {
    return res.status(200).send("Already logged out");
  }
});

router.get(
  "/.well-known/oauth-authorization-server",
  (req: Request, res: Response, next: NextFunction) => {
    const oauthServerMetaData: MetaData = {
      issuer: `${baseUrlOauthBackend}`,
      authorization_endpoint: `${authorisationEndpointBackend}`,
      token_endpoint: `${tokenEndpoint}`,
      token_endpoint_auth_signing_alg_values_supported: ["RS256", "ES256"],
      introspection_endpoint: `${introspectionEndpoint}`,
      revocation_endpoint: `${revocationEndpoint}`,
      registration_endpoint: `${registrationEndpoint}`,
      jwks_uri: `${baseUrlOauthBackend}/jwks.json`,
      grant_types_supported: ["authorization_code", "implicit"],
      response_types_supported: ["code", "code token"],
      scopes_supported: SCOPES_SUPPORTED_BY_OAUTH_SERVER,
      code_challenge_methods_supported: ["S256"],
    };
    res.status(200).json(oauthServerMetaData);
  }
);

router.get(
  "/jwks",
  (req: Request, res: Response, next: NextFunction): Response => {
    //hardcoded here, probably stored in database in real life
    const publicKeyUsedForSigningPEM = fs.readFileSync(
      "./src/constants/oauthServerPublicKey.pem",
      "utf-8"
    );

    const publicKeyUsedForSigningObject = crypto.createPublicKey(
      publicKeyUsedForSigningPEM
    );

    const publicKeyUsedForSigningJWK: JWK =
      publicKeyUsedForSigningObject.export({
        format: "jwk",
      });
    publicKeyUsedForSigningJWK.kid = ID_PUBLIC_KEY_USED_FOR_SIGNING;
    const publicKeysOauthServer: JWK[] =
      PRE_EXISTING_PUBLIC_KEYS_OAUTH_SERVER.concat(publicKeyUsedForSigningJWK);
    const jwkSet: { keys: JWK[] } = {
      keys: publicKeysOauthServer,
    };
    return res.status(200).json(jwkSet);
  }
);

export default router;

// todo
// add other query string parameters when redturn authorization code
// check udemy whether query string redirect contains more than authorisation code and state
// check login credential more thoroughly
// add expiry time to authorisation code
// still to authenticateClient and add appropriate authorization headers in request /oauth/token
// todo; check whether fits in consented scope, otherwise more narrow
// consented scope; see Oauth.com par 12.4
