import express from "express"

import { getUserById, getUsers, searchUsers, updateProfile } from "../controllers/user.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = express.Router();
router.get("/", protectRoute, getUsers);
router.get("/search", protectRoute, searchUsers);
router.get("/:id", protectRoute, getUserById);
router.put("/profile", protectRoute, updateProfile)

export default router;