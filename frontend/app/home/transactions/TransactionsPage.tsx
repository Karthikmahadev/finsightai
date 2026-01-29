import { useState, useEffect } from "react";
import {
  Download,
  Plus,
  Search,
  Filter,
  Calendar,
  Check,
  Clock,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Edit,
  Trash2,
  BarChart3,
  PlusCircle,
  Sparkles,
  Utensils,
  Car,
  Film,
  Wallet,
  ShoppingBag,
  Lightbulb,
  HeartPulse,
  GraduationCap,
  FileText,
} from "lucide-react";



import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
interface Transaction {
  _id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
  description?: string;
}

const TransactionsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("This Month");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTransaction, setCurrentTransaction] =
    useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    type: "expense",
    category: "",
    amount: "",
    date: "",
    time: "",
    description: "",
  });

  const stats = [
    {
      label: "Total Expenses",
      amount: "42,500.00",
      change: "+12% from last month",
      trend: "up",
      color: "text-rose-600",
    },
    {
      label: "Total Income",
      amount: "85,000.00",
      change: "No change from last month",
      trend: "neutral",
      color: "text-emerald-600",
    },
    {
      label: "Net Savings",
      amount: "42,500.00",
      change: "50% savings rate",
      trend: "up",
      color: "text-blue-600",
    },
  ];

  const categories = [
    "Food & Dining",
    "Transport",
    "Entertainment",
    "Shopping",
    "Bills & Utilities",
    "Healthcare",
    "Education",
    "Income",
    "Other",
  ];

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Fetch transactions
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setFetchLoading(true);
  
      const res = await api<{ data: Transaction[] }>("/api/transactions");
  
      if (res.success) {
        setTransactions(res.data?.data ?? []);
      } else {
        setTransactions([]);
        toast.error(res.message || "Failed to fetch transactions");
      }
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      setTransactions([]);
    } finally {
      setFetchLoading(false);
    }
  };
  

  const handleOpenModal = (transaction: Transaction | null = null) => {
    if (transaction) {
      setEditMode(true);
      setCurrentTransaction(transaction);
      const transactionDate = new Date(transaction.date);
      setFormData({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount.toString(),
        date: transactionDate.toISOString().split("T")[0],
        time: transactionDate.toTimeString().slice(0, 5),
        description: transaction.description || "",
      });
    } else {
      setEditMode(false);
      setCurrentTransaction(null);
      const now = new Date();
      setFormData({
        type: "expense",
        category: "",
        amount: "",
        date: now.toISOString().split("T")[0],
        time: now.toTimeString().slice(0, 5),
        description: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentTransaction(null);
    setFormData({
      type: "expense",
      category: "",
      amount: "",
      date: "",
      time: "",
      description: "",
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.category ||
      !formData.amount ||
      !formData.date ||
      !formData.time
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      const payload = {
        type: formData.type,
        category: formData.category,
        amount: parseFloat(formData.amount),
        date: dateTime.toISOString(),
        description: formData.description,
      };

      const res =
        editMode && currentTransaction
          ? await api(`/api/transactions/${currentTransaction._id}`, {
              method: "PUT",
              body: JSON.stringify(payload),
            })
          : await api("/api/transactions", {
              method: "POST",
              body: JSON.stringify(payload),
            });

      if (res.success) {
        fetchTransactions();
        handleCloseModal();
        toast.success(
          editMode
            ? "Transaction updated successfully "
            : "Transaction added successfully "
        );
      } else {
        toast.error(res.message || "Failed to save transaction");
      }
    } catch (error) {
      toast.error("Failed to save transaction");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await api(`/api/transactions/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.success) throw new Error();

      await fetchTransactions();
      toast.success("Transaction deleted successfully 🗑️");
    } catch {
      toast.error("Failed to delete transaction");
    } finally {
      setDeleteId(null);
    }
  };

  7;
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/transactions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        fetchTransactions();
        alert("Transaction deleted successfully!");
      } else {
        const result = await response.json();
        alert(result.message || "Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction");
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Food & Dining": "bg-orange-100 text-orange-700",
      Transport: "bg-blue-100 text-blue-700",
      Entertainment: "bg-purple-100 text-purple-700",
      Income: "bg-emerald-100 text-emerald-700",
      Shopping: "bg-pink-100 text-pink-700",
      "Bills & Utilities": "bg-yellow-100 text-yellow-700",
      Healthcare: "bg-red-100 text-red-700",
      Education: "bg-indigo-100 text-indigo-700",
      Other: "bg-gray-100 text-gray-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      "Food & Dining": <Utensils className="w-5 h-5 text-orange-500" />,
      Transport: <Car className="w-5 h-5 text-blue-500" />,
      Entertainment: <Film className="w-5 h-5 text-purple-500" />,
      Income: <Wallet className="w-5 h-5 text-green-600" />,
      Shopping: <ShoppingBag className="w-5 h-5 text-pink-500" />,
      "Bills & Utilities": <Lightbulb className="w-5 h-5 text-yellow-500" />,
      Healthcare: <HeartPulse className="w-5 h-5 text-red-500" />,
      Education: <GraduationCap className="w-5 h-5 text-indigo-500" />,
      Other: <FileText className="w-5 h-5 text-slate-500" />,
    };
  
    return icons[category] ?? (
      <FileText className="w-5 h-5 text-slate-400" />
    );
  };
  
  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };
  const router = useRouter();
  const handleAskFinsight = () => {
    router.push("/home/aiinsights")
  }

  const toggleAllRows = () => {
    setSelectedRows((prev) =>
      prev.length === filteredTransactions.length
        ? []
        : filteredTransactions.map((t) => t._id)
    );
  };

  // Empty State Component
  const EmptyState = () => (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="relative max-w-md w-full bg-white rounded-3xl p-10 shadow-xl border border-slate-100 overflow-hidden text-center">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />

        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-lg">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          No transactions yet
        </h2>

        <p className="text-slate-500 mb-6 leading-relaxed">
          Add your first transaction to unlock insights, budgets, and Powered
          financial recommendations.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black text-white font-medium hover:bg-slate-800 transition"
          >
            <PlusCircle className="w-5 h-5" />
            Add transaction
          </button>

          <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition" onClick={handleAskFinsight}>
            <Sparkles className="w-5 h-5 text-violet-600" />
            Ask FinSight
          </button>
        </div>

        <p className="text-xs text-slate-400 mt-6">It only takes a minute ✨</p>
      </div>
    </div>
  );

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (!fetchLoading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <EmptyState />
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0  bg-opacity-50 backdrop-blur-sm"
              onClick={handleCloseModal}
            ></div>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800">
                  {editMode ? "Edit Transaction" : "Add Transaction"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Type
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "expense" })
                      }
                      className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                        formData.type === "expense"
                          ? "bg-rose-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "income" })
                      }
                      className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${
                        formData.type === "income"
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Income
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Add a note..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-black text-white font-medium rounded-lg  transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? "Saving..."
                      : editMode
                      ? "Update"
                      : "Add Transaction"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const filteredTransactions = transactions?.filter((t) => {
    const matchesSearch =
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || t.category === selectedCategory;

    const txDate = new Date(t.date);
    const now = new Date();

    const matchesMonth =
      selectedMonth === "This Month"
        ? txDate.getMonth() === now.getMonth() &&
          txDate.getFullYear() === now.getFullYear()
        : true;

    return matchesSearch && matchesCategory && matchesMonth;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 lg:p-4">
      <div className="mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Transactions</h1>
            <p className="text-slate-500 mt-1">
              Manage and track all your transactions
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all shadow-sm">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </button> */}
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-black text-white font-medium rounded-lg transition-all shadow-lg "
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-lg border border-slate-200"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-500">{stat.label}</span>
                {stat.trend === "up" ? (
                  <div className="p-2 bg-rose-100 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-rose-600" />
                  </div>
                ) : stat.trend === "neutral" ? (
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <ArrowUpRight className="w-4 h-4 text-slate-600" />
                  </div>
                ) : (
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                  </div>
                )}
              </div>
              <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                ₹{stat.amount}
              </div>
              <div className="text-xs text-slate-500">{stat.change}</div>
            </div>
          ))}
        </div> */}

        <div className="bg-white rounded-xl p-4 shadow-lg border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer min-w-[140px]"
              >
                <option value="all">Category</option>
                <option value="food">Food & Dining</option>
                <option value="transport">Transport</option>
                <option value="entertainment">Entertainment</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer min-w-[140px]"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>Last 3 Months</option>
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === filteredTransactions.length &&
                        filteredTransactions.length > 0
                      }
                      onChange={toggleAllRows}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Transaction
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(transaction._id)}
                        onChange={() => toggleRowSelection(transaction._id)}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-xl">
                          {getCategoryIcon(transaction.category)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">
                            {transaction.category}
                          </div>
                          <div className="text-sm text-slate-500">
                            {transaction.description || "No description"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                          transaction.category
                        )}`}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {new Date(transaction.date).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`font-bold ${
                          transaction.type === "income"
                            ? "text-emerald-600"
                            : "text-slate-800"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : ""}₹
                        {Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-sm text-emerald-700">
                          Cleared
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(transaction)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => setDeleteId(transaction._id)}
                          className="p-2 hover:bg-red-100 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* DELETE CONFIRM MODAL */}
            {deleteId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black/40"
                  onClick={() => setDeleteId(null)}
                />
                <div className="bg-white rounded-xl p-6 z-10 w-full max-w-sm">
                  <h3 className="text-lg font-bold mb-2">
                    Delete Transaction?
                  </h3>
                  <p className="text-slate-500 mb-4">
                    This action cannot be undone.
                  </p>
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
          </div>
        </div>

        <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-lg border border-slate-200">
          <div className="text-sm text-slate-600">
            Showing{" "}
            <span className="font-semibold">
              1-{filteredTransactions.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold">{filteredTransactions.length}</span>{" "}
            transactions
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0  bg-opacity-50 backdrop-blur-sm"
            onClick={handleCloseModal}
          ></div>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800">
                {editMode ? "Edit Transaction" : "Add Transaction"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 bg-black text-white font-medium rounded-lg  transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Saving..."
                    : editMode
                    ? "Update"
                    : "Add Transaction"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionsPage;
