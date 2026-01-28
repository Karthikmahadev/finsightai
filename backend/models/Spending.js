import mongoose from "mongoose";

const spendingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },  // e.g., Food & Dining, Transportation
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ["expense", "income"], default: "expense" },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Spending", spendingSchema);
