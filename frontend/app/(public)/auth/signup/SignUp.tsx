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

const ButtonLoader = () => (
  <span className="flex items-center gap-2 justify-center">
    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    Creating account...
  </span>
);

const SignUp = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Track field validity
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const handleSubmit = async () => {
    // Mark all fields as touched
    setTouched({ name: true, email: true, password: true });

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      setLoading(false);

      if (!res.success) {
        setError(res.message || "Signup failed");
        return;
      }

      router.push(`/auth/verify-email?email=${email}`);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Something went wrong");
    }
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
                FinSight AI
              </span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Welcome back
              </h1>
              <p className="text-gray-600">
                Please enter your details to access your dashboard.
              </p>
            </div>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-6">
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
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    touched.name && !name ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </div>

              {/* Email */}
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

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() =>
                    setTouched((prev) => ({ ...prev, password: true }))
                  }
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    touched.password && !password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
              </div>

              {/* Error message */}
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium shadow-lg transition-all ${
                  loading
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                } text-white`}
              >
                {loading ? <ButtonLoader /> : "Sign Up"}
              </button>
            </div>

            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Sign in
              </Link>
            </p>
          </div>

          <div
            className="hidden lg:grid h-full bg-[#d25d5d]
                p-8 md:p-12 lg:p-16
                grid-rows-[3fr_2fr] gap-6 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="relative rounded-2xl bg-white/40 backdrop-blur-md shadow-lg overflow-hidden">
                <img
                  src="/finacnesign.jpg"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Goal Tracking"
                />
              </div>

              <div
                className="relative rounded-2xl bg-white/40 backdrop-blur-md shadow-lg overflow-hidden
                    transform rotate-2 hover:rotate-0 transition-transform duration-300"
              >
                <img
                  src="/fjfkbf.jpg"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Insights"
                />
              </div>
            </div>

            <div className="relative rounded-full bg-white/50 backdrop-blur-lg shadow-xl overflow-hidden">
              <img
                src="/finacnesigndsv.jpg"
                className="absolute inset-0 w-full h-full object-cover"
                alt="AI Dashboard"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
