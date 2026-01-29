"use client";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";


const ButtonLoader = () => (
  <span className="flex items-center gap-2 justify-center">
    <motion.span
      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
    Verifying...
  </span>
);



const EmailVerification = () => {
  const router = useRouter();
  const params = useSearchParams();


  // ✅ store email in state to prevent SSR errors
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    // ✅ only access params on client
    setEmail(params.get("email"));
  }, [params]);

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

      router.replace("/auth/success");
    } catch (err: any) {
      setLoading(false);
      setError(err.message || "Something went wrong during verification");
    }
  };
  
  // ✅ render nothing until email is set
  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"
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
        className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
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
                Verify Your Email
              </h1>
              <p className="text-lg text-zinc-600">
                We've sent a verification code to complete your registration.
              </p>
            </motion.div>

            {/* Content */}
            <div className="space-y-6">
              {/* Email Info */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100"
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0"
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
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-zinc-900 mb-1">
                      Check Your Email
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      We've sent a 4-digit verification code to{" "}
                      <span className="font-bold text-zinc-900 block mt-1">
                        {email}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* OTP Input Fields */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <label className="block text-sm font-bold text-zinc-900 mb-4 text-center">
                  Enter Verification Code
                </label>
                <div className="flex justify-center gap-3 mb-6">
                  {verificationCode.map((digit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    >
                      <motion.input
                       
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
                        whileFocus={{ scale: 1.05 }}
                        whileHover={{ scale: 1.02 }}
                        className={`w-16 h-16 text-center text-3xl font-black
                          border-2 rounded-2xl bg-zinc-50/50 backdrop-blur-sm
                          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                          transition-all duration-300
                          ${
                            touched[index] && !digit
                              ? "border-red-500 bg-red-50/30 shake"
                              : digit
                              ? "border-blue-500 bg-blue-50"
                              : "border-zinc-200 hover:border-zinc-300"
                          }`}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Visual Progress Indicator */}
                <div className="flex justify-center gap-2 mb-6">
                  {verificationCode.map((digit, index) => (
                    <motion.div
                      key={index}
                      className="h-1 rounded-full"
                      initial={{ width: 40, backgroundColor: "#e5e7eb" }}
                      animate={{
                        backgroundColor: digit ? "#3b82f6" : "#e5e7eb",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </div>
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

              {/* Verify Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <motion.button
                  onClick={handleVerify}
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className={`w-full py-4 rounded-xl font-bold shadow-lg transition-all relative overflow-hidden group ${
                    loading
                      ? "bg-zinc-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-xl hover:shadow-blue-600/25"
                  } text-white text-lg`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <ButtonLoader />
                    ) : (
                      <>
                        Verify Account
                        <motion.svg
  className="w-5 h-5"
  fill="none"
  stroke="currentColor"
  viewBox="0 0 24 24"
  animate={{ x: [0, 5, 0] }}
  transition={{ duration: 1.5, repeat: Infinity }}
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
  />
</motion.svg> 

                      </>
                    )}
                  </span>
                  {!loading && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              </motion.div>

              

              {/* Back to Login */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ x: -5 }}
                  onClick={() => router.push("/auth/signin")}
                  className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </motion.button>
              </motion.div>
            </div>
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
                src="/email1.jpg"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt="Dashboard"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Floating verification badge */}
              {/* <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg flex-shrink-0"
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
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Verification Status
                    </p>
                    <motion.p
                      className="text-xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                    >
                      Secure & Protected
                    </motion.p>
                  </div>
                </div>
              </motion.div> */}
            </motion.div>

            <div className="grid grid-cols-2 gap-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="relative rounded-full bg-white/40 backdrop-blur-md shadow-2xl overflow-hidden group"
              >
                <img
                  src="/email2.jpg"
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
                  src="/email3.jpg"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt="Insights"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default EmailVerification;