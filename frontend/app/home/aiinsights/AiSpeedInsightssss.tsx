import { useEffect, useState } from "react";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  PiggyBank,
  Send,
  ChevronRight,
  MoreVertical,
  Flame, Zap, Lightbulb
} from "lucide-react";
import { api } from "@/lib/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

type Insight = {
  type: "alert" | "positive" | "pattern" | "opportunity";
  title: string;
  subtitle: string;
  description: string;
  details: string;
};

type Category = {
  name: string;
  amount: number;
  status: "High" | "Normal" | "Low";
  changePercent: number;
};

type Action = {
  id: string;
  title: string;
  description: string;
  impact: number;
  priority: "high" | "medium" | "low";
  reason: string;
};


type ChartData = {
  categoryPie: {
    labels: string[];
    data: number[];
  };
  monthComparison: {
    labels: string[];
    data: number[];
  };
};

const AiSpeedInsightssss = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [charts, setCharts] = useState<ChartData>({
    categoryPie: { labels: [], data: [] },
    monthComparison: { labels: [], data: [] },
  });
  const [meta, setMeta] = useState<{ currentMonth: string }>({
    currentMonth: "",
  });
  const [monthOverMonth, setMonthOverMonth] = useState<{
    current: number;
    previous: number;
    changePercent: number;
  }>({ current: 0, previous: 0, changePercent: 0 });

  const suggestedQuestions = [
    "Why did I spend more this month?",
    "Where can I cut costs?",
    "What is my highest expense category?",
  ];

  // const suggestedActions = [
  //   {
  //     title: "Set a Dining Budget",
  //     description: "Limit dining out to ₹8k next month.",
  //     icon: "🍽️",
  //   },
  //   {
  //     title: "Review Subscriptions",
  //     description: "Cancel unused streaming services.",
  //     icon: "📺",
  //   },
  //   {
  //     title: "Switch to UPI for Small Purchases",
  //     description: "Reduce transaction fees.",
  //     icon: "💳",
  //   },
  // ];

  const [actions, setActions] = useState<Action[]>([]);

  const getPriorityIcon = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return <Flame className="w-5 h-5 text-red-500" />;
      case "medium":
        return <Zap className="w-5 h-5 text-yellow-500" />;
      case "low":
      default:
        return <Lightbulb className="w-5 h-5 text-blue-500" />;
    }
  };
  
  const fetchInsights = async () => {
    setLoading(true);
    const res = await api<any>("/api/ai/finsight");

    if (res.success && res.data?.reply) {
      setInsights(res.data.reply.insights || []);
      setCategories(res.data.reply.categories || []);
      setCharts(
        res.data.reply.charts || {
          categoryPie: { labels: [], data: [] },
          monthComparison: { labels: [], data: [] },
        }
      );
      setMeta(res.data.reply.meta || {});
      
      setActions(res.data.reply.actions || []);
      setMonthOverMonth(
        res.data.reply.monthOverMonth || {
          current: 0,
          previous: 0,
          changePercent: 0,
        }
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleSubmit = () => {
    console.log("Query submitted:", query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const totalPotentialSavings = actions.reduce(
  (sum, action) => sum + (action.impact || 0),
  0
);

const actionCount = actions.length;


  const getInsightUI = (type: string) => {
    switch (type) {
      case "alert":
        return {
          icon: AlertTriangle,
          iconBg: "bg-rose-100",
          iconColor: "text-rose-600",
          color: "border-rose-200 bg-rose-50/50",
        };
      case "positive":
        return {
          icon: TrendingUp,
          iconBg: "bg-emerald-100",
          iconColor: "text-emerald-600",
          color: "border-emerald-200 bg-emerald-50/50",
        };
      default:
        return {
          icon: PiggyBank,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          color: "border-blue-200 bg-blue-50/50",
        };
    }
  };

  // Chart.js data configurations
  const pieChartData = {
    labels: charts.categoryPie.labels,
    datasets: [
      {
        label: "Spending by Category",
        data: charts.categoryPie.data,
        backgroundColor: [
          "rgba(99, 102, 241, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
          "rgba(234, 179, 8, 0.8)",
        ],
        borderColor: [
          "rgba(99, 102, 241, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(251, 146, 60, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(234, 179, 8, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const barChartData = {
    labels: charts.monthComparison.labels,
    datasets: [
      {
        label: "Total Spending",
        data: charts.monthComparison.data,
        backgroundColor: [
          "rgba(148, 163, 184, 0.8)",
          "rgba(99, 102, 241, 0.8)",
        ],
        borderColor: ["rgba(148, 163, 184, 1)", "rgba(99, 102, 241, 1)"],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const categoryTrendData = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        label: "Current Month",
        data: categories.map((c) => c.amount),
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
      {
        label: "Previous Month",
        data: categories.map(
          (c) => c.amount - (c.amount * c.changePercent) / 100
        ),
        backgroundColor: "rgba(148, 163, 184, 0.6)",
        borderColor: "rgba(148, 163, 184, 1)",
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const spendingTrendLineData = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        label: "Change %",
        data: categories.map((c) => c.changePercent),
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: categories.map((c) =>
          c.changePercent > 0 ? "rgba(239, 68, 68, 1)" : "rgba(34, 197, 94, 1)"
        ),
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: function (value: any) {
            return "₹" + value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: function (value: any) {
            return value + "%";
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-8">
      <div className="mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Spending Insights
                </h1>
                <p className="text-sm text-slate-500">
                  Analysis based on your {meta.currentMonth} transactions
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>Updated 5 mins ago</span>
              </div>
              <button
                onClick={fetchInsights}
                className="flex items-center gap-2 px-4 py-2 text-black hover:bg-violet-50 rounded-lg transition-all font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Analysis
              </button>
            </div>
          </div>
        </div>

        {/* ASK FINSIGHT */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            Ask FinSight
          </h2>

          <div className="mb-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your spending habits, trends, or how to save more..."
                className="w-full pl-12 pr-12 py-3.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
              <button
                onClick={handleSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuery(q)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-all border border-slate-200"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* INSIGHTS */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">
            Key Insights for {meta.currentMonth}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {loading ? (
              <p className="text-slate-500">Loading insights...</p>
            ) : (
              insights.map((insight, idx) => {
                const ui = getInsightUI(insight.type);
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl shadow-lg border-2 ${ui.color} p-6 hover:shadow-xl transition-all`}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div
                        className={`p-2.5 ${ui.iconBg} rounded-lg flex-shrink-0`}
                      >
                        <ui.icon className={`w-5 h-5 ${ui.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm mb-0.5">
                          {insight.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {insight.subtitle}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-slate-800 mb-3 leading-tight">
                      {insight.description}
                    </p>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {insight.details}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* CHARTS SECTION - NEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PIE CHART - Category Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                Spending Distribution
              </h2>
              <p className="text-sm text-slate-500">Category-wise breakdown</p>
            </div>
            <div className="h-80">
              {charts.categoryPie.labels.length > 0 ? (
                <Pie data={pieChartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* BAR CHART - Month Comparison */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                Month-over-Month Comparison
              </h2>
              <p className="text-sm text-slate-500">Total spending trend</p>
            </div>
            <div className="h-80">
              {charts.monthComparison.data.length > 0 ? (
                <Bar data={barChartData} options={barChartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* HORIZONTAL BAR - Category Comparison */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                Category Trends
              </h2>
              <p className="text-sm text-slate-500">
                Current vs previous month
              </p>
            </div>
            <div className="h-80">
              {categories.length > 0 ? (
                <Bar
                  data={categoryTrendData}
                  options={{
                    ...barChartOptions,
                    indexAxis: "y" as const,
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* LINE CHART - Spending Change */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                Category Growth Rate
              </h2>
              <p className="text-sm text-slate-500">
                Percentage change by category
              </p>
            </div>
            <div className="h-80">
              {categories.length > 0 ? (
                <Line data={spendingTrendLineData} options={lineChartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CATEGORY BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Category Breakdown Analysis
                </h2>
                <p className="text-sm text-slate-500">
                  Compared to your average spending profile
                </p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <MoreVertical className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              {categories.map((category, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-700">
                        {category.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold `}>
                          ₹{category.amount.toLocaleString()}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            category.status === "High"
                              ? "bg-rose-100 text-rose-700"
                              : category.status === "Low"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {category.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 text-black hover:bg-violet-50 rounded-lg transition-all font-medium flex items-center justify-center gap-2">
              View Detailed Breakdown
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ACTIONS */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                Suggested Actions
              </h2>
              <p className="text-sm text-slate-500">
                Personalized recommendations to improve your finances
              </p>
            </div>

            <div className="space-y-3">
              {actions.map((action, idx) => (
                <div
                key={action.id}
                className="flex items-start gap-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-xl hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                {getPriorityIcon(action.priority)}

                </div>
              
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                    {action.title}
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </h3>
              
                  <p className="text-sm text-slate-600 mb-1">
                    {action.description}
                  </p>
              
                  <p className="text-xs text-slate-500">
                    Potential savings: ₹{action.impact.toLocaleString()} / month
                  </p>
                </div>
              </div>
              
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Tip</p>

{actionCount > 0 ? (
  <p>
    Implementing these{" "}
    <span className="font-semibold">{actionCount}</span>{" "}
    action{actionCount > 1 ? "s" : ""} could save you approximately{" "}
    <span className="font-semibold">
      ₹{totalPotentialSavings.toLocaleString()}
    </span>{" "}
    next month.
  </p>
) : (
  <p>
    Your spending looks well balanced this month. Keep maintaining
    your current habits!
  </p>
)}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSpeedInsightssss;
