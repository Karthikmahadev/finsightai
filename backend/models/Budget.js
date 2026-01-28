import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["overall", "category"],
      required: true,
    },

    category: {
      type: String,
      default: null, // null for overall budget
    },

    limit: {
      type: Number,
      required: true,
    },

    month: {
      type: Number, // 0–11
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

budgetSchema.index(
  { userId: 1, type: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

export default mongoose.model("Budget", budgetSchema);
