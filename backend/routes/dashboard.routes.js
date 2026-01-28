import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getDashboardAnalytics } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/analytics", protect, getDashboardAnalytics);

export default router;