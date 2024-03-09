import express, { NextFunction, Response } from "express";
const router = express.Router();
import jwt from "jsonwebtoken";
import Utils from "../../utils/utils";
import { isAuthenticatedClient } from "../middleware/oauthRoutesMiddleware";
import {
  OAuthError,
  ActiveTokenInfo,
  IInActiveTokenInfo,
  TokenInfo,
  InActiveTokenInfo,
  MetaData,
  JWK,
} from "../../types/customTypes";
import {
  getMetaDataOauthServer,
  getPublicKeyOauthServer,
} from "../middleware/resourceServerMiddleware";
import { KeyObject } from "crypto";
import { baseUrlResourceServer, resourcesEndpoint } from "../../constants/urls";

router.post(
  "/get-resources",
  isAuthenticatedClient,
  getMetaDataOauthServer,
  getPublicKeyOauthServer,
  async (req, res) /*: Promise<Response> */ => {
    // move clientId and clientSecret to Authorisation header using Basic Auth scheme
    const token: string = req.body.token;
    if (!token) throw new Error("accessToken null or undefined");
    try {
      const validatedToken = jwt.verify(
        token,
        req.publicKeyObject as KeyObject,
        {
          complete: true,
          audience: baseUrlResourceServer,
          issuer: req.metadata?.issuer,
        }
      );

      console.log("validatedToken", validatedToken);

      // const response = await Utils.introspectionRequest(
      //   token,
      //   process.env.RESOURCE_SERVER_ID as string,
      //   process.env.RESOURCE_SERVER_SECRET as string
      // );
      let status: number = 200;
      // let responseBody: TokenInfo;
      // if ("error_description" in response) {
      //   status = 401;
      //   responseBody = response;
      // } else {
      //   status = response.status;
      //   responseBody = await response.json();
      //   if (
      //     "clientId" in responseBody &&
      //     responseBody.clientId !== req.clientId
      //   )
      //     responseBody = InActiveTokenInfo;
      // }
      return res.status(status).json(validatedToken);
    } catch (error) {
      console.log(
        "In catch block of get resources route, logging error:",
        error
      );
      // check correct error description
      const oauthError: OAuthError = {
        error: "catch_error",
        error_description: `catch_error in route /get resources: ${error}`,
      };
      return res.status(401).json(oauthError);
    }
  }
);

router.post(
  "/get-resources-non-jwt",
  isAuthenticatedClient,
  async (
    req: express.Request,
    res: express.Response
  ) /*: Promise<Response> */ => {
    // move clientId and clientSecret to Authorisation header using Basic Auth scheme
    const token: string = req.body.token;
    if (!token) throw new Error("accessToken null or undefined");
    try {
      const response: globalThis.Response | OAuthError =
        await Utils.introspectionRequest(
          token,
          process.env.RESOURCE_SERVER_ID as string,
          process.env.RESOURCE_SERVER_SECRET as string
        );
      let status: number;
      let responseBody: TokenInfo;
      if ("error_description" in response) {
        status = 401;
        responseBody = response;
      } else {
        status = response.status;
        responseBody = await response.json();
        if (
          "clientId" in responseBody &&
          responseBody.clientId !== req.clientId
        )
          responseBody = InActiveTokenInfo;
      }
      return res.status(status).json(responseBody);
    } catch (error) {
      console.log(
        "In catch block of get resources route, logging error:",
        error
      );
      // check correct error description
      const oauthError: OAuthError = {
        error: "catch_error",
        error_description: `catch_error in route /get resources: ${error}`,
      };
      return res.status(401).json(oauthError);
    }
  }
);

export default router;

// todo
// move clientId and clientSecret to Authorisation header using Basic Auth scheme
// check correct error description
