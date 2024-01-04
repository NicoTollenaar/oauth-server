import express from "express";
const router = express.Router();
import Code from "../../database/models/Code.Model";
import Utils from "../../utils/utils";
import { error } from "console";

router.post("/get-resources", async (req, res) => {
  const { accessToken } = req.body;
  if (!accessToken) throw new Error("accessToken null or undefined");
  try {
    const responseObject = await Utils.getUserIdAndRequestedScope(accessToken);
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
