import Link from 'next/link';
import { ArrowLeft, Clock, Sparkles, Mail, BookOpen, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Blog & Financial Insights',
  description: 'Learn personal finance, debt management, and wealth-building tips. Articles and newsletter coming soon.',
};

export default function BlogPage() {
  const upcomingFeatures = [
    {
      title: 'The Weekly Wealth Digest Newsletter',
      category: 'Newsletter',
      icon: Mail,
      color: 'from-blue-500 to-indigo-600',
      description: 'A curated weekly email delivering actionable budgeting tips, inflation hedges, and smart money habits straight to your inbox.',
      status: 'Coming Soon',
    },
    {
      title: 'The 50/30/20 Budgeting Rule in Practice',
      category: 'Budgeting Guide',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-600',
      description: 'A comprehensive walkthrough on dividing needs, wants, and savings without sacrificing your weekend lattes.',
      status: 'Coming Soon',
    },
    {
      title: 'Debt Avalanche vs Snowball: Which Works Best?',
      category: 'Debt Strategy',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      description: 'Mathematically optimal vs psychologically rewarding debt payoff strategies compared with real-world examples.',
      status: 'Coming Soon',
    },
    {
      title: 'Building a Bulletproof 6-Month Emergency Fund',
      category: 'Emergency Savings',
      icon: ShieldAlert,
      color: 'from-amber-500 to-orange-600',
      description: 'Where to park your safety net, how much to save, and how to avoid tapping it for non-emergencies.',
      status: 'Coming Soon',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-[#e8e8f0] relative overflow-hidden flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f0f1a]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm text-[#9898b0] hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-xl">💰</span>
            <span className="font-bold text-lg text-white">FinTrack Blog</span>
          </Link>

          <Link
            href="/login"
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-16 sm:py-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-medium text-purple-300 mb-4">
            <Sparkles size={13} className="text-yellow-400" />
            <span>Under Active Development</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Financial Insights & Guides
          </h1>
          <p className="text-base text-[#9898b0] leading-relaxed">
            We are writing comprehensive guides, budgeting frameworks, and releasing a dedicated weekly newsletter to help you achieve your financial goals.
          </p>
        </div>

        {/* Feature Cards Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {upcomingFeatures.map((item, idx) => (
            <div
              key={idx}
              className="glass-card p-6 sm:p-8 relative border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300">
                    {item.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <Clock size={12} /> {item.status}
                  </span>
                </div>

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                  <item.icon size={22} />
                </div>

                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {item.title}
                </h2>
                <p className="text-sm text-[#9898b0] leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#64748b]">
                <span>In editorial review</span>
                <span className="text-indigo-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Read teaser <ArrowRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter placeholder box */}
        <div className="glass-card p-8 sm:p-12 text-center border border-white/10 relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20">
          <Mail size={36} className="mx-auto text-purple-400 mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Weekly Money Tips in Your Inbox
          </h2>
          <p className="text-sm text-[#9898b0] max-w-md mx-auto mb-6">
            Get practical money advice, market perspectives, and personal finance strategies directly to your email every Sunday morning.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              disabled
              placeholder="newsletter@comingsoon.com"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm cursor-not-allowed text-center sm:text-left"
            />
            <button
              disabled
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600/50 text-white/70 font-semibold text-sm cursor-not-allowed whitespace-nowrap"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0a0a14] py-8 text-center text-xs text-[#64748b]">
        <p>© {new Date().getFullYear()} FinTrack. All insights and articles will be available soon.</p>
      </footer>
    </div>
  );
}

