"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X,
  Calendar,
  Bell,
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/home/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/home/transactions", icon: Receipt },
  { name: "Budgets", href: "/home/budgets", icon: Receipt },
  {
    name: "Ask FinSight",
    href: "/home/aiinsights",
    icon: Sparkles,
    // badge: "3",
  },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [checkedAuth, setCheckedAuth] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Redirect to the homepage after logging out
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🚫 Not logged in → kick out
    if (!token) {
      router.replace("/auth/signin");
      return;
    }

    // ✅ Logged in → decode user
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserName(decodedToken?.name || "User");
    } catch (error) {
      console.error("Token decoding failed", error);
      setUserName("User");
    }

    setCheckedAuth(true);
  }, [router]);

  // ⏳ Prevent UI flash before auth check
  if (!checkedAuth) return null;



  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar for large screens */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex-col z-50">
        <SidebarContent pathname={pathname} onLogout={handleLogout} />
      </aside>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between">
              <span className="text-xl font-bold">FinSight AI</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <SidebarContent pathname={pathname}  onLogout={handleLogout} />
          </aside>
        </div>
      )}

      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
          <div className="px-4 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <p className="text-sm text-slate-500">Overview</p>
                <h1 className="text-2xl font-bold text-slate-800">
                  Welcome back, {userName}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-lg px-4 py-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">
                  {new Date().toLocaleString("default", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-all">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}

function SidebarContent({ pathname, onLogout }: { pathname: string ,  onLogout: () => void;}) {
  return (
    <>
      <div className="flex gap-4 items-center p-6 border-slate-200">
        <img src="/skbjbfcr.jpg" className="rounded-full h-[30px] w-[30px]" />
        <h1 className="font-semibold">FinSight AI</h1>
      </div>

      <nav className="flex-1 p-4 space-y-3">
        <div className="text-xs font-semibold text-slate-400 px-3 mb-2">
          Overview
        </div>

        {navigationItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-6 rounded-lg transition-all ${
                  isActive
                    ? "bg-black text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>

                {/* {item.badge && (
                  <span className="ml-auto bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )} */}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="text-xs font-semibold text-slate-400 px-3 py-3 mb-2">
          Settings
        </div>
        <Link
          href="/home/settings"
          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-rose-50 rounded-lg"
        >
          <Settings className="w-5 h-5" /> Settings
        </Link>
        <button  className="w-full flex items-center gap-3 px-3 py-2.5 text-rose-600 hover:bg-rose-50 rounded-lg" onClick={onLogout}>
          
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </>
  );
}
