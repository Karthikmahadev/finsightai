"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Trash2, 
  BarChart3, 
  X, 
  PlusCircle, 
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  Zap,
  ArrowRight,
  Info,
  Clock,
  Award,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";

/* ---------------- TYPES ---------------- */

interface Budget {
  _id: string;
  type: "overall" | "category";
  category: string | null;
  limit: number;
}

interface Usage {
  category: string;
  spent: number;
  limit: number;
  percentage: number;
  previousSpent: number;
  monthChange: number;
  status: "safe" | "warning" | "exceeded";
}

interface Insights {
  healthSummary: {
    status: string;
    message: string;
    icon: string;
    score: number;
    exceededCount: number;
    warningCount: number;
    safeCount: number;
    totalBudgets: number;
  };
  monthProgress: {
    currentDay: number;
    totalDays: number;
    daysRemaining: number;
    percentage: number;
    message: string;
    remainingMessage: string;
  };
  predictions: Array<{
    type: string;
    category: string;
    message: string;
    icon: string;
    projectedSpending?: number;
    daysToExceed?: number;
  }>;
  trends: Array<{
    category: string;
    change: number;
    direction: string;
    icon: string;
    message: string;
    previousAmount: number;
    currentAmount: number;
  }>;
  topSpenders: Array<{
    category: string;
    spent: number;
    limit: number;
    percentage: number;
  }>;
  quickStats: {
    totalSpent: number;
    totalLimit: number;
    totalRemaining: number;
    utilizationRate: number;
  };
  recommendations: Array<{
    title: string;
    description: string;
    action: string;
    priority: string;
    icon: string;
  }>;
}

/* ---------------- CONSTANTS ---------------- */

const categories = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Other",
];

const now = new Date();
const month = now.getMonth();
const year = now.getFullYear();

/* ================= COMPONENT ================= */

const BudgetsData = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [usage, setUsage] = useState<Usage[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: "category",
    category: "",
    limit: "",
  });

  /* ---------------- FETCH ---------------- */

  const fetchBudgets = async () => {
    try {
      setFetchLoading(true);

      const [bRes, uRes] = await Promise.all([
        api(`/api/budgets?month=${month}&year=${year}`),
        api(`/api/budgets/usage?month=${month}&year=${year}`),
      ]);

      if (bRes.success) setBudgets(bRes.data.data || []);
      if (uRes.success) {
        setUsage(uRes.data.data || []);
        setInsights(uRes.data.insights || null);
      }
    } catch {
      toast.error("Failed to fetch budgets");
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  /* ---------------- SAVE ---------------- */

  const handleSave = async () => {
    if (!formData.limit) {
      toast.error("Please enter budget limit");
      return;
    }

    if (formData.type === "category" && !formData.category) {
      toast.error("Please select a category");
      return;
    }

    setLoading(true);

    const res = await api("/api/budgets", {
      method: "POST",
      body: JSON.stringify({
        type: formData.type,
        category: formData.type === "category" ? formData.category : null,
        limit: Number(formData.limit),
        month,
        year,
      }),
    });

    if (res.success) {
      toast.success("Budget saved successfully 🎯");
      setShowModal(false);
      setFormData({ type: "category", category: "", limit: "" });
      fetchBudgets();
    } else {
      toast.error(res.message || "Failed to save budget");
    }

    setLoading(false);
  };

  /* ---------------- DELETE ---------------- */

  const confirmDelete = async () => {
    if (!deleteId) return;

    const res = await api(`/api/budgets/${deleteId}`, {
      method: "DELETE",
    });

    if (res.success) {
      toast.success("Budget deleted");
      fetchBudgets();
    } else {
      toast.error("Failed to delete budget");
    }

    setDeleteId(null);
  };

  /* ================= EMPTY STATE ================= */

  const EmptyState = () => (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="relative max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-slate-100 overflow-hidden text-center">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />

        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          No budgets yet
        </h2>

        <p className="text-slate-500 mb-6 leading-relaxed">
          Set monthly budgets to track spending and unlock smart alerts &
          insights.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white font-medium hover:bg-slate-800 transition"
          >
            <PlusCircle className="w-5 h-5" />
            Add budget
          </button>

          <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition">
            <Sparkles className="w-5 h-5 text-violet-600" />
            Ask FinSight
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-6">It only takes a minute ✨</p>
      </div>
    </div>
  );

  /* ================= LOADING ================= */

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading budgets...</p>
        </div>
      </div>
    );
  }

  if (!fetchLoading && budgets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <EmptyState />
        {showModal && renderModal()}
      </div>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:p-4">
      <div className="mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Budgets</h1>
            <p className="text-slate-500 mt-1">
              Plan & control your monthly spending
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-black text-white font-medium rounded-lg  transition-all shadow-lg shadow-blue-600/30"
          >
            <Plus className="w-4 h-4" />
            Add Budget
          </button>
        </div>

        {/* BUDGET HEALTH SUMMARY + MONTH PROGRESS */}
        {insights && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* BUDGET HEALTH SUMMARY */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-1">Budget Health</h2>
                  <p className="text-sm text-slate-500">Overall financial status</p>
                </div>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                  insights.healthSummary.status === 'excellent' ? 'bg-emerald-100' :
                  insights.healthSummary.status === 'warning' ? 'bg-yellow-100' :
                  insights.healthSummary.status === 'critical' ? 'bg-rose-100' :
                  'bg-slate-100'
                }`}>
                  {insights.healthSummary.icon}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className={`text-3xl font-bold ${
                    insights.healthSummary.status === 'excellent' ? 'text-emerald-600' :
                    insights.healthSummary.status === 'warning' ? 'text-yellow-600' :
                    insights.healthSummary.status === 'critical' ? 'text-rose-600' :
                    'text-slate-600'
                  }`}>
                    {insights.healthSummary.score}
                  </span>
                  <span className="text-slate-500 font-medium">/100</span>
                </div>
                <p className="text-slate-700 font-medium">{insights.healthSummary.message}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-emerald-700">{insights.healthSummary.safeCount}</div>
                  <div className="text-xs text-emerald-600">Safe</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-yellow-700">{insights.healthSummary.warningCount}</div>
                  <div className="text-xs text-yellow-600">At Risk</div>
                </div>
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-center">
                  <X className="w-5 h-5 text-rose-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-rose-700">{insights.healthSummary.exceededCount}</div>
                  <div className="text-xs text-rose-600">Exceeded</div>
                </div>
              </div>
            </div>

            {/* MONTH PROGRESS */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 mb-1">Month Progress</h2>
                  <p className="text-sm text-slate-500">Time-based insights</p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-blue-600" />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold text-blue-600">
                    {insights.monthProgress.currentDay}
                  </span>
                  <span className="text-slate-500 font-medium">/ {insights.monthProgress.totalDays} days</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-violet-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${insights.monthProgress.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {insights.monthProgress.remainingMessage}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Total Spent</div>
                  <div className="text-xl font-bold text-slate-800">
                    ₹{insights.quickStats.totalSpent.toLocaleString()}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="text-xs text-slate-500 mb-1">Remaining</div>
                  <div className="text-xl font-bold text-emerald-600">
                    ₹{insights.quickStats.totalRemaining.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PREDICTIONS & TRENDS */}
        {insights && (insights.predictions.length > 0 || insights.trends.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SMART PREDICTIONS */}
            {insights.predictions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-violet-600" />
                  <h2 className="text-lg font-bold text-slate-800">Smart Predictions</h2>
                </div>
                <div className="space-y-3">
                  {insights.predictions.map((pred, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-xl border-2 ${
                        pred.type === 'warning' 
                          ? 'bg-yellow-50 border-yellow-200' 
                          : 'bg-emerald-50 border-emerald-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{pred.icon}</div>
                        <div className="flex-1">
                          <p className={`font-semibold mb-1 ${
                            pred.type === 'warning' ? 'text-yellow-800' : 'text-emerald-800'
                          }`}>
                            {pred.message}
                          </p>
                          {pred.daysToExceed && (
                            <p className="text-sm text-yellow-700">
                              Projected in {pred.daysToExceed} days at current pace
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MONTH-OVER-MONTH TRENDS */}
            {insights.trends.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-800">Spending Trends</h2>
                </div>
                <div className="space-y-3">
                  {insights.trends.slice(0, 4).map((trend, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="text-xl">{trend.icon}</div>
                        <div>
                          <p className="font-medium text-slate-800">{trend.category}</p>
                          <p className="text-xs text-slate-500">
                            ₹{trend.previousAmount.toLocaleString()} → ₹{trend.currentAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className={`text-right ${
                        trend.direction === 'up' ? 'text-rose-600' : 
                        trend.direction === 'down' ? 'text-emerald-600' : 
                        'text-slate-600'
                      }`}>
                        <p className="font-bold">{trend.change > 0 ? '+' : ''}{trend.change.toFixed(1)}%</p>
                        {trend.direction === 'up' ? (
                          <TrendingUp className="w-4 h-4 ml-auto" />
                        ) : trend.direction === 'down' ? (
                          <TrendingDown className="w-4 h-4 ml-auto" />
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* RECOMMENDATIONS */}
        {insights && insights.recommendations.length > 0 && (
          <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-2xl shadow-lg border-2 border-violet-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-violet-600" />
              <h2 className="text-lg font-bold text-slate-800">FinSight Recommendations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.recommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-xl p-4 border border-violet-200 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="text-2xl">{rec.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 mb-1">{rec.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                      <div className="flex items-center gap-2 text-violet-600 text-sm font-medium group-hover:gap-3 transition-all">
                        <span>{rec.action}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BUDGETS GRID */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Your Budgets</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {budgets.map((b) => {
              const u = usage.find((x) => x.category === b.category);
              const percent = u?.percentage || 0;

              return (
                <div
                  key={b._id}
                  className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg">
                        {b.type === "overall" ? "Overall Budget" : b.category}
                      </h3>
                      {u && u.monthChange !== 0 && (
                        <p className={`text-xs flex items-center gap-1 mt-1 ${
                          u.monthChange > 0 ? 'text-rose-600' : 'text-emerald-600'
                        }`}>
                          {u.monthChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(u.monthChange).toFixed(1)}% vs last month
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setDeleteId(b._id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-2xl font-bold text-slate-800">
                        ₹{(u?.spent || 0).toLocaleString()}
                      </span>
                      <span className="text-sm text-slate-500">
                        of ₹{b.limit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 100
                          ? "bg-gradient-to-r from-red-500 to-red-600"
                          : percent >= 80
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500"
                          : "bg-gradient-to-r from-emerald-400 to-emerald-500"
                      }`}
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      {Math.round(percent)}% used
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      u?.status === 'exceeded' ? 'bg-rose-100 text-rose-700' :
                      u?.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {u?.status === 'exceeded' ? 'Exceeded' :
                       u?.status === 'warning' ? 'At Risk' :
                       'On Track'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>


      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDeleteId(null)}
          />
          <div className="bg-white rounded-xl p-6 z-10 w-full max-w-sm">
            <h3 className="text-lg font-bold mb-2">Delete Budget?</h3>
            <p className="text-slate-500 mb-4">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border rounded-lg py-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white rounded-lg py-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && renderModal()}
    </div>
  );

  /* ================= MODAL ================= */

  function renderModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        />
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800">Add Budget</h2>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="p-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Choose Budget
                  </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
            >
              <option value="category">Category Budget</option>
              <option value="overall">Overall Budget</option>
            </select>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category
                  </label>
            {formData.type === "category" && (
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}

<label className="block text-sm font-semibold text-slate-700 mb-2">
                    Monthly Limit
                  </label>
            <input
              type="number"
              placeholder="Monthly limit (₹)"
              value={formData.limit}
              onChange={(e) =>
                setFormData({ ...formData, limit: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg"
            />

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-slate-300 rounded-lg py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-black text-white rounded-lg py-2 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Budget"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default BudgetsData;
