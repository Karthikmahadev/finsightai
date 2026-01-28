import express from "express";
import {protect} from "../middleware/auth.middleware.js";
import {
  upsertBudget,
  getBudgets,
  getBudgetUsage,
  deleteBudget,
} from "../controllers/budget.controller.js";

const router = express.Router();

router.post("/", protect, upsertBudget);
router.get("/", protect, getBudgets);
router.get("/usage", protect, getBudgetUsage);
router.delete("/:id", protect, deleteBudget);

export default router;
