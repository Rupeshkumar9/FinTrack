'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { budgetService, categoryService } from '@/services/dataService';
import { formatCurrency } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';
import {
  Target,
  Plus,
  Trash2,
  X,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Calendar,
} from 'lucide-react';

export default function BudgetsPage() {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ amount: '', categoryId: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoryService.getAll().then((cats) => {
      setCategories((cats || []).filter((c) => c.type === 'expense'));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    loadBudgets();
  }, [month, year]);

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const data = await budgetService.getAll({ month, year });
      setBudgets(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!form.categoryId) {
      toast.error('Please select an expense category');
      return;
    }

    setSaving(true);
    try {
      await budgetService.upsert({
        amount: parseFloat(form.amount),
        categoryId: form.categoryId,
        month,
        year,
      });
      toast.success('Budget limit set!');
      setShowModal(false);
      setForm({ amount: '', categoryId: '' });
      loadBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to set budget');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!confirm('Remove this category budget?')) return;
    try {
      await budgetService.delete(id);
      toast.success('Budget limit removed');
      loadBudgets();
    } catch (err) {
      toast.error('Failed to remove budget');
    }
  };

  // Aggregates
  const totalAllocated = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
  const totalRemaining = Math.max(0, totalAllocated - totalSpent);
  const overallPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  const usedCategoryIds = budgets.map((b) => b.categoryId);
  const availableCategories = categories.filter((c) => !usedCategoryIds.includes(c.id));

  // Months for selector
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i + 2, 1);
    return {
      m: d.getMonth() + 1,
      y: d.getFullYear(),
      label: d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
    };
  });

  return (
    <div className="space-y-6 animate-fade-scale">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Monthly Spending Budgets
          </h1>
          <p className="text-sm text-[#9898b0] mt-1">
            Establish category spending ceilings to prevent overspending.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month selector */}
          <select
            value={`${year}-${month}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split('-');
              setYear(parseInt(y, 10));
              setMonth(parseInt(m, 10));
            }}
            className="dark-input w-auto text-xs sm:text-sm font-semibold"
          >
            {monthOptions.map((opt, idx) => (
              <option key={idx} value={`${opt.y}-${opt.m}`}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setForm({ amount: '', categoryId: availableCategories[0]?.id || '' });
              setShowModal(true);
            }}
            disabled={availableCategories.length === 0}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} /> Set Budget
          </button>
        </div>
      </div>

      {/* ─── Top Macro Budget Overview ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="stat-card-base stat-card-balance">
          <span className="text-[11px] font-bold text-[#9898b0] uppercase tracking-wider block mb-1">
            Total Allocated Budget
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#4e8cff] tracking-tight block">
            {formatCurrency(totalAllocated, currency)}
          </span>
          <span className="text-xs text-[#9898b0] mt-1 block">
            Across {budgets.length} categories
          </span>
        </div>

        <div className="stat-card-base stat-card-expense">
          <span className="text-[11px] font-bold text-[#9898b0] uppercase tracking-wider block mb-1">
            Spent in Target Categories
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#ff6b6b] tracking-tight block">
            {formatCurrency(totalSpent, currency)}
          </span>
          <span className="text-xs text-[#9898b0] mt-1 block">
            {overallPercentage}% of total limit consumed
          </span>
        </div>

        <div className="stat-card-base stat-card-income">
          <span className="text-[11px] font-bold text-[#9898b0] uppercase tracking-wider block mb-1">
            Remaining Buffer
          </span>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#00d68f] tracking-tight block">
            {formatCurrency(totalRemaining, currency)}
          </span>
          <span className="text-xs text-[#9898b0] mt-1 block">
            Safe to spend this month
          </span>
        </div>
      </div>

      {/* ─── Budget Progress List ─── */}
      <div className="glass-card p-6 border border-white/10">
        <h2 className="text-base font-bold text-white mb-4 flex items-center justify-between">
          <span>Active Category Budgets</span>
          <span className="text-xs font-normal text-[#9898b0]">
            Target Period: {new Date(year, month - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
        </h2>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-xs text-[#9898b0]">Loading budgets...</p>
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-3xl block mb-2">🎯</span>
            <h3 className="text-base font-bold text-white">No budgets configured for this month</h3>
            <p className="text-xs text-[#9898b0] mt-1 max-w-sm mx-auto mb-5">
              Set spending limits for your frequent expense categories to get real-time warnings before you overspend.
            </p>
            <button
              onClick={() => {
                setForm({ amount: '', categoryId: availableCategories[0]?.id || '' });
                setShowModal(true);
              }}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-md cursor-pointer"
            >
              + Create First Budget
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((b) => {
              const pct = b.percentage || 0;
              const isOver = pct >= 100;
              const isWarning = pct >= 80 && !isOver;

              const barColor = isOver
                ? 'from-rose-500 to-red-600 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                : isWarning
                ? 'from-amber-400 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'from-emerald-400 to-teal-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]';

              return (
                <div
                  key={b.id}
                  className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl shrink-0">
                        {b.category?.icon || '📦'}
                      </span>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {b.category?.name || 'Category'}
                        </h4>
                        <p className="text-xs text-[#9898b0]">
                          Spent: <strong className="text-white">{formatCurrency(b.spent || 0, currency)}</strong> of{' '}
                          {formatCurrency(b.amount, currency)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <span
                          className={`text-sm font-extrabold ${
                            isOver ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {pct}%
                        </span>
                        <p className="text-[10px] text-[#9898b0]">
                          {isOver
                            ? `Over by ${formatCurrency(b.spent - b.amount, currency)}`
                            : `${formatCurrency(b.amount - (b.spent || 0), currency)} left`}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDeleteBudget(b.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-[#64748b] hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer"
                        title="Remove budget"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Meter Bar */}
                  <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden relative">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── SET BUDGET MODAL ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 border border-white/15 bg-[#141426] animate-fade-scale">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="text-lg font-bold text-white">Set Monthly Budget</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-[#9898b0] hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSetBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                  Category
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="dark-input"
                  required
                >
                  {availableCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                  Monthly Limit ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="e.g. 15000"
                  className="dark-input font-bold text-white text-base"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#9898b0] hover:text-white bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md cursor-pointer disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Set Limit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

