'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  Wallet,
  TrendingUp,
  Target,
  BarChart3,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Globe2,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0] relative overflow-hidden flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[550px] h-[500px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f0f1a]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              💰
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                FinTrack
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-widest text-indigo-400/80 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                Pro
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9898b0]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#preview" className="hover:text-white transition-colors">Dashboard Preview</a>
            <Link href="/blog" className="hover:text-white transition-colors flex items-center gap-1.5">
              Blog <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded-full">New</span>
            </Link>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-[#e8e8f0] hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login?mode=signup"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                  Get Started <ChevronRight size={16} />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 text-xs sm:text-sm font-medium text-blue-300 mb-8 backdrop-blur-md">
            <Sparkles size={14} className="text-yellow-400 animate-pulse" />
            <span>Redesigned with Modern Dark Glassmorphism</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Take Full Control of <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Your Financial Freedom
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#9898b0] mb-10 leading-relaxed">
            A beautiful, intuitive personal finance tracker. Log expenses effortlessly, set smart category budgets, inspect 6-month wealth trends, and gain complete clarity over where your money goes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={isAuthenticated ? "/dashboard" : "/login?mode=signup"}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Start Tracking Free <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-7 py-4 rounded-xl text-base font-semibold text-[#e8e8f0] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              View All Features
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="mt-14 pt-10 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center max-w-3xl mx-auto">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">100%</p>
              <p className="text-xs text-[#9898b0] mt-1">Free & Private</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-emerald-400">PostgreSQL</p>
              <p className="text-xs text-[#9898b0] mt-1">Docker-Backed</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-blue-400">Multi-Currency</p>
              <p className="text-xs text-[#9898b0] mt-1">INR, USD, EUR, GBP</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-purple-400">Real-time</p>
              <p className="text-xs text-[#9898b0] mt-1">Budgets & Analytics</p>
            </div>
          </div>
        </section>

        {/* Dashboard Preview Showcase */}
        <section id="preview" className="py-16 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">Live Experience</span>
            <h2 className="text-3xl font-bold text-white mt-1">Designed for Focus & Aesthetics</h2>
            <p className="text-sm text-[#9898b0] mt-2">Frosted glass cards, glowing neon indicators, and instant visual metrics.</p>
          </div>

          {/* Rendered Preview Card in Expense Tracker style */}
          <div className="glass-card p-6 sm:p-8 relative border border-white/10">
            {/* Top Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="stat-card-base stat-card-balance">
                <span className="text-[11px] font-semibold text-[#9898b0] uppercase tracking-wider block mb-1">Total Balance</span>
                <span className="text-2xl sm:text-3xl font-bold text-[#4e8cff]">₹45,280.00</span>
                <span className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1">
                  <TrendingUp size={12} /> +18.4% this month
                </span>
              </div>
              <div className="stat-card-base stat-card-income">
                <span className="text-[11px] font-semibold text-[#9898b0] uppercase tracking-wider block mb-1">Monthly Income</span>
                <span className="text-2xl sm:text-3xl font-bold text-[#00d68f]">₹75,000.00</span>
                <span className="text-xs text-[#9898b0] mt-2 block">Salary & Freelance</span>
              </div>
              <div className="stat-card-base stat-card-expense">
                <span className="text-[11px] font-semibold text-[#9898b0] uppercase tracking-wider block mb-1">Monthly Expenses</span>
                <span className="text-2xl sm:text-3xl font-bold text-[#ff6b6b]">₹29,720.00</span>
                <span className="text-xs text-[#9898b0] mt-2 block">Food, Rent & Shopping</span>
              </div>
            </div>

            {/* Mock 2-Column Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Quick Form Mock */}
              <div className="lg:col-span-5 bg-[#0f0f1e]/80 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white text-base">Quick Add Transaction</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Instant</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="text-xs text-[#9898b0] uppercase tracking-wider font-semibold block mb-1">Description</label>
                    <div className="px-3.5 py-2.5 rounded-xl bg-[#14142b] border border-white/10 text-white/90">Grocery Supermarket</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-[#9898b0] uppercase tracking-wider font-semibold block mb-1">Amount</label>
                      <div className="px-3.5 py-2.5 rounded-xl bg-[#14142b] border border-white/10 text-white/90">₹2,450.00</div>
                    </div>
                    <div>
                      <label className="text-xs text-[#9898b0] uppercase tracking-wider font-semibold block mb-1">Type</label>
                      <div className="px-3.5 py-2.5 rounded-xl bg-[#14142b] border border-white/10 text-rose-400 font-semibold">🔴 Expense</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-[#9898b0] uppercase tracking-wider font-semibold block mb-1">Category</label>
                    <div className="px-3.5 py-2.5 rounded-xl bg-[#14142b] border border-white/10 text-white/90">🛒 Food & Dining</div>
                  </div>
                  <button className="w-full mt-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-md">
                    + Add Transaction
                  </button>
                </div>
              </div>

              {/* Right Column: Transactions Feed Preview */}
              <div className="lg:col-span-7 bg-[#0f0f1e]/80 border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white text-base">Recent Feed</h3>
                  <div className="flex gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs text-white">All</span>
                    <span className="px-2 py-0.5 rounded-md text-xs text-[#9898b0]">Income</span>
                    <span className="px-2 py-0.5 rounded-md text-xs text-[#9898b0]">Expense</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg">💼</span>
                      <div>
                        <p className="font-medium text-white text-sm">Monthly Tech Client Retainer</p>
                        <p className="text-xs text-[#9898b0]">Freelance • Today</p>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-bold text-sm">+₹35,000.00</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center text-lg">🏠</span>
                      <div>
                        <p className="font-medium text-white text-sm">Apartment Rent & Society</p>
                        <p className="text-xs text-[#9898b0]">Housing • Yesterday</p>
                      </div>
                    </div>
                    <span className="text-rose-400 font-bold text-sm">-₹18,000.00</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center text-lg">🛍️</span>
                      <div>
                        <p className="font-medium text-white text-sm">Weekend Shopping</p>
                        <p className="text-xs text-[#9898b0]">Shopping • 3 days ago</p>
                      </div>
                    </div>
                    <span className="text-rose-400 font-bold text-sm">-₹4,250.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section id="features" className="py-20 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Everything You Need To Build Wealth</h2>
            <p className="text-base text-[#9898b0] mt-3 max-w-xl mx-auto">
              From real-time budget warnings to deep 6-month trend reports, FinTrack equips you with pro financial tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 border border-white/10 hover:border-blue-500/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Smart Transactions CRUD</h3>
              <p className="text-sm text-[#9898b0] leading-relaxed">
                Filter by income, expense, category or date. Search seamlessly and navigate thousands of records with server-side pagination.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/10 hover:border-purple-500/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5">
                <Target size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Monthly Category Budgets</h3>
              <p className="text-sm text-[#9898b0] leading-relaxed">
                Set monthly spending targets per category. Glowing progress bars warn you when you exceed 60% and 85% of your target.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/10 hover:border-emerald-500/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Visual Analytics & CSV</h3>
              <p className="text-sm text-[#9898b0] leading-relaxed">
                Inspect 6-month cash flow trends, category doughnuts, and download your entire ledger as CSV in one click.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/10 hover:border-yellow-500/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center mb-5">
                <Globe2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-Currency Global Support</h3>
              <p className="text-sm text-[#9898b0] leading-relaxed">
                Select your preferred currency (INR ₹, USD $, EUR €, GBP £). Currency formatting dynamically updates across all widgets.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/10 hover:border-rose-500/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-5">
                <Zap size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Custom Categories & Emojis</h3>
              <p className="text-sm text-[#9898b0] leading-relaxed">
                Tailor categories to your lifestyle. Pick custom emoji tags, palette colors, and manage income vs expense types.
              </p>
            </div>

            <div className="glass-card p-6 border border-white/10 hover:border-indigo-500/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Private & Secure by Design</h3>
              <p className="text-sm text-[#9898b0] leading-relaxed">
                Backed by your private PostgreSQL Docker container with JWT encryption. Your personal financial data stays 100% yours.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto glass-card p-10 sm:p-14 text-center relative overflow-hidden border border-white/15 bg-gradient-to-b from-white/[0.08] to-transparent">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to Upgrade Your Money Management?
            </h2>
            <p className="text-[#9898b0] text-base max-w-lg mx-auto mb-8">
              Join today and enjoy a clean, distraction-free interface built to give you total control over your finances.
            </p>
            <Link
              href="/login?mode=signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
            >
              Get Started Now <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0a0a14] py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-[#9898b0]">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">💰</span>
            <span className="font-bold text-white">FinTrack</span>
            <span className="text-xs text-[#64748b]">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs sm:text-sm">
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

