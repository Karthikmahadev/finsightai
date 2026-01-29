import { useEffect, useState } from "react";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  PiggyBank,
  Send,
  MoreVertical,
} from "lucide-react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { api } from "@/lib/api";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

/* ---------- Types ---------- */
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

const AiSpeedInsightsssssbbs = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [charts, setCharts] = useState<any>(null);
  const [meta, setMeta] = useState<any>({});

  const fetchInsights = async () => {
    setLoading(true);
    const res = await api<any>("/api/ai/finsight");
    if (res.success) {
      setInsights(res.data.reply.insights);
      setCategories(res.data.reply.categories);
      setCharts(res.data.reply.charts);
      setMeta(res.data.reply.meta);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getInsightUI = (type: string) => {
    switch (type) {
      case "alert":
        return {
          icon: AlertTriangle,
          bg: "bg-rose-50 border-rose-200",
          iconBg: "bg-rose-100 text-rose-600",
        };
      case "pattern":
        return {
          icon: TrendingUp,
          bg: "bg-blue-50 border-blue-200",
          iconBg: "bg-blue-100 text-blue-600",
        };
      default:
        return {
          icon: PiggyBank,
          bg: "bg-emerald-50 border-emerald-200",
          iconBg: "bg-emerald-100 text-emerald-600",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow border p-6 flex justify-between">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center">
            <Sparkles className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Spending Insights</h1>
            <p className="text-sm text-slate-500">
              Analysis based on your {meta.currentMonth} transactions
            </p>
          </div>
        </div>
        <button
          onClick={fetchInsights}
          className="flex gap-2 items-center text-violet-600 font-medium"
        >
          <RefreshCw size={16} /> Refresh Analysis
        </button>
      </div>

      {/* INSIGHTS */}
      <h2 className="mt-8 mb-4 text-xl font-bold">
        Key Insights for {meta.currentMonth}
      </h2>

      <div className="grid lg:grid-cols-3 gap-6">
        {insights.map((i, idx) => {
          const ui = getInsightUI(i.type);
          const Icon = ui.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl shadow border-2 ${ui.bg} p-6`}
            >
              <div className="flex gap-3 mb-3">
                <div className={`p-2 rounded-lg ${ui.iconBg}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="font-bold">{i.title}</h3>
                  <p className="text-xs text-slate-500">{i.subtitle}</p>
                </div>
              </div>
              <p className="font-semibold mb-2">{i.description}</p>
              <p className="text-sm text-slate-600">{i.details}</p>
            </div>
          );
        })}
      </div>

      {/* CATEGORY + CHART */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow border p-6">
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="font-bold">Category Breakdown Analysis</h2>
              <p className="text-sm text-slate-500">Compared to last month</p>
            </div>
            <MoreVertical />
          </div>

          {categories.map((c, i) => (
            <div key={i} className="flex justify-between py-3 border-b">
              <span>{c.name}</span>
              <div className="flex gap-3">
                <span className="font-bold">
                  ₹{c.amount.toLocaleString()}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    c.status === "High"
                      ? "bg-rose-100 text-rose-700"
                      : c.status === "Low"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100"
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* PIE CHART */}
        {charts && (
          <div className="bg-white rounded-2xl shadow border p-6">
            <h2 className="font-bold mb-4">Spending Distribution</h2>
            <Pie
              data={{
                labels: charts.categoryPie.labels,
                datasets: [
                  {
                    data: charts.categoryPie.data,
                  },
                ],
              }}
            />
          </div>
        )}
      </div>

      {/* BAR CHART */}
      {charts && (
        <div className="bg-white rounded-2xl shadow border p-6 mt-6">
          <h2 className="font-bold mb-4">Month-over-Month Comparison</h2>
          <Bar
            data={{
              labels: charts.monthComparison.labels,
              datasets: [
                {
                  label: "Expenses",
                  data: charts.monthComparison.data,
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AiSpeedInsightsssssbbs;
