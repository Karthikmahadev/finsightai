import dotenv from "dotenv";

// ✅ MUST be first
dotenv.config();

import connectDB from "./config/db.js";
import app from "./app.js";

const PORT = process.env.PORT || 5000;


app.get("/", (req, res) => {
  res.send("🚀 Finsight Backend is running");
});

console.log(
  "OPENAI KEY loaded:",
  process.env.OPENAI_API_KEY ? "YES" : "NO"
);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
