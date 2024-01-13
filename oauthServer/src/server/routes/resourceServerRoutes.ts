import express, { Response } from "express";
const router = express.Router();
import Utils from "../../utils/utils";
import { isAuthenticatedClient } from "../middleware/oauthRoutesMiddleware";
import { CatchError } from "../../utils/utils";

router.post("/get-resources", isAuthenticatedClient, async (req, res) => {
  // move clientId and clientSecret to Authorisation header using Basic Auth scheme
  const { token } = req.body;
  if (!token) throw new Error("accessToken null or undefined");
  try {
    const response = await Utils.introspectionRequest(
      token,
      process.env.RESOURCE_SERVER_ID as string,
      process.env.RESOURCE_SERVER_SECRET as string
    );
    const status = response.ok ? 200 : 401;

    const responseToSend = (response as CatchError).error
      ? response
      : (response as unknown as Response).json();
    return res.status(status).json(responseToSend);
  } catch (error) {
    console.log("In catch block of get resources route, logging error:", error);
    // check correct error description
    return res.status(401).json({
      responseOk: false,
      responseContent: {
        error: "invalid_resource request",
        error_description: "Bad resource request",
      },
    });
  }
});

export default router;

// todo
// move clientId and clientSecret to Authorisation header using Basic Auth scheme
// check correct error description
