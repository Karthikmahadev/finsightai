import express from "express";
import {protect} from "../middleware/auth.middleware.js";
import {
  getMonthlySpendingTrends,
  getWeeklySpendingTrends,
} from "../controllers/spendingTrends.controller.js";

const router = express.Router();

router.get("/monthly", protect, getMonthlySpendingTrends);
router.get("/weekly", protect, getWeeklySpendingTrends);

export default router;
