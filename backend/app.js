import express from "express";
import authRoutes from "./routes/auth.routes.js";
import spendingRoutes from "./routes/spending.routes.js";
import spendingTrendsRoutes from "./routes/spendingTrends.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import budgetRoutes from "./routes/budget.routes.js";
import budgetAlertRoutes from "./routes/budgetAlert.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js"
import cors from "cors";

const app = express();

// ✅ Enable CORS
app.use(
  cors({
    origin: [
      "https://finsight-frontend-imo3.onrender.com",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight
app.options("*", cors());


// ⬇️ Increase limits (important)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


app.use("/auth", authRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/spendings", spendingRoutes);  // <-- spendingRoutes now defined
app.use("/api/spending-trends", spendingTrendsRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/budget-alerts", budgetAlertRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;