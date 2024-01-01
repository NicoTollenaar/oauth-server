import express from "express";
const router = express.Router();

router.post("/get-resources", (req, res) => {
  const reqBody = req.body;
  const resource = "retrieved_resource";
  return res.status(200).json({ resource });
});

export default router;
