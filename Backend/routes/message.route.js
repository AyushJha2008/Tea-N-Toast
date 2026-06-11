import express from "express";
import {sendMessage, getMessages, markAsSeen} from "../controllers/message.controller.js";
import {protectRoute} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send/:id", protectRoute, sendMessage);
router.get("/:id", protectRoute, getMessages );
router.put("/seen/:id", protectRoute, markAsSeen);

export default router;