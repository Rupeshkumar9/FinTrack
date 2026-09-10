'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { transactionService, reportService, categoryService } from '@/services/dataService';
import { formatCurrency } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  Trash2,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler
);

export default function DashboardOverview() {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  const [summary, setSummary] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [recentTx, setRecentTx] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Quick Add Form state
  const [quickForm, setQuickForm] = useState({
    amount: '',
    type: 'expense',
    description: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [sum, monthly, tx, cats] = await Promise.all([
        transactionService.getSummary({}),
        reportService.monthly({ months: 6 }),
        transactionService.getAll({ limit: 6 }),
        categoryService.getAll(),
      ]);
      setSummary(sum);
      setMonthlyData(monthly || []);
      setRecentTx(tx?.transactions || []);
      setCategories(cats || []);

      // Set default category if not selected
      const expenseCats = (cats || []).filter((c) => c.type === 'expense');
      if (expenseCats.length > 0 && !quickForm.categoryId) {
        setQuickForm((prev) => ({ ...prev, categoryId: expenseCats[0].id }));
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (newType) => {
    const matchingCats = categories.filter((c) => c.type === newType);
    setQuickForm({
      ...quickForm,
      type: newType,
      categoryId: matchingCats[0]?.id || '',
    });
  };

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    if (!quickForm.amount || isNaN(Number(quickForm.amount)) || Number(quickForm.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!quickForm.description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    if (!quickForm.categoryId) {
      toast.error('Please select a category');
      return;
    }

    setSubmitting(true);
    try {
      await transactionService.create({
        amount: parseFloat(quickForm.amount),
        type: quickForm.type,
        description: quickForm.description.trim(),
        categoryId: quickForm.categoryId,
        date: quickForm.date,
      });

      toast.success('Transaction logged!');
      setQuickForm((prev) => ({
        ...prev,
        amount: '',
        description: '',
      }));
      loadAllData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await transactionService.delete(id);
      toast.success('Transaction deleted');
      loadAllData();
    } catch (err) {
      toast.error('Failed to delete transaction');
    }
  };

  const availableCategories = categories.filter((c) => c.type === quickForm.type);

  // Chart configs
  const catBreakdown = summary?.categoryBreakdown || {};
  const catLabels = Object.keys(catBreakdown);
  const catAmounts = catLabels.map((k) => catBreakdown[k].amount);
  const catColors = catLabels.map((k) => catBreakdown[k].color || '#6366f1');

  const doughnutData = {
    labels: catLabels,
    datasets: [
      {
        data: catAmounts,
        backgroundColor: catColors,
        borderWidth: 1,
        borderColor: 'rgba(15, 15, 26, 0.8)',
        hoverOffset: 6,
      },
    ],
  };

  const barData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map((d) => d.income),
        backgroundColor: '#00d68f',
        borderRadius: 6,
        barPercentage: 0.55,
      },
      {
        label: 'Expense',
        data: monthlyData.map((d) => d.expense),
        backgroundColor: '#ff6b6b',
        borderRadius: 6,
        barPercentage: 0.55,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9898b0',
          font: { size: 11 },
          boxWidth: 12,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#64748b', font: { size: 11 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#64748b', font: { size: 11 } },
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
      },
    },
  };

  return (
    <div className="space-y-8 animate-fade-scale">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Dashboard
          </h1>
          <p className="text-sm text-[#9898b0] mt-1">
            Welcome back, <span className="text-white font-semibold">{user?.name || 'User'}</span>! Here is your real-time wealth overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/transactions"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#e8e8f0] bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all flex items-center gap-2"
          >
            <Layers size={15} /> All Transactions
          </Link>
          <Link
            href="/dashboard/budgets"
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <PiggyBank size={15} /> View Budgets
          </Link>
        </div>
      </div>

      {/* ─── 4 GLOWING KPI STAT CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Balance Card */}
        <div className="stat-card-base stat-card-balance">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#9898b0] uppercase tracking-wider">Total Balance</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-[#4e8cff] flex items-center justify-center">
              <Wallet size={16} />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#4e8cff] tracking-tight block">
            {formatCurrency(summary?.balance || 0, currency)}
          </span>
          <span className="text-xs text-[#9898b0] mt-2 block">
            Net accumulated liquidity
          </span>
        </div>

        {/* Income Card */}
        <div className="stat-card-base stat-card-income">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#9898b0] uppercase tracking-wider">Total Income</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-[#00d68f] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#00d68f] tracking-tight block">
            {formatCurrency(summary?.income || 0, currency)}
          </span>
          <span className="text-xs text-[#9898b0] mt-2 block">
            Earnings & inflows this month
          </span>
        </div>

        {/* Expenses Card */}
        <div className="stat-card-base stat-card-expense">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#9898b0] uppercase tracking-wider">Total Expenses</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-[#ff6b6b] flex items-center justify-center">
              <TrendingDown size={16} />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#ff6b6b] tracking-tight block">
            {formatCurrency(summary?.expense || 0, currency)}
          </span>
          <span className="text-xs text-[#9898b0] mt-2 block">
            Total outgoings recorded
          </span>
        </div>

        {/* Savings Rate Card */}
        <div className="stat-card-base stat-card-savings">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#9898b0] uppercase tracking-wider">Savings Rate</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-[#feca57] flex items-center justify-center">
              <PiggyBank size={16} />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#feca57] tracking-tight block">
            {summary?.savingsRate ?? 0}%
          </span>
          <span className="text-xs text-[#9898b0] mt-2 block">
            Target benchmark: &gt;20%
          </span>
        </div>
      </div>

      {/* ─── TWO-COLUMN CONTENT GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Quick Add Transaction (from expense_tracker_TS) */}
        <div className="lg:col-span-4 glass-card p-6 border border-white/10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <h2 className="text-lg font-bold text-white tracking-tight">Quick Add</h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
              Live Sync
            </span>
          </div>

          <form onSubmit={handleQuickSubmit} className="space-y-4">
            {/* Type Toggle */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                Type
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/40 border border-white/10">
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    quickForm.type === 'expense'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25'
                      : 'text-[#9898b0] hover:text-white'
                  }`}
                >
                  🔴 Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  className={`py-2 rounded-lg text-xs font-bold transition-all ${
                    quickForm.type === 'income'
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'text-[#9898b0] hover:text-white'
                  }`}
                >
                  💚 Income
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                Description
              </label>
              <input
                type="text"
                required
                value={quickForm.description}
                onChange={(e) => setQuickForm({ ...quickForm, description: e.target.value })}
                placeholder="e.g. Starbucks, Freelance Project, Rent"
                className="dark-input"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                Amount ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={quickForm.amount}
                onChange={(e) => setQuickForm({ ...quickForm, amount: e.target.value })}
                placeholder="0.00"
                className="dark-input font-semibold text-white"
              />
            </div>

            {/* Category Select with Emojis */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                Category
              </label>
              <select
                value={quickForm.categoryId}
                onChange={(e) => setQuickForm({ ...quickForm, categoryId: e.target.value })}
                className="dark-input"
              >
                {availableCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={quickForm.date}
                onChange={(e) => setQuickForm({ ...quickForm, date: e.target.value })}
                className="dark-input"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={16} /> Add Transaction
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: Charts & Recent Transactions */}
        <div className="lg:col-span-8 space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Bar Chart: 6-Month Income vs Expense */}
            <div className="md:col-span-7 glass-card p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Monthly Cash Flow</h3>
                  <p className="text-xs text-[#9898b0]">Last 6 months comparison</p>
                </div>
              </div>
              <div className="h-56">
                {monthlyData.length > 0 ? (
                  <Bar data={barData} options={chartOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#64748b]">
                    No monthly data recorded yet
                  </div>
                )}
              </div>
            </div>

            {/* Doughnut: Spending Breakdown */}
            <div className="md:col-span-5 glass-card p-5 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Spending Mix</h3>
                  <p className="text-xs text-[#9898b0]">Top categories</p>
                </div>
              </div>
              <div className="h-56 flex items-center justify-center">
                {catLabels.length > 0 ? (
                  <Doughnut
                    data={doughnutData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '68%',
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: {
                            color: '#9898b0',
                            font: { size: 10 },
                            boxWidth: 10,
                            padding: 8,
                          },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#64748b]">
                    No expenses to analyze yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions Feed (Styled after expense_tracker_TS history) */}
          <div className="glass-card p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Recent Transactions</h3>
                <p className="text-xs text-[#9898b0]">Latest records in your database</p>
              </div>
              <Link
                href="/dashboard/transactions"
                className="text-xs text-[#4e8cff] hover:underline font-semibold flex items-center gap-1"
              >
                View all <ArrowRight size={13} />
              </Link>
            </div>

            {recentTx.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-3xl block mb-2">📋</span>
                <p className="text-sm font-semibold text-white">No transactions yet</p>
                <p className="text-xs text-[#9898b0] mt-1">Use the quick add form on the left to add your first!</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentTx.map((tx) => {
                  const isIncome = tx.type === 'income';
                  const formattedAmt = isIncome
                    ? `+${formatCurrency(tx.amount, currency)}`
                    : `-${formatCurrency(tx.amount, currency)}`;

                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                            isIncome ? 'bg-emerald-500/15' : 'bg-rose-500/15'
                          }`}
                        >
                          {tx.category?.icon || (isIncome ? '💼' : '🛍️')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            {tx.description || tx.category?.name || 'Untitled'}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#9898b0]">
                            <span>{tx.category?.name || 'General'}</span>
                            <span>•</span>
                            <span>
                              {new Date(tx.date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span
                          className={`text-sm font-bold ${
                            isIncome ? 'text-[#00d68f]' : 'text-[#ff6b6b]'
                          }`}
                        >
                          {formattedAmt}
                        </span>
                        <button
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#64748b] hover:text-[#ff6b6b] hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Delete transaction"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

