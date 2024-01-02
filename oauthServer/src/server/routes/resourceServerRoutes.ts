import express from "express";
const router = express.Router();
import Code from "../../database/models/Code.Model";

router.post("/get-resources", async (req, res) => {
  const { accessToken } = req.body;
  console.log("in post /get-resources route, logging req.body:", req.body);
  const dbCode = await Code.find({ accessToken });
  console.log("in post get resources route, logging dbCode:", dbCode);
  if (dbCode) {
    return res.status(200).json({ retrievedResource: JSON.stringify(dbCode) });
  } else {
    return res
      .status(400)
      .json({ error: "failed to get user from database with accestoken" });
  }
});

export default router;
