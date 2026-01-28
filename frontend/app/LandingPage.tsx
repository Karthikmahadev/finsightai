"use client";
import Link from "next/link";
import { useState } from "react";

const LandingPage = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="min-h-screen bg-white p-5 mx-12">
        <header className="relative flex items-center justify-between gap-10 border-0 rounded-full bg-gray-200 py-2 px-[15px]">
          <div className="flex items-center gap-4">
            <img
              src="/skbjbfcr.jpg"
              className="rounded-full h-[50px] w-[50px]"
              alt="logo"
            />
            <span className="uppercase font-medium hidden md:block">
              FinSight AI
            </span>
          </div>

          <ul className="hidden md:flex gap-10 uppercase items-center">
            <li>Home</li>
            <li>About</li>
          </ul>

          <ul className="hidden md:flex gap-10 items-center uppercase font-medium text-gray-500">
            <Link href="/auth/signup">
              <li>Sign In</li>
            </Link>

            <Link href="/auth/signup">
              <li className="bg-black rounded-full px-5 py-3 text-white">
                Get Started
              </li>
            </Link>
          </ul>

          <button
            className="md:hidden flex items-center"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            <svg
              className="w-8 h-8 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {open && (
            <div className="absolute top-full left-0 w-full bg-gray-200 rounded-3xl mt-3 p-6 md:hidden shadow-lg z-50">
              <ul className="flex flex-col gap-6 uppercase text-center">
                <li>Home</li>
                <li>About</li>

                <Link href="/auth/signup">
                  <li className="text-gray-600">Sign In</li>
                </Link>

                <Link href="/auth/signup">
                  <li className="bg-black rounded-full py-4 text-white">
                    Sign Up
                  </li>
                </Link>
              </ul>
            </div>
          )}
        </header>

        <section className="flex flex-col justify-center items-center pt-12 sm:pt-20 md:pt-28">
          <h1 className="font-bold text-black text-5xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl text-center">
            <span>Understand your money,</span>
            <span className="block">
              Smarter. <span className="text-amber-800">Faster.</span>
            </span>
          </h1>

          <div className="flex justify-center mt-[40px]">
            <div className="max-w-[730px]">
              <p className=" text-center">
                FinSight AI helps you track expenses, analyze spending, and get
                AI-driven insights....{" "}
              </p>
            </div>
          </div>
        </section>

        <section className="flex justify-center items-center mt-4 sm:mt-[15px] sm:ml-[50px]">
          <img src="/financebackground.jpg" />
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
          <div className="text-center mb-12">
            <p className="text-blue-600 font-semibold text-sm tracking-wider mb-4">
              WHY FINSIGHT AI?
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Turn raw transactions into clear financial decisions
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Most finance apps just show numbers. FinSight AI explains what
              they actually mean — where you overspend, how to save more, and
              what to fix next.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 mb-6">
                  <svg
                    className="w-full h-full text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  AI-powered spending analysis
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Automatically categorize your expenses and uncover hidden
                  patterns using AI-driven analysis.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 mb-6">
                  <svg
                    className="w-full h-full text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Smart expense tracking
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Track daily, monthly, and category-wise expenses with a clean,
                  intuitive dashboard built for clarity.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 mb-6">
                  <svg
                    className="w-full h-full text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Actionable AI insights
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Ask FinSight AI questions about your spending and receive
                  personalized insights, predictions, and recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative w-full h-[80vh] min-h-[300px] overflow-hidden rounded-3xl">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80"
              alt="People connecting"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-7xl mx-auto">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
                Track. Analyze. Improve.
              </h1>

              <p className="text-white text-lg sm:text-xl md:text-2xl font-medium leading-relaxed max-w-4xl mx-auto">
                FinSight AI combines modern UI, secure backend systems, and AI
                models to help users understand and improve their financial
                habits effortlessly.
              </p>
            </div>
          </div>
        </section>
      </div>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-5 py-2 rounded-full mb-6">
              ABOUT
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Built as a Real-World AI Finance Product
              <br />
              Investors
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mx-auto">
              FinSight AI is a full-stack finance tracking application built to
              solve a real problem — understanding personal finances without
              complexity. The project focuses on clean UX, scalable backend
              architecture, and AI-powered insights.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                  alt="Maneesh Awasthi - Co-Founder & CEO"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  Karthik Mahadev
                </h3>
                <p className="text-gray-600 text-lg">Full Stack Developer</p>
              </div>

              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  FinSight AI was built as a portfolio-grade project to
                  demonstrate real-world full-stack development skills using
                  modern technologies like React, Next.js, TypeScript, Tailwind
                  CSS, backend APIs, and AI integration.
                </p>

                <p>
                  The goal of this project is not just expense tracking, but
                  creating an intelligent system that explains spending behavior
                  and helps users make better financial decisions using AI.
                </p>

                <p>
                  This project showcases frontend engineering, backend design,
                  API integration, authentication, and AI-driven features —
                  making it a strong demonstration of production-level
                  development skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-gray-300 mb-12"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
            <div>
              <div className="inline-block bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2 rounded-full mb-4">
                FINSIGHT AI
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Your AI-Powered Personal Finance Companion
              </h2>
            </div>

            <a
              href="mailto:karthikmahadev.dev@gmail.com"
              className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
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
              <span className="text-lg font-medium">
                karthikmahadev2001@gmail.com
              </span>
            </a>
          </div>

          <div className="space-y-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-700">
              <p>
                © 2026 FinSight AI. Built by{" "}
                <span className="font-medium">Karthik Mahadev</span>.{" "}
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </a>
              </p>
              <p>All rights reserved.</p>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed max-w-4xl mx-auto md:mx-0 md:text-center">
              <p>
                FinSight AI is an educational and portfolio project. It does not
                provide financial, investment, or legal advice. All insights are
                generated for demonstration purposes only.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
