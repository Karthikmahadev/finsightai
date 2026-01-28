import express from "express";
import { getSpendingsByPeriod , createSpending,
    getAllSpendings,
    updateSpending,
    deleteSpending,} from "../controllers/spending.controller.js";
import {protect} from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getSpendingsByPeriod);

// CRUD
router.post("/", protect, createSpending);
router.get("/list", protect, getAllSpendings);
router.put("/:id", protect, updateSpending);
router.delete("/:id", protect, deleteSpending);

export default router;
