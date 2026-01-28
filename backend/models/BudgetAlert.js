import mongoose from "mongoose";

const budgetAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["category", "overall"],
      required: true,
    },

    category: {
      type: String,
      default: null,
    },

    percentage: {
      type: Number, // 80 or 100
      required: true,
    },

    month: Number,
    year: Number,

    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("BudgetAlert", budgetAlertSchema);
