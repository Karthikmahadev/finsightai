import express from "express";
import {protect} from "../middleware/auth.middleware.js";
import {
  getBudgetAlerts,
  deleteAlert,
} from "../controllers/budgetAlert.controller.js";

const router = express.Router();

router.get("/", protect, getBudgetAlerts);
router.delete("/:id", protect, deleteAlert);

export default router;
