import express, { Response } from "express";
const router = express.Router();
import Utils from "../../utils/utils";
import { isAuthenticatedClient } from "../middleware/oauthRoutesMiddleware";
import {
  OAuthError,
  ActiveTokenInfo,
  IInActiveTokenInfo,
  TokenInfo,
  InActiveTokenInfo,
} from "../../types/customTypes";

router.post(
  "/get-resources",
  isAuthenticatedClient,
  async (req, res): Promise<Response> => {
    // move clientId and clientSecret to Authorisation header using Basic Auth scheme
    const token: string = req.body.token;
    if (!token) throw new Error("accessToken null or undefined");
    try {
      const response = await Utils.introspectionRequest(
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
        error: "Catch error",
        error_description: `Catch error in route /get resources: ${error}`,
      };
      return res.status(401).json(oauthError);
    }
  }
);

export default router;

// todo
// move clientId and clientSecret to Authorisation header using Basic Auth scheme
// check correct error description
