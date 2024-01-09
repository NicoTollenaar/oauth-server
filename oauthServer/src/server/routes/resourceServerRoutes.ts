import express from "express";
const router = express.Router();
import Code from "../../database/models/Code.Model";
import Utils from "../../utils/utils";
import { error } from "console";

router.post("/get-resources", async (req, res) => {
  // move clientId and clientSecret to Authorisation header using Basic Auth scheme
  const { accessToken, clientId, clientSecret } = req.body;
  if (!accessToken) throw new Error("accessToken null or undefined");
  try {
    const responseObject = await Utils.introspectionRequest(
      accessToken,
      clientId,
      clientSecret
    );
    if (responseObject) {
      const { userId, requestedScope } = responseObject;
      return res.status(200).json({
        retrievedResource: JSON.stringify({ userId, requestedScope }),
      });
    } else {
      return res.status(400).json({
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
