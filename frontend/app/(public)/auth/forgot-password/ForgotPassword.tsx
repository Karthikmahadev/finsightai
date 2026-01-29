"use client";
import { api } from "@/lib/api";
import {
  Sparkles,
  Eye,
  EyeOff,
  Mail,
  ArrowRight,
  Github,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";

const ForgotPassword = () => {
    const router = useRouter();
   
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
  
    const [touched, setTouched] = useState({
        email: false,
        newPassword: false,
        confirmPassword: false,
      });
    
    const handleSubmit = async () => {
        setTouched({
            email: true,
            newPassword: true,
            confirmPassword: true,
          }); // mark fields as touched
      setError("");
      setSuccess("");
  
      if (!email || !newPassword || !confirmPassword) {
        setError("All fields are required");
        return;
      }
  
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
  
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
  
      setLoading(true);
  
      const res = await api("/auth/forgot-password", {
        method: "PUT",
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });
  
      setLoading(false);
  
      if (!res.success) {
        setError(res.message || "Failed to reset password");
        return;
      }
  
      setSuccess("Password updated successfully. Redirecting to Sign In...");
  
      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
    };



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[680px]">
          <div className="p-8 md:p-12 lg:p-16">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-lg font-semibold text-gray-900">
                FinSight
              </span>
            </div>
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Reset Password
              </h1>
              <p className="text-gray-600">
              Enter your email and set a new password.
              </p>
            </div>
            {/* <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-6">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                Login with Google
              </span>
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div> */}
            <div className="space-y-5">
            <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    touched.email && !email ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Password
                </label>
                <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                 onBlur={() => setTouched((prev) => ({ ...prev, newPassword: true }))}
                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    touched.newPassword && !newPassword ? "border-red-500" : "border-gray-300"
                  }`}
              />
              </div>
              <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm New Password
                </label>
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                 onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    touched.confirmPassword && !confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
              />
              </div>
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

              {success && (
                <p className="text-green-600 text-sm text-center">{success}</p>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </div>
          
          </div>

          <div
            className="hidden lg:grid h-full bg-[#d25d5d]
                p-8 md:p-12 lg:p-16
                grid-rows-[3fr_2fr] gap-6 overflow-hidden"
          >
            <div className="relative rounded-3xl bg-white/50 backdrop-blur-lg shadow-xl overflow-hidden">
              <img
                src="/signinimg1.jpg"
                className="absolute inset-0 w-full h-full object-cover"
                alt="Dashboard"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative rounded-2xl bg-white/40 backdrop-blur-md shadow-lg overflow-hidden">
                <img
                  src="/signinimg2.jpg"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Goal Tracking"
                />
              </div>
              <div
                className="relative rounded-2xl bg-white/40 backdrop-blur-md shadow-lg overflow-hidden
                    transform rotate-2 hover:rotate-0 transition-transform duration-300"
              >
                <img
                  src="/signinimg3.jpg"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Insights"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
