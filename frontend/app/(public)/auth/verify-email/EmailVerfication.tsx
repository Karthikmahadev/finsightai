"use client";

import { api } from "@/lib/api";
import {
  ArrowLeft,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const EmailVerification = () => {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email");

  const OTP_LENGTH = 6;

  // 🔹 OTP state
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );

  const [touched, setTouched] = useState<boolean[]>(
    Array(OTP_LENGTH).fill(false)
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // only allow a single digit
  
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
  
    if (value && index < OTP_LENGTH - 1) {
      const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };
  

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement | null;
      prevInput?.focus();
    }
  };
  

  const handleVerify = async () => {
    setTouched(Array(OTP_LENGTH).fill(true)); // mark all fields as touched

    const otp = verificationCode.join("");
    if (otp.length !== OTP_LENGTH || verificationCode.some((d) => !d)) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api<{ token: string }>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      setLoading(false);

      if (!res.success) {
        setError(res.message || "Verification failed");
        return;
      }

      const token = res.data?.token;
      if (!token) {
        setError("Token not received. Please try again.");
        return;
      }

      document.cookie = `token=${token}; path=/`;
      localStorage.setItem("token", token);

      router.replace("auth/success");
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Something went wrong during verification");
    }
  };
  

  return (
    <>
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
                  Verify your email
                </h1>
                <p className="text-gray-600">
                  Please enter your details to access your dashboard.
                </p>
              </div>

              <div className="space-y-5">
                <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">
                  Check your email
                </h1>

                <p className="text-slate-500 text-sm mb-8 text-center">
                  We've sent a 4-digit verification code to
                  <br />
                  <span className="font-semibold text-slate-700">{email}</span>
                </p>

                {/* ✅ FIXED OTP INPUTS (VISIBLE) */}
                <div className="flex justify-center gap-3 mb-6">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onBlur={() => {
                      const newTouched = [...touched];
                      newTouched[index] = true;
                      setTouched(newTouched);
                    }}
                    className={`w-14 h-14 text-center text-2xl font-bold
                      border-2 rounded-xl
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      focus:border-transparent transition-all
                      ${
                        touched[index] && !digit
                          ? "border-red-500"
                          : "border-slate-300"
                      }`}
                  />
                ))}
                </div>

                {/* ERROR MESSAGE */}
              {error && <p className="text-red-600 text-sm text-center">{error}</p>}

<button
  onClick={handleVerify}
  disabled={loading}
  className={`w-full bg-blue-600 text-white font-semibold py-3.5 rounded-lg hover:bg-blue-700 transition-all shadow-lg mb-4 ${
    loading ? "cursor-not-allowed opacity-70" : ""
  }`}
>
  {loading ? "Verifying..." : "Verify Account"}
</button>


                <p className="text-center text-sm text-slate-600">
                  Didn't receive the code?{" "}
                  <button className="text-blue-600 font-semibold hover:underline">
                    Resend
                  </button>
                </p>

                <button className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-800 mx-auto mt-6">
                  <ArrowLeft className="w-4 h-4" />
                  Back to log in
                </button>
              </div>
            </div>

            {/* RIGHT IMAGE SECTION — UNCHANGED */}
            <div className="hidden lg:grid h-full bg-[#d25d5d] p-8 md:p-12 lg:p-16 grid-rows-[3fr_2fr] gap-6 overflow-hidden">
              <div className="relative rounded-3xl bg-white/50 backdrop-blur-lg shadow-xl overflow-hidden">
                <img
                  src="/email1.jpg"
                  className="absolute inset-0 w-full h-full object-cover"
                  alt="AI Dashboard"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="relative rounded-full bg-white/40 backdrop-blur-md shadow-lg overflow-hidden">
                  <img
                    src="/email2.jpg"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Goal Tracking"
                  />
                </div>

                <div className="relative rounded-2xl bg-white/40 backdrop-blur-md shadow-lg overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <img
                    src="/email3.jpg"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Insights"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerification;
