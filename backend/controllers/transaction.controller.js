import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";
import BudgetAlert from "../models/BudgetAlert.js";

/* 🔔 CREATE BUDGET ALERTS (INTERNAL HELPER) */
const createBudgetAlert = async ({
  userId,
  type,
  category,
  spent,
  limit,
  month,
  year,
}) => {
  const percentageUsed = Math.floor((spent / limit) * 100);

  if (percentageUsed < 80) return;

  const alertLevel = percentageUsed >= 100 ? 100 : 80;

  const exists = await BudgetAlert.findOne({
    userId,
    type,
    category: category || null,
    percentage: alertLevel,
    month,
    year,
  });

  if (!exists) {
    await BudgetAlert.create({
      userId,
      type,
      category: category || null,
      percentage: alertLevel,
      month,
      year,
      message:
        alertLevel === 100
          ? "Budget fully exhausted"
          : "You have used 80% of your budget",
    });
  }
};

/* 1️⃣ CREATE TRANSACTION (WITH BUDGET BLOCKING) */
export const createTransaction = async (req, res) => {
  try {
    const { type, category, amount, date, description } = req.body;

    if (!type || !category || !amount || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 🔐 Apply budget rules only for expenses
    if (type === "expense") {
      const txDate = new Date(date);
      const month = txDate.getMonth();
      const year = txDate.getFullYear();

      /* 🟣 CATEGORY BUDGET CHECK */
      const categoryBudget = await Budget.findOne({
        userId: req.user._id,
        type: "category",
        category,
        month,
        year,
      });

      if (categoryBudget) {
        const categorySpent = await Transaction.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(req.user._id),
              type: "expense",
              category,
              date: {
                $gte: new Date(year, month, 1),
                $lte: new Date(year, month + 1, 0, 23, 59, 59),
              },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const spent = categorySpent[0]?.total || 0;

        if (spent + amount > categoryBudget.limit) {
          return res.status(400).json({
            message: `Category budget exceeded for ${category}`,
          });
        }

        await createBudgetAlert({
          userId: req.user._id,
          type: "category",
          category,
          spent: spent + amount,
          limit: categoryBudget.limit,
          month,
          year,
        });
      }

      /* 🔵 OVERALL BUDGET CHECK */
      const overallBudget = await Budget.findOne({
        userId: req.user._id,
        type: "overall",
        month,
        year,
      });

      if (overallBudget) {
        const totalSpentAgg = await Transaction.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(req.user._id),
              type: "expense",
              date: {
                $gte: new Date(year, month, 1),
                $lte: new Date(year, month + 1, 0, 23, 59, 59),
              },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const spent = totalSpentAgg[0]?.total || 0;

        if (spent + amount > overallBudget.limit) {
          return res.status(400).json({
            message: "Overall monthly budget exceeded",
          });
        }

        await createBudgetAlert({
          userId: req.user._id,
          type: "overall",
          category: null,
          spent: spent + amount,
          limit: overallBudget.limit,
          month,
          year,
        });
      }
    }

    /* ✅ CREATE TRANSACTION */
    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      category,
      amount,
      date,
      description,
    });

    res.status(201).json({
      message: "Transaction added",
      data: transaction,
    });
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({ message: "Failed to create transaction" });
  }
};

/* 2️⃣ GET ALL TRANSACTIONS */
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user._id,
    }).sort({ date: -1 });

    res.json({ data: transactions });
  } catch (error) {
    console.error("Fetch transactions error:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

/* 3️⃣ UPDATE TRANSACTION */
export const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      message: "Transaction updated",
      data: transaction,
    });
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ message: "Failed to update transaction" });
  }
};

/* 4️⃣ DELETE TRANSACTION */
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
};
