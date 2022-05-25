import express from "express";
import tweetsController from "../controllers/tweets.controller.js";
const router = express.Router();

router.get("/rules", (req, res) => {
  tweetsController.getAllStreamRules(req, res);
});

router.post("/rules", (req, res) => {
  tweetsController.addNewStreamRules(req, res);
});

export default router;
