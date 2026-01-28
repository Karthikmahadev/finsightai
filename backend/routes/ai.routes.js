// backend/routes/ai.routes.js
import express from "express";
import { finsightAI } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ THIS IS IMPORTANT
router.get("/finsight", protect, finsightAI);
export default router;
