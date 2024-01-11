import express from "express";
const router = express.Router();
import Code from "../../database/models/Code.Model";
import Utils from "../../utils/utils";
import { error } from "console";
import { isAuthenticatedClient } from "../middleware/oauthRoutesMiddleware";

router.post("/get-resources", isAuthenticatedClient, async (req, res) => {
  // move clientId and clientSecret to Authorisation header using Basic Auth scheme
  const { token } = req.body;
  if (!token) throw new Error("accessToken null or undefined");
  try {
    const responseObject = await Utils.introspectionRequest(
      token,
      process.env.RESOURCE_SERVER_ID as string,
      process.env.RESOURCE_SERVER_SECRET as string
    );
    if (responseObject) {
      return res.status(200).json({
        retrievedResource: JSON.stringify(responseObject),
      });
    } else {
      return res.status(401).json({
        error:
          "failed to get user and requested scope from database with accestoken",
      });
    }
  } catch (error) {
    console.log("In catch block of get resources route, logging error:", error);
    return res.status(400).json({
      error:
        "failed to get user and requested scope from database with accestoken",
    });
  }
});

export default router;

// todo
// move clientId and clientSecret to Authorisation header using Basic Auth scheme
