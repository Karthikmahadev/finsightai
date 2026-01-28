"use client";

import {
  ArrowLeft,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Success = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5); // 5-second countdown
  const [email] = useState("arjun...@gmail.com");

  useEffect(() => {
    if (countdown === 0) {
      router.replace("/dashboard"); // redirect to dashboard after 5 seconds
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2 min-h-[680px]">
          {/* LEFT CONTENT */}
          <div className="p-8 md:p-12 lg:p-16">
            <div className="flex items-center gap-2 mb-32">
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
                You are all Set
              </h1>
              <p className="text-gray-600">
                Your email has been successfully verified.<br />
                Redirecting you to dashboard in <span className="font-bold">{countdown}</span> seconds
              </p>
            </div>

            <div className="space-y-5">
              <button
                onClick={() => router.replace("/dashboard")}
                className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 mb-4"
              >
                Go to Dashboard Now
              </button>

              <button className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-800 mx-auto mt-6">
                <ArrowLeft className="w-4 h-4" />
                Back to log in
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE SECTION */}
          <div className="hidden lg:grid h-full bg-[#d25d5d] p-8 md:p-12 lg:p-16 grid-rows-[3fr_2fr] gap-6 overflow-hidden">
            <div className="grid grid-cols-2 gap-6">
              <div className="relative rounded-2xl bg-white/40 backdrop-blur-md shadow-lg overflow-hidden">
                <img
                  src="/success2.jpg"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Goal Tracking"
                />
              </div>

              <div
                className="relative rounded-2xl bg-white/40 backdrop-blur-md shadow-lg overflow-hidden
                    transform rotate-2 hover:rotate-0 transition-transform duration-300"
              >
                <img
                  src="/success3.jpg"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="Insights"
                />
              </div>
            </div>

            <div className="relative rounded-3xl bg-white/50 backdrop-blur-lg shadow-xl overflow-hidden">
              <img
                src="/success1.jpg"
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

export default Success;
