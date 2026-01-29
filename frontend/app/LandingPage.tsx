"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const LandingPage = () => {
  const [open, setOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const { scrollYProgress } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);

  const images = [
    "/finance-slider7.jpg",
    "/finance-slider8.jpg",
    "/finance-slider5.jpg",
    "/finance-slider6.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Parallax effect for hero section
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div ref={containerRef} className="bg-gradient-to-b from-zinc-50 to-white">
      {/* Animated Navigation */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 mx-4 sm:mx-6 md:mx-12 mt-4"
      >
        <div className="backdrop-blur-xl bg-white/70 border border-zinc-200/50 rounded-full shadow-lg shadow-black/5">
          <div className="flex items-center justify-between gap-10 py-3 px-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4"
            >
              <div className="relative">
                <motion.img
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  src="/skbjbfcr.jpg"
                  className="rounded-full h-12 w-12 object-cover ring-2 ring-amber-800/20"
                  alt="FinSight Logo"
                />
              </div>
              <span className="font-bold text-lg tracking-tight hidden md:block bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent">
                FINSIGHT
              </span>
            </motion.div>

            <nav className="hidden md:flex gap-8 items-center">
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
                >
                  Sign In
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/signup">
                  <button className="relative overflow-hidden bg-zinc-900 text-white rounded-full px-6 py-2.5 text-sm font-medium group">
                    <span className="relative z-10">Get Started</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-amber-800 to-amber-600"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </button>
                </Link>
              </motion.div>
            </nav>

            <button
              className="md:hidden"
              onClick={() => setOpen(!open)}
              aria-label="Toggle Menu"
            >
              <motion.div
                animate={{ rotate: open ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-6 h-6 text-zinc-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </motion.div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mt-3 backdrop-blur-xl bg-white/90 border border-zinc-200/50 rounded-3xl shadow-xl p-6 md:hidden"
            >
              <nav className="flex flex-col gap-4">
                <Link href="/auth/signin">
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="text-zinc-600 hover:text-zinc-900 text-center py-3 rounded-xl hover:bg-zinc-50 transition-all"
                  >
                    Sign In
                  </motion.div>
                </Link>
                <Link href="/auth/signup">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-zinc-900 text-white rounded-xl py-3 font-medium"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        className="min-h-screen flex flex-col justify-center items-center px-4 pt-32 pb-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center max-w-6xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="inline-block mb-6"
          >
            <span className="text-xs font-bold tracking-widest text-amber-800 bg-amber-50 px-4 py-2 rounded-full border border-amber-200/50">
              YOUR FINANCIAL CLARITY STARTS HERE
            </span>
          </motion.div>

          <h1 className="font-black text-zinc-900 leading-[0.9] mb-8">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
            >
              Understand
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl"
            >
              your money,
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl mt-2"
            >
              <span className="text-zinc-900">Smarter. </span>
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-amber-800 via-amber-600 to-amber-800 bg-clip-text text-transparent">
                  Faster.
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-amber-200/40 -z-0"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                />
              </span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            FinSight helps you track expenses, analyze spending, and get
            AI-driven insights that transform raw data into financial clarity.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 relative w-full max-w-5xl"
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-zinc-900/10">
            <img
              src="/financebackground.jpg"
              alt="Finance Dashboard"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 to-transparent" />
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-8 -right-8 bg-white rounded-2xl shadow-xl p-4 hidden lg:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Savings</p>
                <p className="text-lg font-bold text-zinc-900">+$2,340</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl p-4 hidden lg:block"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Insights</p>
                <p className="text-lg font-bold text-zinc-900">24 New</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Why FinSight Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-zinc-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <p className="text-sm font-bold tracking-widest text-blue-600 mb-4">
              WHY FINSIGHT?
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 mb-6 leading-tight">
              Turn raw transactions into
              <br />
              <span 
              // className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
              >
                clear financial decisions
              </span>
            </h2>
            <p className="text-lg text-zinc-600 max-w-3xl mx-auto leading-relaxed">
              Most finance apps just show numbers. FinSight explains what they
              actually mean — where you overspend, how to save more, and what to
              fix next.
            </p>
          </motion.div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                ),
                title: "Spending Analysis",
                description:
                  "Automatically categorize your expenses and uncover hidden patterns using AI-driven analysis.",
                gradient: "from-violet-500 to-purple-600",
                delay: 0.1,
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                ),
                title: "Smart Expense Tracking",
                description:
                  "Track daily, monthly, and category-wise expenses with a clean, intuitive dashboard built for clarity.",
                gradient: "from-blue-500 to-cyan-600",
                delay: 0.2,
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                ),
                title: "Actionable Insights",
                description:
                  "Ask FinSight questions about your spending and receive personalized insights, predictions, and recommendations.",
                gradient: "from-amber-500 to-orange-600",
                delay: 0.3,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="relative bg-white rounded-3xl p-8 h-full shadow-lg shadow-zinc-900/5 border border-zinc-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-zinc-900/10">
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 shadow-lg`}>
                    <svg
                      className="w-full h-full text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {feature.icon}
                    </svg>
                  </div>

                  <h3 className="text-2xl font-bold text-zinc-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section with Image Slider */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-[75vh] min-h-[500px] rounded-3xl overflow-hidden">
            {/* Image Slider */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={images[activeSlide]}
                  alt="Finance analytics"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/60 via-zinc-900/40 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {images.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeSlide
                      ? "w-12 bg-white"
                      : "w-2 bg-white/40 hover:bg-white/60"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Content Overlay */}
            <div className="relative h-full flex items-center justify-center px-6 z-10">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-center max-w-5xl"
              >
                <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight drop-shadow-2xl">
                  Track. Analyze. Improve.
                </h2>
                <p className="text-white text-lg sm:text-xl md:text-2xl font-medium leading-relaxed max-w-4xl mx-auto drop-shadow-lg">
                  FinSight combines modern UI, secure backend systems, and
                  intelligent AI models to help users understand and improve their
                  financial habits effortlessly.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-zinc-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-block bg-zinc-900 text-white text-xs font-bold px-5 py-2 rounded-full mb-6">
              ABOUT THE PROJECT
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 mb-8 leading-tight">
              Built as a Real-World
              <br />
              Finance Product for Investors
            </h2>
            <p className="text-lg text-zinc-600 max-w-4xl mx-auto leading-relaxed">
              FinSight is a full-stack finance tracking application built to solve
              a real problem — understanding personal finances without complexity.
              The project focuses on clean UX, scalable backend architecture, and
              AI-powered insights.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/about.jpg"
                  alt="Karthik Mahadev"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/20 to-transparent" />
              </div>

              {/* Decorative element */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full opacity-20 blur-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-4xl font-black text-zinc-900 mb-2">
                  Karthik Mahadev
                </h3>
                <p className="text-xl text-amber-800 font-semibold">
                  Full Stack Developer
                </p>
              </div>

              <div className="space-y-5 text-zinc-700 leading-relaxed text-lg">
                <p>
                  FinSight is a portfolio-grade, end-to-end financial analytics
                  platform built to demonstrate real-world full-stack engineering
                  using modern web technologies such as React, Next.js, TypeScript,
                  Tailwind CSS, secure backend APIs, and AI-powered insights.
                </p>

                <p className="bg-zinc-50 border-l-4 border-amber-800 pl-6 py-4 rounded-r-xl">
                  Unlike traditional expense trackers that simply list transactions,
                  FinSight focuses on{" "}
                  <span className="font-bold text-zinc-900">
                    understanding user spending behavior
                  </span>
                  . It analyzes month-over-month trends, category-level changes, and
                  patterns to explain <em>why</em> spending increases or decreases.
                </p>

                <p>
                  The platform includes features such as authentication, protected
                  routes, transaction management, budget tracking, intelligent
                  alerts, and AI-driven financial insights that convert raw data
                  into clear, actionable feedback for users.
                </p>

                <p>
                  This project reflects production-oriented thinking — from clean
                  UI/UX and responsive design to scalable backend architecture, API
                  design, and data aggregation — making it a strong representation
                  of how modern financial applications are built and maintained in
                  real-world environments.
                </p>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} className="pt-4">
  <a
    href="https://www.linkedin.com/in/karthikmahadev19"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-zinc-800 transition-colors shadow-lg"
  >
    {/* LinkedIn Icon */}
    <svg
      className="w-5 h-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.48 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4v16h-4V8zM8.5 8h3.8v2.2h.05c.53-1 1.82-2.2 3.75-2.2 4 0 4.7 2.6 4.7 6v10h-4v-8.8c0-2.1 0-4.8-3-4.8s-3.4 2.3-3.4 4.6V24h-4V8z" />
    </svg>

    Connect on LinkedIn
  </a>
</motion.div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-zinc-800 mb-16"></div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-block bg-amber-800/20 text-amber-400 text-xs font-bold px-4 py-2 rounded-full mb-6">
                FINSIGHT 2026
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Your AI-Powered
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Personal Finance
                </span>
                <br />
                Companion
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-end"
            >
              <a
                href="mailto:karthikmahadev2001@gmail.com"
                className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors mb-8"
              >
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-amber-800 transition-colors">
                  <svg
                    className="w-6 h-6"
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
                </div>
                <span className="text-lg font-medium">
                  karthikmahadev2001@gmail.com
                </span>
              </a>
            </motion.div>
          </div>

          <div className="border-t border-zinc-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500">
              <p>
                © 2026 FinSight. Built by{" "}
                <span className="font-semibold text-zinc-400">
                  Karthik Mahadev
                </span>
                .{" "}
                <a
                  href="#"
                  className="hover:text-zinc-300 transition-colors underline"
                >
                  Privacy Policy
                </a>
              </p>
              <p>All rights reserved.</p>
            </div>

            <p className="text-sm text-zinc-600 leading-relaxed mt-6 text-center max-w-3xl mx-auto">
              FinSight is an educational and portfolio project. It does not
              provide financial, investment, or legal advice. All insights are
              generated for demonstration purposes only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;