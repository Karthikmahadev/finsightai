import { BarChart3, PlusCircle, Sparkles } from "lucide-react";

export default function DashboardEmptyState() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="relative max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-slate-100 overflow-hidden text-center">

        {/* Background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />

        {/* Icon */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          No financial data yet
        </h2>

        <p className="text-slate-500 mb-6 leading-relaxed">
          Add your first transaction to unlock insights, budgets, and AI-powered
          financial recommendations.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white font-medium hover:bg-slate-800 transition">
            <PlusCircle className="w-5 h-5" />
            Add transaction
          </button>

          <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition">
            <Sparkles className="w-5 h-5 text-violet-600" />
            Ask FinSight
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-6">
          It only takes a minute ✨
        </p>
      </div>
    </div>
  );
}
