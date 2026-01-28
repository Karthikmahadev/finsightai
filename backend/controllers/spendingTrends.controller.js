import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

/* MONTHLY SPENDING TRENDS (LAST 6 MONTHS) */
export const getMonthlySpendingTrends = async (req, res) => {
  try {
    const userId = req.user._id;

    const trends = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "expense",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              {
                $arrayElemAt: [
                  [
                    "",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  "$_id.month",
                ],
              },
            ],
          },
          year: "$_id.year",
          amount: "$totalAmount",
        },
      },
    ]);

    res.json({ data: trends });
  } catch (error) {
    console.error("Monthly trends error:", error);
    res.status(500).json({ message: "Failed to fetch monthly trends" });
  }
};

/* WEEKLY SPENDING TRENDS (LAST 7 DAYS) */
export const getWeeklySpendingTrends = async (req, res) => {
  try {
    const userId = req.user._id;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);

    const trends = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          type: "expense",
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$date" },
            month: { $month: "$date" },
            year: { $year: "$date" },
          },
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: "$_id.day" },
              "-",
              { $toString: "$_id.month" },
            ],
          },
          amount: "$totalAmount",
        },
      },
    ]);

    res.json({ data: trends });
  } catch (error) {
    console.error("Weekly trends error:", error);
    res.status(500).json({ message: "Failed to fetch weekly trends" });
  }
};
