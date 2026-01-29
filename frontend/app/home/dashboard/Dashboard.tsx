"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  IndianRupee,
  CreditCard,
  PiggyBank,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Calendar,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Award,
  Zap,
  ShoppingCart,
  Car,
  Film,
  Utensils,
  HeartPulse,
  Lightbulb,
  BookOpen,
  HelpCircle,
} from "lucide-react";



import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import DashboardEmptyState from "./DashboardEmptyState";

/* ---------- TYPES ---------- */
interface DashboardData {
  overview: {
    currentMonth: {
      income: number;
      expense: number;
      balance: number;
      savings: number;
      savingsRate: number;
    };
    previousMonth: {
      income: number;
      expense: number;
      balance: number;
      savings: number;
    };
    changes: {
      income: number;
      expense: number;
      savings: number;
    };
  };
  quickStats: {
    todaySpending: number;
    weekSpending: number;
    avgDailySpending: number;
    transactionCount: {
      today: number;
      week: number;
      month: number;
    };
  };
  categoryBreakdown: Array<{
    name: string;
    spent: number;
    budget: number;
    percentage: number;
    count: number;
  }>;
  spendingTrends: Array<{
    month: string;
    year: number;
    amount: number;
  }>;
  recentTransactions: Array<{
    id: string;
    description: string;
    category: string;
    amount: number;
    type: string;
    date: string;
    icon: string;
  }>;
  insights: Array<{
    type: string;
    title: string;
    message: string;
    details: string;
    icon: string;
    priority: string;
  }>;
  budgetStatus: Array<{
    category: string;
    spent: number;
    limit: number;
    remaining: number;
    percentage: number;
    status: string;
  }> | null;
  topSpendingCategories: Array<{
    name: string;
    total: number;
    count: number;
    average: number;
  }>;
}

/* ---------- SKELETON ---------- */
function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-36 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-slate-200 rounded-2xl" />
        <div className="h-80 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );
}

/* ---------- MAIN COMPONENT ---------- */
const Dashboard = () => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"trends" | "categories">("trends");


  
  /* ---------- FETCH DATA ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/signin");
      return;
    }

    const fetchDashboard = async () => {
      setLoading(true);
      const res = await api<{ data: DashboardData }>("/api/dashboard/analytics");

      if (res.success && res.data) {
        setDashboardData(res.data.data);
      }
      setLoading(false);
    };

    fetchDashboard();
  }, [router]);

  /* ---------- RENDER STATES ---------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!dashboardData || dashboardData.recentTransactions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <DashboardEmptyState />
      </div>
    );
  }

  const { overview, quickStats, categoryBreakdown, spendingTrends, recentTransactions, insights, budgetStatus, topSpendingCategories } = dashboardData;

  /* ---------- FORMAT FUNCTIONS ---------- */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount).replace('₹', '');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
  };

  /* ---------- STATS CARDS DATA ---------- */
  const statsCards = [
    {
      label: "Total Balance",
      value: formatCurrency(overview.currentMonth.balance),
      icon: Wallet,
      color: "from-violet-500 to-purple-500",
      change: overview.previousMonth.balance !== 0 
        ? ((overview.currentMonth.balance - overview.previousMonth.balance) / Math.abs(overview.previousMonth.balance) * 100).toFixed(1)
        : "0.0",
      trend: overview.currentMonth.balance >= overview.previousMonth.balance ? "up" : "down",
    },
    {
      label: "Monthly Income",
      value: formatCurrency(overview.currentMonth.income),
      icon: TrendingUp,
      color: "from-emerald-500 to-green-500",
      change: overview.changes.income.toFixed(1),
      trend: overview.changes.income >= 0 ? "up" : "down",
    },
    {
      label: "Monthly Expense",
      value: formatCurrency(overview.currentMonth.expense),
      icon: Receipt,
      color: "from-rose-500 to-pink-500",
      change: overview.changes.expense.toFixed(1),
      trend: overview.changes.expense >= 0 ? "up" : "down",
    },
    {
      label: "Monthly Savings",
      value: formatCurrency(overview.currentMonth.savings),
      icon: PiggyBank,
      color: "from-amber-500 to-orange-500",
      change: overview.currentMonth.savingsRate.toFixed(1),
      subtext: `${overview.currentMonth.savingsRate.toFixed(1)}% of income`,
    },
  ];

  const getTransactionIcon = (category: string) => {
    const iconProps = "w-5 h-5 text-slate-600";
  
    switch (category) {
      case "Food & Dining":
        return <Utensils className={iconProps} />;
      case "Transport":
        return <Car className={iconProps} />;
      case "Entertainment":
        return <Film className={iconProps} />;
      case "Shopping":
        return <ShoppingCart className={iconProps} />;
      case "Healthcare":
        return <HeartPulse className={iconProps} />;
      case "Bills & Utilities":
        return <Lightbulb className={iconProps} />;
      case "Education":
        return <BookOpen className={iconProps} />;
      case "Income":
        return <IndianRupee className={iconProps} />;
      default:
        return <HelpCircle className={iconProps} />;
    }
  };
  

  /* ---------- RENDER ---------- */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="min-h-screen p-4 lg:p-8 space-y-6">
        
        {/* AI INSIGHTS BANNER */}
        {insights.length > 0 && (
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
            
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-semibold">FinSight Analysis</span>
              </div>

              {insights[0].type === "alert" && (
                <>
                  <p className="text-xl font-bold mb-2">{insights[0].message}</p>
                  <p className="text-white/90 mb-4">{insights[0].details}</p>
                </>
              )}

              {insights[0].type === "success" && (
                <>
                  <p className="text-xl font-bold mb-2">{insights[0].title}</p>
                  <p className="text-white/90 mb-4">{insights[0].message}</p>
                </>
              )}

              {insights.length > 1 && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">{insights[1].title}</p>
                      <p className="text-sm text-white/80">{insights[1].message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statsCards.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-100 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.change && (
                  <div className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.trend === "up" && stat.label !== "Monthly Expense"
                      ? "text-emerald-600"
                      : stat.trend === "down" && stat.label === "Monthly Expense"
                      ? "text-emerald-600"
                      : "text-rose-600"
                  }`}>
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {Math.abs(parseFloat(stat.change))}%
                  </div>
                )}
              </div>
              <div className="text-sm text-slate-500 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-800 flex items-center gap-1">
                <IndianRupee className="w-5 h-5" />
                {stat.value}
              </div>
              {stat.subtext && (
                <div className="text-xs text-slate-400 mt-2">{stat.subtext}</div>
              )}
            </div>
          ))}
        </div>

        {/* QUICK STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Today's Spending</p>
                <p className="text-lg font-bold text-slate-800">₹{formatCurrency(quickStats.todaySpending)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-100 rounded-lg">
                <Calendar className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">This Week</p>
                <p className="text-lg font-bold text-slate-800">₹{formatCurrency(quickStats.weekSpending)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Avg Daily Spend</p>
                <p className="text-lg font-bold text-slate-800">₹{formatCurrency(quickStats.avgDailySpending)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SPENDING TRENDS / TOP CATEGORIES */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {activeTab === "trends" ? "Spending Trends" : "Top Categories"}
                </h3>
                <p className="text-sm text-slate-500">
                  {activeTab === "trends" ? "Last 6 months overview" : "Your highest spending areas"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("trends")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "trends"
                      ? "bg-violet-100 text-violet-600"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Trends
                </button>
                <button
                  onClick={() => setActiveTab("categories")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === "categories"
                      ? "bg-violet-100 text-violet-600"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Categories
                </button>
              </div>
            </div>

            {activeTab === "trends" && spendingTrends.length > 0 && (
              <div className="h-64 flex items-end justify-between gap-3">
                {spendingTrends.map((trend, idx) => {
                  const maxAmount = Math.max(...spendingTrends.map(t => t.amount));
                  const height = (trend.amount / maxAmount) * 100;
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex flex-col items-center">
                        <span className="text-xs font-semibold text-slate-700 mb-1">
                          ₹{(trend.amount / 1000).toFixed(0)}k
                        </span>
                        <div
                          className="w-full bg-gradient-to-t from-violet-500 to-purple-400 rounded-t-lg transition-all duration-500 hover:from-violet-600 hover:to-purple-500 cursor-pointer"
                          style={{ height: `${height}%`, minHeight: "20px" }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-500">{trend.month}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "categories" && topSpendingCategories.length > 0 && (
              <div className="space-y-4">
                {topSpendingCategories.map((cat, idx) => {
                  const maxTotal = topSpendingCategories[0].total;
                  const percentage = (cat.total / maxTotal) * 100;
                  
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{cat.name}</p>
                            <p className="text-xs text-slate-500">{cat.count} transactions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-800">₹{formatCurrency(cat.total)}</p>
                          <p className="text-xs text-slate-500">Avg: ₹{formatCurrency(cat.average)}</p>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* BUDGET STATUS / RECENT TRANSACTIONS */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                {budgetStatus && budgetStatus.length > 0 ? "Budget Status" : "Recent Activity"}
              </h3>
              <button 
                onClick={() => router.push(budgetStatus && budgetStatus.length > 0 ? "/home/budgets" : "/home/transactions")}
                className="text-violet-600 text-sm font-medium hover:underline"
              >
                View All
              </button>
            </div>

            {budgetStatus && budgetStatus.length > 0 ? (
              <div className="space-y-4">
                {budgetStatus.slice(0, 5).map((budget, idx) => (
                  <div key={idx} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{budget.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">
                          {budget.percentage.toFixed(0)}%
                        </span>
                        {budget.status === "safe" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        {budget.status === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                        {budget.status === "exceeded" && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          budget.status === "exceeded"
                            ? "bg-gradient-to-r from-red-500 to-rose-600"
                            : budget.status === "warning"
                            ? "bg-gradient-to-r from-yellow-400 to-amber-500"
                            : "bg-gradient-to-r from-emerald-400 to-green-500"
                        }`}
                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      ₹{formatCurrency(budget.spent)} of ₹{formatCurrency(budget.limit)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentTransactions.slice(0, 8).map((tx, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-all cursor-pointer"
                  >
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
  {getTransactionIcon(tx.category)}
</div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {tx.description}
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(tx.date)}</p>
                    </div>
                    <div className={`text-sm font-bold ${
                      tx.amount < 0 ? "text-rose-600" : "text-emerald-600"
                    }`}>
                      {tx.amount < 0 ? "-" : "+"}₹{formatCurrency(Math.abs(tx.amount))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CATEGORY BREAKDOWN (if space allows) */}
        {categoryBreakdown.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Category Breakdown</h3>
                <p className="text-sm text-slate-500">Detailed spending by category</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryBreakdown.slice(0, 6).map((cat, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-xl hover:border-violet-300 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-800">{cat.name}</span>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-600">
                      {cat.count} txns
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800 mb-1">
                    ₹{formatCurrency(cat.spent)}
                  </p>
                  {cat.budget > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                        <span>{cat.percentage.toFixed(0)}% of budget</span>
                        <span>₹{formatCurrency(cat.budget)}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            cat.percentage >= 100
                              ? "bg-rose-500"
                              : cat.percentage >= 80
                              ? "bg-yellow-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;