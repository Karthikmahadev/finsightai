import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Budget from "../models/Budget.js";

/* ---------- Utility Functions ---------- */
const getMonthRange = (offset = 0) => {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth() + offset, 1),
    end: new Date(now.getFullYear(), now.getMonth() + offset + 1, 0, 23, 59, 59),
  };
};

const getWeekRange = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - dayOfWeek);
  start.setHours(0, 0, 0, 0);
  
  return { start, end: now };
};

const getTodayRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return { start, end: now };
};

/* ---------- MAIN DASHBOARD ANALYTICS ---------- */
export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentMonth = getMonthRange(0);
    const previousMonth = getMonthRange(-1);
    const currentWeek = getWeekRange();
    const today = getTodayRange();

    // Fetch all required data in parallel
    const [
      currentMonthTxs,
      previousMonthTxs,
      currentWeekTxs,
      todayTxs,
      budgets,
      last6MonthsTxs,
    ] = await Promise.all([
      Transaction.find({ 
        userId, 
        date: { $gte: currentMonth.start, $lte: currentMonth.end } 
      }),
      Transaction.find({ 
        userId, 
        date: { $gte: previousMonth.start, $lte: previousMonth.end } 
      }),
      Transaction.find({ 
        userId, 
        date: { $gte: currentWeek.start, $lte: currentWeek.end } 
      }),
      Transaction.find({ 
        userId, 
        date: { $gte: today.start, $lte: today.end } 
      }),
      Budget.find({ 
        userId, 
        month: currentMonth.start.getMonth(), 
        year: currentMonth.start.getFullYear() 
      }),
      Transaction.find({
        userId,
        date: { $gte: getMonthRange(-5).start, $lte: currentMonth.end }
      }),
    ]);

    // Calculate totals and analytics
    const analytics = {
      overview: calculateOverview(currentMonthTxs, previousMonthTxs),
      quickStats: calculateQuickStats(currentMonthTxs, previousMonthTxs, currentWeekTxs, todayTxs),
      categoryBreakdown: calculateCategoryBreakdown(currentMonthTxs, budgets),
      spendingTrends: calculateSpendingTrends(last6MonthsTxs),
      recentTransactions: getRecentTransactions(currentMonthTxs),
      insights: generateInsights(currentMonthTxs, previousMonthTxs, budgets),
      budgetStatus: calculateBudgetStatus(currentMonthTxs, budgets),
      topSpendingCategories: getTopSpendingCategories(currentMonthTxs),
    };

    res.json({
      success: true,
      data: analytics,
    });

  } catch (error) {
    console.error("Dashboard analytics error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch dashboard analytics" 
    });
  }
};

/* ---------- Calculate Overview (Main Stats) ---------- */
const calculateOverview = (currentTxs, previousTxs) => {
  const currentIncome = currentTxs
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const currentExpense = currentTxs
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const previousIncome = previousTxs
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const previousExpense = previousTxs
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = currentIncome - currentExpense;
  const savings = currentIncome > 0 ? currentIncome - currentExpense : 0;
  const savingsRate = currentIncome > 0 ? (savings / currentIncome) * 100 : 0;

  const incomeChange = previousIncome > 0 
    ? ((currentIncome - previousIncome) / previousIncome) * 100 
    : 0;

  const expenseChange = previousExpense > 0 
    ? ((currentExpense - previousExpense) / previousExpense) * 100 
    : 0;

  const savingsChange = previousIncome > 0
    ? (((currentIncome - currentExpense) - (previousIncome - previousExpense)) / (previousIncome - previousExpense)) * 100
    : 0;

  return {
    currentMonth: {
      income: Math.round(currentIncome),
      expense: Math.round(currentExpense),
      balance: Math.round(balance),
      savings: Math.round(savings),
      savingsRate: Math.round(savingsRate * 10) / 10,
    },
    previousMonth: {
      income: Math.round(previousIncome),
      expense: Math.round(previousExpense),
      balance: Math.round(previousIncome - previousExpense),
      savings: Math.round(previousIncome - previousExpense),
    },
    changes: {
      income: Math.round(incomeChange * 10) / 10,
      expense: Math.round(expenseChange * 10) / 10,
      savings: Math.round(savingsChange * 10) / 10,
    },
  };
};

/* ---------- Calculate Quick Stats ---------- */
const calculateQuickStats = (monthTxs, prevMonthTxs, weekTxs, todayTxs) => {
  const todaySpending = todayTxs
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const weekSpending = weekTxs
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const avgDailySpending = monthTxs.length > 0
    ? monthTxs.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0) / new Date().getDate()
    : 0;

  const transactionCount = {
    today: todayTxs.length,
    week: weekTxs.length,
    month: monthTxs.length,
  };

  return {
    todaySpending: Math.round(todaySpending),
    weekSpending: Math.round(weekSpending),
    avgDailySpending: Math.round(avgDailySpending),
    transactionCount,
  };
};

/* ---------- Calculate Category Breakdown ---------- */
const calculateCategoryBreakdown = (transactions, budgets) => {
  const categoryMap = {};

  // Calculate spending by category
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = {
          name: t.category,
          spent: 0,
          budget: 0,
          percentage: 0,
          count: 0,
        };
      }
      categoryMap[t.category].spent += t.amount;
      categoryMap[t.category].count += 1;
    });

  // Add budget information
  budgets.forEach(b => {
    const category = b.type === "overall" ? "Overall" : b.category;
    if (categoryMap[category]) {
      categoryMap[category].budget = b.limit;
      categoryMap[category].percentage = (categoryMap[category].spent / b.limit) * 100;
    }
  });

  // Convert to array and sort by spending
  const categories = Object.values(categoryMap)
    .map(cat => ({
      ...cat,
      spent: Math.round(cat.spent),
      percentage: Math.round(cat.percentage * 10) / 10,
    }))
    .sort((a, b) => b.spent - a.spent);

  return categories;
};

/* ---------- Calculate Spending Trends (Last 6 Months) ---------- */
const calculateSpendingTrends = (transactions) => {
  const monthMap = {};

  transactions.forEach(t => {
    if (t.type !== "expense") return;

    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    if (!monthMap[key]) {
      monthMap[key] = {
        month: monthName,
        year: date.getFullYear(),
        amount: 0,
        date: new Date(date.getFullYear(), date.getMonth(), 1),
      };
    }
    monthMap[key].amount += t.amount;
  });

  return Object.values(monthMap)
    .sort((a, b) => a.date - b.date)
    .slice(-6)
    .map(m => ({
      month: m.month,
      year: m.year,
      amount: Math.round(m.amount),
    }));
};

/* ---------- Get Recent Transactions ---------- */
const getRecentTransactions = (transactions) => {
  return transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10)
    .map(t => ({
      id: t._id,
      description: t.description || t.category,
      category: t.category,
      amount: t.type === "expense" ? -t.amount : t.amount,
      type: t.type,
      date: t.date,
      icon: getCategoryIcon(t.category),
    }));
};

/* ---------- Get Category Icon ---------- */
const getCategoryIcon = (category) => {
  const icons = {
    "Food & Dining": "🍔",
    "Transport": "🚗",
    "Transportation": "🚗",
    "Shopping": "🛍️",
    "Entertainment": "🎬",
    "Bills & Utilities": "💡",
    "Healthcare": "🏥",
    "Education": "📚",
    "Salary": "💰",
    "Income": "💰",
    "Other": "📌",
  };
  return icons[category] || "💳";
};

/* ---------- Generate Insights ---------- */
const generateInsights = (currentTxs, previousTxs, budgets) => {
  const insights = [];

  // Calculate category spending
  const currentCategorySpending = {};
  const previousCategorySpending = {};

  currentTxs.filter(t => t.type === "expense").forEach(t => {
    currentCategorySpending[t.category] = (currentCategorySpending[t.category] || 0) + t.amount;
  });

  previousTxs.filter(t => t.type === "expense").forEach(t => {
    previousCategorySpending[t.category] = (previousCategorySpending[t.category] || 0) + t.amount;
  });

  // Find biggest increase
  let maxIncrease = { category: "", percent: 0, amount: 0 };
  Object.keys(currentCategorySpending).forEach(cat => {
    const current = currentCategorySpending[cat];
    const previous = previousCategorySpending[cat] || 0;
    if (previous > 0) {
      const increase = ((current - previous) / previous) * 100;
      if (increase > maxIncrease.percent && increase > 15) {
        maxIncrease = { category: cat, percent: increase, amount: current - previous };
      }
    }
  });

  if (maxIncrease.category) {
    insights.push({
      type: "alert",
      title: "Spending Spike Detected",
      message: `You spent ${Math.round(maxIncrease.percent)}% more on ${maxIncrease.category} this month`,
      details: `That's ₹${Math.round(maxIncrease.amount).toLocaleString()} more than last month`,
      icon: "📈",
      priority: "high",
    });
  }

  // Budget alerts
  budgets.forEach(b => {
    const spent = b.type === "overall" 
      ? Object.values(currentCategorySpending).reduce((sum, val) => sum + val, 0)
      : (currentCategorySpending[b.category] || 0);
    
    const percentage = (spent / b.limit) * 100;
    
    if (percentage > 90) {
      insights.push({
        type: "warning",
        title: `${b.category || 'Overall'} Budget Alert`,
        message: `You've used ${Math.round(percentage)}% of your budget`,
        details: `₹${Math.round(spent).toLocaleString()} of ₹${b.limit.toLocaleString()}`,
        icon: "⚠️",
        priority: "high",
      });
    }
  });

  // Positive insights
  const currentTotal = Object.values(currentCategorySpending).reduce((sum, val) => sum + val, 0);
  const previousTotal = Object.values(previousCategorySpending).reduce((sum, val) => sum + val, 0);
  
  if (currentTotal < previousTotal) {
    const saved = previousTotal - currentTotal;
    insights.push({
      type: "success",
      title: "Great Job! Spending Down",
      message: `You spent ${Math.round(((saved / previousTotal) * 100))}% less this month`,
      details: `You saved ₹${Math.round(saved).toLocaleString()} compared to last month`,
      icon: "🎉",
      priority: "medium",
    });
  }

  return insights.slice(0, 3);
};

/* ---------- Calculate Budget Status ---------- */
const calculateBudgetStatus = (transactions, budgets) => {
  if (budgets.length === 0) return null;

  const categorySpending = {};
  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
    });

  const budgetStatus = budgets.map(b => {
    const spent = b.type === "overall"
      ? Object.values(categorySpending).reduce((sum, val) => sum + val, 0)
      : (categorySpending[b.category] || 0);
    
    const percentage = (spent / b.limit) * 100;
    
    return {
      category: b.type === "overall" ? "Overall" : b.category,
      spent: Math.round(spent),
      limit: b.limit,
      remaining: Math.round(b.limit - spent),
      percentage: Math.round(percentage * 10) / 10,
      status: percentage >= 100 ? "exceeded" : percentage >= 80 ? "warning" : "safe",
    };
  });

  return budgetStatus.sort((a, b) => b.percentage - a.percentage);
};

/* ---------- Get Top Spending Categories ---------- */
const getTopSpendingCategories = (transactions) => {
  const categoryMap = {};

  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = { name: t.category, total: 0, count: 0 };
      }
      categoryMap[t.category].total += t.amount;
      categoryMap[t.category].count += 1;
    });

  return Object.values(categoryMap)
    .map(cat => ({
      ...cat,
      total: Math.round(cat.total),
      average: Math.round(cat.total / cat.count),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);
};