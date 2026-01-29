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
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";


const ButtonLoader = () => (
  <span className="flex items-center gap-2 justify-center">
    <motion.span
      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    Logging in...
  </span>
);

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const handleLogin = async () => {
    setTouched({ email: true, password: true }); // mark fields as touched

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api<{ token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setLoading(false);

      if (!res.success) {
        setError(res.message || "Login failed");
        return;
      }

      const token = res.data?.token;
      if (!token) {
        setError("Token not received. Please try again.");
        return;
      }

      document.cookie = `token=${token}; path=/`;
      localStorage.setItem("token", token);
      router.replace("/home/dashboard");
      localStorage.setItem("email",email)
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Something went wrong during login");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 flex items-center justify-center p-4 relative overflow-hidden">
    {/* Animated background elements */}
    <motion.div
      className="absolute top-20 right-20 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute bottom-20 left-20 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"
      animate={{
        scale: [1.2, 1, 1.2],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl shadow-zinc-900/10 overflow-hidden relative"
    >
      <div className="grid lg:grid-cols-2 min-h-[680px]">
        {/* Left Panel - Form */}
        <div className="p-8 md:p-12 lg:p-16 relative">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3 mb-12"
          >
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-zinc-900 to-zinc-700 rounded-xl flex items-center justify-center shadow-lg"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
              FinSight
            </span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 mb-4 leading-tight">
              Welcome Back
            </h1>
            <p className="text-lg text-zinc-600">
              Please enter your details to access your dashboard.
            </p>
          </motion.div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="block text-sm font-bold text-zinc-900 mb-2">
                Email
              </label>
              <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, email: true }))
                  }
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your email"
                  className={`w-full px-5 py-4 border-2 rounded-xl bg-zinc-50/50 backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                    transition-all duration-300 font-medium
                    ${
                      touched.email && !email
                        ? "border-red-500 bg-red-50/30"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: email ? "100%" : 0 }}
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"
                />
              </motion.div>
              <AnimatePresence>
                {touched.email && !email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-600 text-sm mt-2 font-medium"
                  >
                    Email is required
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-zinc-900">
                  Password
                </label>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/auth/forgot-password"
                  className="text-sm font-semibold text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text hover:from-blue-700 hover:to-cyan-700 transition-all"
                >
                  Forgot Password?
                </motion.a>
              </div>
              <motion.div whileFocus={{ scale: 1.01 }} className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, password: true }))
                  }
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your password"
                  className={`w-full px-5 py-4 pr-12 border-2 rounded-xl bg-zinc-50/50 backdrop-blur-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                    transition-all duration-300 font-medium
                    ${
                      touched.password && !password
                        ? "border-red-500 bg-red-50/30"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </motion.button>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: password ? "100%" : 0 }}
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"
                />
              </motion.div>
              <AnimatePresence>
                {touched.password && !password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-600 text-sm mt-2 font-medium"
                  >
                    Password is required
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-red-600 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-red-800 text-sm font-medium">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <motion.button
                onClick={handleLogin}
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all relative overflow-hidden group ${
                  loading
                    ? "bg-zinc-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-zinc-900 to-zinc-700 hover:shadow-xl hover:shadow-zinc-900/25"
                } text-white text-lg`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <ButtonLoader />
                  ) : (
                    <>
                      Sign In
                      <motion.svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </motion.svg>
                    </>
                  )}
                </span>
                {!loading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* Sign Up Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-center text-zinc-600 mt-8 font-medium"
          >
            Don't have an account?{" "}
            <a
              href="/auth/signup"
              className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text font-bold hover:from-blue-700 hover:to-cyan-700 transition-all"
            >
              Sign up
            </a>
          </motion.p>
        </div>

        {/* Right Panel - Visual Showcase */}
        <div className="hidden lg:grid h-full bg-gradient-to-br from-[#d25d5d] via-[#c54f4f] to-[#b84444] p-8 md:p-12 lg:p-16 grid-rows-[3fr_2fr] gap-6 overflow-hidden relative">
          {/* Decorative elements */}
          <motion.div
            className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-3xl bg-white/50 backdrop-blur-lg shadow-2xl overflow-hidden group"
          >
            <img
              src="/signinimg1.jpg"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt="Dashboard"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Floating welcome card */}
           
          </motion.div>

          <div className="grid grid-cols-2 gap-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="relative rounded-2xl bg-white/40 backdrop-blur-md shadow-2xl overflow-hidden group"
            >
              <img
                src="/signinimg2.jpg"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="Goal Tracking"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 2 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              whileHover={{ scale: 1.05, rotate: 0 }}
              className="relative rounded-2xl bg-white/40 backdrop-blur-md shadow-2xl overflow-hidden group transform"
            >
              <img
                src="/signinimg3.jpg"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt="Insights"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
);
};

export default SignIn;
