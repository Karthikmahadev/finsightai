import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

/* ---------- Utils ---------- */
const getMonthRange = (month, year) => {
  return {
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 0, 23, 59, 59),
  };
};

const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getCurrentDay = () => {
  return new Date().getDate();
};

/* ---------- 1️⃣ UPSERT BUDGET ---------- */
export const upsertBudget = async (req, res) => {
  try {
    const { type, category, limit, month, year } = req.body;
    const userId = req.user._id;

    // Validation
    if (!type || !limit || month === undefined || year === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    if (type === "category" && !category) {
      return res.status(400).json({ 
        success: false, 
        message: "Category is required for category budget" 
      });
    }

    // Check if budget already exists
    const existingBudget = await Budget.findOne({
      userId,
      type,
      category: type === "category" ? category : null,
      month,
      year,
    });

    if (existingBudget) {
      // Update existing budget
      existingBudget.limit = limit;
      await existingBudget.save();
      
      return res.json({
        success: true,
        message: "Budget updated successfully",
        data: existingBudget,
      });
    }

    // Create new budget
    const budget = new Budget({
      userId,
      type,
      category: type === "category" ? category : null,
      limit,
      month,
      year,
    });

    await budget.save();

    res.status(201).json({
      success: true,
      message: "Budget created successfully",
      data: budget,
    });
  } catch (error) {
    console.error("Error upserting budget:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to save budget" 
    });
  }
};

/* ---------- 2️⃣ GET BUDGETS ---------- */
export const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user._id;

    if (month === undefined || year === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Month and year are required" 
      });
    }

    const budgets = await Budget.find({
      userId,
      month: parseInt(month),
      year: parseInt(year),
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: budgets,
    });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch budgets" 
    });
  }
};

/* ---------- 3️⃣ GET BUDGET USAGE WITH ENHANCED INSIGHTS ---------- */
export const getBudgetUsage = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized" 
      });
    }

    const { month, year } = req.query;
    const m = parseInt(month);
    const y = parseInt(year);

    if (isNaN(m) || isNaN(y)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid month or year" 
      });
    }

    const range = getMonthRange(m, y);
    const previousRange = getMonthRange(m - 1, y);

    // Fetch budgets and transactions
    const [budgets, currentTxs, previousTxs] = await Promise.all([
      Budget.find({ userId, month: m, year: y }),
      Transaction.find({ 
        userId, 
        type: "expense",
        date: { $gte: range.start, $lte: range.end } 
      }),
      Transaction.find({ 
        userId, 
        type: "expense",
        date: { $gte: previousRange.start, $lte: previousRange.end } 
      }),
    ]);

    if (!budgets.length) {
      return res.json({
        success: true,
        data: [],
        insights: getDefaultInsights(m, y),
      });
    }

    // Calculate spending by category
    const spendingByCategory = {};
    const previousSpendingByCategory = {};

    currentTxs.forEach(tx => {
      spendingByCategory[tx.category] = (spendingByCategory[tx.category] || 0) + tx.amount;
    });

    previousTxs.forEach(tx => {
      previousSpendingByCategory[tx.category] = (previousSpendingByCategory[tx.category] || 0) + tx.amount;
    });

    // Calculate usage data
    const usageData = budgets.map(budget => {
      const spent = budget.type === "overall" 
        ? Object.values(spendingByCategory).reduce((sum, val) => sum + val, 0)
        : (spendingByCategory[budget.category] || 0);

      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

      const previousSpent = budget.type === "overall"
        ? Object.values(previousSpendingByCategory).reduce((sum, val) => sum + val, 0)
        : (previousSpendingByCategory[budget.category] || 0);

      const monthChange = previousSpent > 0 
        ? ((spent - previousSpent) / previousSpent) * 100 
        : spent > 0 ? 100 : 0;

      return {
        category: budget.type === "overall" ? "Overall" : budget.category,
        limit: budget.limit,
        spent: Math.round(spent),
        percentage: Math.round(percentage * 10) / 10,
        previousSpent: Math.round(previousSpent),
        monthChange: Math.round(monthChange * 10) / 10,
        status: percentage >= 100 ? "exceeded" : percentage >= 80 ? "warning" : "safe",
      };
    });

    // Generate intelligent insights
    const insights = generateInsights(usageData, m, y);

    return res.json({
      success: true,
      data: usageData,
      insights,
    });

  } catch (err) {
    console.error("Error fetching budget usage:", err);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch budget usage" 
    });
  }
};

/* ---------- Generate Insights ---------- */
const generateInsights = (usageData, month, year) => {
  const totalDays = getDaysInMonth(month, year);
  const currentDay = getCurrentDay();
  const daysRemaining = totalDays - currentDay;
  const monthProgress = Math.round((currentDay / totalDays) * 100);

  // Budget Health Summary
  const exceededBudgets = usageData.filter(u => u.status === "exceeded");
  const warningBudgets = usageData.filter(u => u.status === "warning");
  const safeBudgets = usageData.filter(u => u.status === "safe");

  let healthStatus = "excellent";
  let healthMessage = "All budgets are on track";
  let healthIcon = "✅";

  if (exceededBudgets.length > 0) {
    healthStatus = "critical";
    healthMessage = `${exceededBudgets.length} budget${exceededBudgets.length > 1 ? 's have' : ' has'} exceeded`;
    healthIcon = "🔴";
  } else if (warningBudgets.length > 0) {
    healthStatus = "warning";
    healthMessage = `${warningBudgets.length} budget${warningBudgets.length > 1 ? 's are' : ' is'} at risk`;
    healthIcon = "⚠️";
  } else {
    healthIcon = "✅";
  }

  // Calculate overall budget health score
  const avgPercentage = usageData.reduce((sum, u) => sum + u.percentage, 0) / usageData.length;
  const healthScore = Math.max(0, Math.min(100, 100 - avgPercentage));

  // Predictions & Warnings
  const predictions = [];
  usageData.forEach(usage => {
    if (currentDay > 5) { // Only predict after 5 days
      const dailyRate = usage.spent / currentDay;
      const projectedSpending = dailyRate * totalDays;
      const projectedPercentage = (projectedSpending / usage.limit) * 100;

      if (projectedPercentage > 100 && usage.status !== "exceeded") {
        const overspend = Math.round(projectedSpending - usage.limit);
        predictions.push({
          type: "warning",
          category: usage.category,
          message: `${usage.category} likely to exceed by ₹${overspend.toLocaleString()}`,
          icon: "⚠️",
          projectedSpending: Math.round(projectedSpending),
          daysToExceed: Math.ceil((usage.limit - usage.spent) / dailyRate),
        });
      } else if (projectedPercentage < 70 && daysRemaining > 10) {
        predictions.push({
          type: "positive",
          category: usage.category,
          message: `${usage.category} is well controlled`,
          icon: "✅",
          projectedSpending: Math.round(projectedSpending),
        });
      }
    }
  });

  // Month-over-Month Trends
  const trends = usageData
    .filter(u => u.previousSpent > 0)
    .map(u => ({
      category: u.category,
      change: u.monthChange,
      direction: u.monthChange > 0 ? "up" : u.monthChange < 0 ? "down" : "stable",
      icon: u.monthChange > 15 ? "📈" : u.monthChange < -15 ? "📉" : "➡️",
      message: `${u.category} ${u.monthChange > 0 ? '↑' : '↓'} ${Math.abs(u.monthChange).toFixed(1)}% vs last month`,
      previousAmount: u.previousSpent,
      currentAmount: u.spent,
    }))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  // Top spending categories
  const topSpenders = [...usageData]
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 3);

  // Quick Stats
  const totalSpent = usageData.reduce((sum, u) => sum + u.spent, 0);
  const totalLimit = usageData.reduce((sum, u) => sum + u.limit, 0);
  const totalRemaining = totalLimit - totalSpent;

  return {
    healthSummary: {
      status: healthStatus,
      message: healthMessage,
      icon: healthIcon,
      score: Math.round(healthScore),
      exceededCount: exceededBudgets.length,
      warningCount: warningBudgets.length,
      safeCount: safeBudgets.length,
      totalBudgets: usageData.length,
    },
    monthProgress: {
      currentDay,
      totalDays,
      daysRemaining,
      percentage: monthProgress,
      message: `Day ${currentDay} of ${totalDays}`,
      remainingMessage: `${daysRemaining} days remaining`,
    },
    predictions: predictions.slice(0, 3), // Top 3 predictions
    trends: trends.slice(0, 5), // Top 5 trends
    topSpenders,
    quickStats: {
      totalSpent: Math.round(totalSpent),
      totalLimit: Math.round(totalLimit),
      totalRemaining: Math.round(totalRemaining),
      utilizationRate: Math.round((totalSpent / totalLimit) * 100),
    },
    recommendations: generateRecommendations(usageData, predictions, monthProgress),
  };
};

/* ---------- Generate Recommendations ---------- */
const generateRecommendations = (usageData, predictions, monthProgress) => {
  const recommendations = [];

  // Based on predictions
  predictions.forEach(pred => {
    if (pred.type === "warning" && pred.daysToExceed) {
      recommendations.push({
        title: `Slow down ${pred.category} spending`,
        description: `You'll exceed this budget in ${pred.daysToExceed} days at current pace`,
        action: `Reduce daily spending to ₹${Math.round((pred.projectedSpending * 0.9) / 30)}/day`,
        priority: "high",
        icon: "🎯",
      });
    }
  });

  // Based on month progress
  if (monthProgress > 50) {
    const highSpenders = usageData.filter(u => u.percentage > monthProgress + 20);
    highSpenders.forEach(u => {
      recommendations.push({
        title: `${u.category} ahead of schedule`,
        description: `${Math.round(u.percentage)}% used with ${100 - monthProgress}% of month left`,
        action: "Review recent transactions and adjust spending",
        priority: "medium",
        icon: "⏰",
      });
    });
  }

  // Based on trends
  const increasingCategories = usageData.filter(u => u.monthChange > 30);
  if (increasingCategories.length > 0) {
    recommendations.push({
      title: "Sharp increase detected",
      description: `${increasingCategories[0].category} up ${Math.round(increasingCategories[0].monthChange)}% vs last month`,
      action: "Identify unnecessary expenses and cut back",
      priority: "medium",
      icon: "📊",
    });
  }

  return recommendations.slice(0, 3); // Top 3 recommendations
};

/* ---------- Default Insights for Empty State ---------- */
const getDefaultInsights = (month, year) => {
  const totalDays = getDaysInMonth(month, year);
  const currentDay = getCurrentDay();
  const daysRemaining = totalDays - currentDay;
  const monthProgress = Math.round((currentDay / totalDays) * 100);

  return {
    healthSummary: {
      status: "none",
      message: "No budgets set yet",
      icon: "💤",
      score: 0,
      exceededCount: 0,
      warningCount: 0,
      safeCount: 0,
      totalBudgets: 0,
    },
    monthProgress: {
      currentDay,
      totalDays,
      daysRemaining,
      percentage: monthProgress,
      message: `Day ${currentDay} of ${totalDays}`,
      remainingMessage: `${daysRemaining} days remaining`,
    },
    predictions: [],
    trends: [],
    topSpenders: [],
    quickStats: {
      totalSpent: 0,
      totalLimit: 0,
      totalRemaining: 0,
      utilizationRate: 0,
    },
    recommendations: [
      {
        title: "Set your first budget",
        description: "Start with categories you spend most on",
        action: "Click 'Add Budget' to begin tracking",
        priority: "high",
        icon: "🎯",
      },
    ],
  };
};

/* ---------- 4️⃣ DELETE BUDGET ---------- */
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ 
        success: false, 
        message: "Budget not found" 
      });
    }

    res.json({ 
      success: true, 
      message: "Budget deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to delete budget" 
    });
  }
};