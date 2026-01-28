import mongoose from "mongoose";
import Spending from "../models/Spending.js";

const getDateRange = (period) => {
  const now = new Date();
  let startDate;

  switch (period) {
    case "day":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      const dayOfWeek = now.getDay();
      startDate = new Date(now);
      startDate.setDate(now.getDate() - dayOfWeek);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      startDate = new Date(0);
  }

  return { startDate, endDate: now };
};

export const getSpendingsByPeriod = async (req, res) => {
  try {
    const userId = req.user._id;
    const period = req.query.period || "month";

    const { startDate, endDate } = getDateRange(period);

    const totalSpending = await Spending.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // ✅ FIX HERE
          type: "expense",
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    res.json({
      period,
      totalSpending: totalSpending[0]?.totalAmount || 0,
    });
  } catch (error) {
    console.error("Spendings API error:", error);
    res.status(500).json({ message: "Server error fetching spendings" });
  }
};

export const createSpending = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, amount, date, description, type } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const spending = await Spending.create({
      userId,
      category,
      amount,
      date,
      description,
      type: type || "expense",
    });

    res.status(201).json({
      message: "Spending added successfully",
      data: spending,
    });
  } catch (error) {
    console.error("Create spending error:", error);
    res.status(500).json({ message: "Failed to create spending" });
  }
};



export const getAllSpendings = async (req, res) => {
  try {
    const userId = req.user._id;

    const spendings = await Spending.find({ userId })
      .sort({ date: -1 });

    res.json({
      data: spendings,
    });
  } catch (error) {
    console.error("Get spendings error:", error);
    res.status(500).json({ message: "Failed to fetch spendings" });
  }
};


export const updateSpending = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const spending = await Spending.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!spending) {
      return res.status(404).json({ message: "Spending not found" });
    }

    res.json({
      message: "Spending updated successfully",
      data: spending,
    });
  } catch (error) {
    console.error("Update spending error:", error);
    res.status(500).json({ message: "Failed to update spending" });
  }
};

export const deleteSpending = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const spending = await Spending.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!spending) {
      return res.status(404).json({ message: "Spending not found" });
    }

    res.json({
      message: "Spending deleted successfully",
    });
  } catch (error) {
    console.error("Delete spending error:", error);
    res.status(500).json({ message: "Failed to delete spending" });
  }
};


