import { useState } from "react";
import { Sparkles, RefreshCw, AlertTriangle, TrendingUp, PiggyBank, Send, ChevronRight, MoreVertical } from 'lucide-react';

const AiSpeedInsights = () => {
  const [query, setQuery] = useState('');
  
  const suggestedQuestions = [
    "Why did I spend more this month?",
    "Where can I cut costs?",
    "What is my highest expense category?"
  ];

  const insights = [
    {
      type: 'alert',
      icon: AlertTriangle,
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      title: 'Spending Alert',
      subtitle: 'Food & Dining',
      description: 'You spent 28% more on food this month.',
      details: 'This increase is mainly due to 4 extra weekend dining transactions totaling ₹5,200 compared to last month.',
      color: 'border-rose-200 bg-rose-50/50'
    },
    {
      type: 'pattern',
      icon: TrendingUp,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: 'Spending Pattern',
      subtitle: 'Recurring Trends',
      description: 'High outflow detected between 20th-25th.',
      details: 'Your daily bills and subscriptions align during this window. We recommend keeping ₹12,000 in your checking account by the 19th.',
      color: 'border-blue-200 bg-blue-50/50'
    },
    {
      type: 'opportunity',
      icon: PiggyBank,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      title: 'Savings Opportunity',
      subtitle: 'Recommendation',
      description: 'Save ₹24,000/year by optimizing subscriptions.',
      details: 'You have 3 active entertainment subscriptions. Reducing one could save ₹2,000/month without impacting core needs.',
      color: 'border-emerald-200 bg-emerald-50/50'
    }
  ];

  const categories = [
    { name: 'Food & Dining', amount: 12450, status: 'High', color: 'text-rose-600' },
    { name: 'Transportation', amount: 3500, status: 'Normal', color: 'text-slate-600' },
    { name: 'Entertainment', amount: 7200, status: 'High', color: 'text-rose-600' },
    { name: 'Shopping', amount: 5800, status: 'Normal', color: 'text-slate-600' },
    { name: 'Bills & Utilities', amount: 4500, status: 'Low', color: 'text-emerald-600' }
  ];

  const suggestedActions = [
    {
      title: 'Set a Dining Budget',
      description: 'Limit dining out to ₹8k next month.',
      icon: '🍽️'
    },
    {
      title: 'Review Subscriptions',
      description: 'Cancel unused streaming services.',
      icon: '📺'
    },
    {
      title: 'Switch to UPI for Small Purchases',
      description: 'Reduce transaction fees.',
      icon: '💳'
    }
  ];

  const handleSubmit = () => {
    console.log('Query submitted:', query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 lg:p-8">
      <div className=" mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800"> Spending Insights</h1>
                <p className="text-sm text-slate-500">Analysis based on your October 2024 transactions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>Updated 5 mins ago</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-all font-medium">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh Analysis</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Ask FinSight</h2>
          
          <div className="mb-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Sparkles className="w-5 h-5 text-violet-500" />
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
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(question)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm rounded-lg transition-all border border-slate-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4">Key Insights for October</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl shadow-lg border-2 ${insight.color} p-6 hover:shadow-xl transition-all`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`p-2.5 ${insight.iconBg} rounded-lg flex-shrink-0`}>
                    <insight.icon className={`w-5 h-5 ${insight.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-sm mb-0.5">{insight.title}</h3>
                    <p className="text-xs text-slate-500">{insight.subtitle}</p>
                  </div>
                </div>
                
                <p className="font-semibold text-slate-800 mb-3 leading-tight">
                  {insight.description}
                </p>
                
                <p className="text-sm text-slate-600 leading-relaxed">
                  {insight.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Category Breakdown Analysis</h2>
                <p className="text-sm text-slate-500">Compared to your average spending profile</p>
              </div>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                <MoreVertical className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4">
              {categories.map((category, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-700">{category.name}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${category.color}`}>
                          ₹{category.amount.toLocaleString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          category.status === 'High' ? 'bg-rose-100 text-rose-700' :
                          category.status === 'Low' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {category.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-2.5 text-violet-600 hover:bg-violet-50 rounded-lg transition-all font-medium flex items-center justify-center gap-2">
              View Detailed Breakdown
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-800">Suggested Actions</h2>
              <p className="text-sm text-slate-500">Personalized recommendations to improve your finances</p>
            </div>

            <div className="space-y-3">
              {suggestedActions.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-xl hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-2xl flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 mb-1 flex items-center gap-2">
                      {action.title}
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </h3>
                    <p className="text-sm text-slate-600">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Tip</p>
                  <p>Implementing these 3 actions could save you approximately ₹8,500 next month!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiSpeedInsights;