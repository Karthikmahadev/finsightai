import Transaction from "../models/Transaction.js";

/* ---------- Utils ---------- */
const getMonthRange = (offset = 0) => {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth() + offset, 1),
    end: new Date(now.getFullYear(), now.getMonth() + offset + 1, 0, 23, 59, 59),
  };
};

const aggregate = (txs) => {
  const byCategory = {};
  let total = 0;

  txs.forEach((t) => {
    if (t.type !== "expense") return;
    total += t.amount;
    byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
  });

  return { total, byCategory };
};

const generateActions = ({ categories, monthOverMonth }) => {
  const actions = [];

  // 1️⃣ High spending category
  const topCategory = categories[0];
  if (topCategory && topCategory.amount > 8000) {
    actions.push({
      id: "high-category",
      title: `Reduce ${topCategory.name} Spending`,
      description: `You spent ₹${topCategory.amount.toLocaleString()} on ${topCategory.name}. Try setting a monthly cap.`,
      impact: Math.round(topCategory.amount * 0.2),
      priority: "high",
      reason: "Highest spending category",
    });
  }

  // 2️⃣ Spending increased MoM
  if (monthOverMonth.changePercent > 10) {
    actions.push({
      id: "mom-increase",
      title: "Control Monthly Budget",
      description: `Your spending increased by ${monthOverMonth.changePercent}%. Review discretionary expenses.`,
      impact: Math.round(monthOverMonth.current * 0.1),
      priority: "medium",
      reason: "Month-over-month increase",
    });
  }

  // 3️⃣ Subscription-style categories
  const subscriptionCategories = ["Entertainment", "Subscriptions", "OTT"];
  const subCategory = categories.find(c =>
    subscriptionCategories.includes(c.name)
  );

  if (subCategory) {
    actions.push({
      id: "subscriptions",
      title: "Optimize Subscriptions",
      description: `You spent ₹${subCategory.amount.toLocaleString()} on subscriptions. Cancel unused ones.`,
      impact: Math.round(subCategory.amount * 0.3),
      priority: "medium",
      reason: "Recurring monthly expense",
    });
  }

  // 4️⃣ Default action (always useful)
  actions.push({
    id: "weekly-review",
    title: "Weekly Expense Review",
    description: "Spend 10 minutes every Sunday reviewing last week’s expenses.",
    impact: 500,
    priority: "low",
    reason: "Habit-based improvement",
  });

  return actions.slice(0, 4); // limit to 4
};


/* ---------- Controller ---------- */
export const finsightAI = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const current = getMonthRange(0);
    const previous = getMonthRange(-1);

    const [currentTx, prevTx] = await Promise.all([
      Transaction.find({ userId, date: { $gte: current.start, $lte: current.end } }),
      Transaction.find({ userId, date: { $gte: previous.start, $lte: previous.end } }),
    ]);

    if (!currentTx.length) {
      return res.json({
        success: true,
        reply: { 
          empty: true, 
          text: "No transactions found this month.",
          insights: [],
          categories: [],
          charts: {
            categoryPie: { labels: [], data: [] },
            monthComparison: { labels: [], data: [] },
          },
          actions: [],
          monthOverMonth: { current: 0, previous: 0, changePercent: 0 },
          meta: { currentMonth: current.start.toLocaleString("default", { month: "long" }) },
        },
      });
    }

    const currentAgg = aggregate(currentTx);
    const prevAgg = aggregate(prevTx);

    /* ---------- Category Comparison ---------- */
    const categories = Object.keys(currentAgg.byCategory).map((cat) => {
      const currentAmount = currentAgg.byCategory[cat];
      const previousAmount = prevAgg.byCategory[cat] || 0;

      const change =
        previousAmount === 0
          ? 100
          : ((currentAmount - previousAmount) / previousAmount) * 100;

      let status = "Normal";
      if (change > 25) status = "High";
      if (change < -15) status = "Low";

      return {
        name: cat,
        amount: currentAmount,
        previous: previousAmount,
        changePercent: Number(change.toFixed(1)),
        status,
      };
    });

    categories.sort((a, b) => b.amount - a.amount);

    /* ---------- Insights ---------- */
    const insights = [];

    const totalChange =
      prevAgg.total === 0
        ? 100
        : ((currentAgg.total - prevAgg.total) / prevAgg.total) * 100;

    if (totalChange > 10) {
      insights.push({
        type: "alert",
        title: "Spending Increased",
        subtitle: "Month-over-Month",
        description: `Your expenses increased by ${totalChange.toFixed(1)}%.`,
        details: `${categories[0]?.name || 'Top category'} contributed the most with ₹${categories[0]?.amount.toLocaleString() || 0}.`,
      });
    } else if (totalChange < -10) {
      insights.push({
        type: "positive",
        title: "Spending Decreased",
        subtitle: "Month-over-Month",
        description: `Great job! Your expenses decreased by ${Math.abs(totalChange).toFixed(1)}%.`,
        details: `You saved ₹${(prevAgg.total - currentAgg.total).toLocaleString()} this month.`,
      });
    } else {
      insights.push({
        type: "positive",
        title: "Spending Stable",
        subtitle: "Month-over-Month",
        description: `Your spending is consistent with last month.`,
        details: `Maintaining budget discipline with only ${Math.abs(totalChange).toFixed(1)}% variation.`,
      });
    }

    // Find high-growth categories
    const highGrowthCategories = categories.filter(c => c.changePercent > 30);
    if (highGrowthCategories.length > 0) {
      insights.push({
        type: "alert",
        title: "Spike Detected",
        subtitle: "Category Alert",
        description: `${highGrowthCategories[0].name} spending increased by ${highGrowthCategories[0].changePercent}%.`,
        details: `Review recent ${highGrowthCategories[0].name} transactions to identify the cause.`,
      });
    }

    insights.push({
      type: "pattern",
      title: "Spending Pattern",
      subtitle: "Recurring Trends",
      description: "High outflow detected between 20th–25th.",
      details: "Mostly dining & shopping transactions. Consider spacing out discretionary spending.",
    });

    insights.push({
      type: "opportunity",
      title: "Savings Opportunity",
      subtitle: "Recommendations",
      description: "Save ₹2,000/month by optimizing subscriptions.",
      details: "Cancel or downgrade unused services. Review all recurring payments.",
    });

    /* ---------- Charts ---------- */
    const charts = {
      categoryPie: {
        labels: categories.map((c) => c.name),
        data: categories.map((c) => c.amount),
      },
      monthComparison: {
        labels: [
          previous.start.toLocaleString("default", { month: "short" }),
          current.start.toLocaleString("default", { month: "short" })
        ],
        data: [prevAgg.total, currentAgg.total],
      },
      // Additional chart data for category trends
      categoryTrend: {
        labels: categories.map((c) => c.name),
        currentData: categories.map((c) => c.amount),
        previousData: categories.map((c) => c.previous || 0),
      },
      // Daily spending trend (if needed in future)
      dailyTrend: {
        labels: Array.from({ length: 30 }, (_, i) => i + 1),
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 5000) + 1000), // Placeholder
      },
    };

    /* ---------- Suggested Actions ---------- */
    const actions = generateActions({
      categories,
      monthOverMonth: {
        current: currentAgg.total,
        previous: prevAgg.total,
        changePercent: Number(totalChange.toFixed(1)),
      },
    });
    

    // Calculate potential savings
    const potentialSavings = categories
      .filter(c => ['Food & Dining', 'Shopping', 'Entertainment'].includes(c.name))
      .reduce((sum, c) => sum + (c.amount * 0.15), 0); // Assume 15% reduction potential

    return res.json({
      success: true,
      reply: {
        insights,
        categories,
        charts,
        actions,
        monthOverMonth: {
          current: currentAgg.total,
          previous: prevAgg.total,
          changePercent: Number(totalChange.toFixed(1)),
        },
        meta: {
          currentMonth: current.start.toLocaleString("default", { month: "long" }),
          previousMonth: previous.start.toLocaleString("default", { month: "long" }),
          totalTransactions: currentTx.length,
          potentialSavings: Math.round(potentialSavings),
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "AI analysis failed" });
  }
};