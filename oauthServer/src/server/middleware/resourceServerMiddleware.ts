import { NextFunction, Request, Response } from "express";
import { JWK, MetaData, OAuthError } from "../../types/customTypes";
import { jwks_uri, metaDataEndpoint } from "../../constants/urls";
import { JwtHeader } from "jsonwebtoken";
import { JsonWebKeyInput, KeyObject } from "crypto";
import crypto from "node:crypto";

export async function getMetaDataOauthServer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let oauthError: OAuthError = {
    error: "invalid_request",
    error_description: "metadata request failed",
  };
  try {
    const response = await fetch(metaDataEndpoint);
    if (!response.ok) {
      return res.status(400).json(oauthError);
    }
    const metadata: MetaData = await response.json();
    req.metadata = metadata;
    next();
  } catch (error) {
    oauthError.error_description = `Catch error in getPublicKeyOauthServer: ${error}`;
    return res.status(500).json(oauthError);
  }
}

export async function getPublicKeyOauthServer(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let oauthError: OAuthError = {
    error: "invalid_request",
    error_description: "getPublicKeyOauthServer failed",
  };
  try {
    const keys: JWK[] | OAuthError = await getJWKS();
    console.log("In getJWKS, logging keys:", keys);
    if ("error" in keys) return res.status(400).json(keys as OAuthError);
    const kid: string | null = getKid(req.body.token);
    console.log("in getPublicKeyOauthServer, logging keys:", keys);
    console.log(
      "in getPublicKeyOauthServer, logging Array.isArray(keys):",
      Array.isArray(keys)
    );
    const publicJWK: JWK | undefined = keys.find((key: JWK) => key.kid === kid);
    console.log("In getJWKS, logging publicJWK:", publicJWK);

    if (!publicJWK) return res.status(400).json(oauthError);
    const publicJwkInput: JsonWebKeyInput = {
      key: publicJWK,
      format: "jwk",
    };
    const publicKeyObject: KeyObject = crypto.createPublicKey(publicJwkInput);
    req.publicKeyObject = publicKeyObject;
    next();
  } catch (error) {
    oauthError.error_description = `Catch error in getPublicKeyOauthServer: ${error}`;
    return res.status(400).json(oauthError);
  }
}

async function getJWKS(): Promise<JWK[] | OAuthError> {
  let oauthError: OAuthError = {
    error: "key discovery error",
    error_description: "failed to retrieve JWKS",
  };
  try {
    const response: globalThis.Response = await fetch(jwks_uri);
    if (!response.ok) return oauthError;
    const jwkSet: { keys: JWK[] } = await response.json();
    return jwkSet.keys;
  } catch (error) {
    oauthError.error_description = `Catch error in getJWKS: ${error}`;
    return oauthError;
  }
}

function getKid(token: string): string | null {
  const encodedHeader: string = token.split(".")[0];
  const decodedHeaderJSON: string = Buffer.from(
    encodedHeader,
    "base64url"
  ).toString();
  const decodedHeaderObject: JwtHeader = JSON.parse(decodedHeaderJSON);
  return decodedHeaderObject.kid || null;
}
