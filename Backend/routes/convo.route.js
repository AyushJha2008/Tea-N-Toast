import express from "express";
import {startConversation, getConversations} from "../controllers/convo.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/start", protectRoute, startConversation);

router.get("/", protectRoute, getConversations);

export default router;