'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { transactionService, categoryService } from '@/services/dataService';
import { formatCurrency } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from 'lucide-react';

export default function TransactionsPage() {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal (Add / Edit)
  const [showModal, setShowModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [modalForm, setModalForm] = useState({
    amount: '',
    type: 'expense',
    description: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    categoryService.getAll().then((cats) => setCategories(cats || [])).catch(() => {});
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [page, typeFilter, categoryFilter, startDate, endDate]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadTransactions();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        search: search || undefined,
        type: typeFilter || undefined,
        categoryId: categoryFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
      const res = await transactionService.getAll(params);
      setTransactions(res?.transactions || []);
      setTotal(res?.total || 0);
      setTotalPages(res?.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTx(null);
    const firstExp = categories.find((c) => c.type === 'expense');
    setModalForm({
      amount: '',
      type: 'expense',
      description: '',
      categoryId: firstExp?.id || categories[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const openEditModal = (tx) => {
    setEditingTx(tx);
    setModalForm({
      amount: tx.amount.toString(),
      type: tx.type,
      description: tx.description || '',
      categoryId: tx.categoryId,
      date: tx.date ? tx.date.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalForm.amount || isNaN(Number(modalForm.amount)) || Number(modalForm.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!modalForm.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setSaving(true);
    try {
      if (editingTx) {
        await transactionService.update(editingTx.id, {
          amount: parseFloat(modalForm.amount),
          type: modalForm.type,
          description: modalForm.description.trim(),
          categoryId: modalForm.categoryId,
          date: modalForm.date,
        });
        toast.success('Transaction updated');
      } else {
        await transactionService.create({
          amount: parseFloat(modalForm.amount),
          type: modalForm.type,
          description: modalForm.description.trim(),
          categoryId: modalForm.categoryId,
          date: modalForm.date,
        });
        toast.success('Transaction created');
      }
      setShowModal(false);
      loadTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await transactionService.delete(id);
      toast.success('Transaction removed');
      loadTransactions();
    } catch (err) {
      toast.error('Failed to delete transaction');
    }
  };

  const availableModalCats = categories.filter((c) => c.type === modalForm.type);

  return (
    <div className="space-y-6 animate-fade-scale">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Transactions Ledger
          </h1>
          <p className="text-sm text-[#9898b0] mt-1">
            Browse, search, and manage all your historical income and expense records.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={18} /> New Transaction
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 sm:p-5 border border-white/10 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9898b0]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by description..."
              className="dark-input pl-10"
            />
          </div>

          {/* Type Filter */}
          <div className="lg:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="dark-input"
            >
              <option value="">All Types</option>
              <option value="income">💚 Incomes Only</option>
              <option value="expense">🔴 Expenses Only</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              className="dark-input"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date range pickers */}
          <div className="lg:col-span-3 flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="dark-input text-xs"
              title="Start Date"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="dark-input text-xs"
              title="End Date"
            />
          </div>
        </div>

        {/* Active filter counter & reset */}
        {(search || typeFilter || categoryFilter || startDate || endDate) && (
          <div className="flex items-center justify-between text-xs text-[#9898b0] pt-2 border-t border-white/5">
            <span>Filtering results</span>
            <button
              onClick={() => {
                setSearch('');
                setTypeFilter('');
                setCategoryFilter('');
                setStartDate('');
                setEndDate('');
                setPage(1);
              }}
              className="text-[#4e8cff] hover:underline cursor-pointer font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Transaction List / Table */}
      <div className="glass-card border border-white/10 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-xs text-[#9898b0]">Fetching transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-16 text-center">
            <span className="text-3xl block mb-2">🔍</span>
            <h3 className="text-base font-bold text-white">No transactions found</h3>
            <p className="text-xs text-[#9898b0] mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or create a new transaction using the button above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {transactions.map((tx) => {
              const isIncome = tx.type === 'income';
              const formattedAmt = isIncome
                ? `+${formatCurrency(tx.amount, currency)}`
                : `-${formatCurrency(tx.amount, currency)}`;

              return (
                <div
                  key={tx.id}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                        isIncome ? 'bg-emerald-500/15' : 'bg-rose-500/15'
                      }`}
                    >
                      {tx.category?.icon || (isIncome ? '💼' : '🛍️')}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {tx.description || tx.category?.name || 'Untitled'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#9898b0]">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[#e8e8f0]">
                          {tx.category?.name || 'General'}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(tx.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <span
                      className={`text-base font-extrabold ${
                        isIncome ? 'text-[#00d68f]' : 'text-[#ff6b6b]'
                      }`}
                    >
                      {formattedAmt}
                    </span>

                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(tx)}
                        className="p-2 rounded-lg text-[#9898b0] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-2 rounded-lg text-[#9898b0] hover:text-[#ff6b6b] hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-white/5 flex items-center justify-between text-xs text-[#9898b0]">
          <span>
            Showing <strong className="text-white">{transactions.length}</strong> of{' '}
            <strong className="text-white">{total}</strong> transactions
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="px-2 font-medium text-white">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── ADD / EDIT MODAL ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 border border-white/15 bg-[#141426] animate-fade-scale">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="text-lg font-bold text-white">
                {editingTx ? 'Edit Transaction' : 'New Transaction'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-[#9898b0] hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {/* Type toggle */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/40 border border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      const exps = categories.filter((c) => c.type === 'expense');
                      setModalForm({
                        ...modalForm,
                        type: 'expense',
                        categoryId: exps[0]?.id || modalForm.categoryId,
                      });
                    }}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      modalForm.type === 'expense'
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'text-[#9898b0]'
                    }`}
                  >
                    🔴 Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const incs = categories.filter((c) => c.type === 'income');
                      setModalForm({
                        ...modalForm,
                        type: 'income',
                        categoryId: incs[0]?.id || modalForm.categoryId,
                      });
                    }}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      modalForm.type === 'income'
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'text-[#9898b0]'
                    }`}
                  >
                    💚 Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  required
                  value={modalForm.description}
                  onChange={(e) => setModalForm({ ...modalForm, description: e.target.value })}
                  placeholder="e.g. Monthly Grocery, Client Invoice"
                  className="dark-input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                  Amount ({currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={modalForm.amount}
                  onChange={(e) => setModalForm({ ...modalForm, amount: e.target.value })}
                  placeholder="0.00"
                  className="dark-input font-bold text-white text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                  Category
                </label>
                <select
                  value={modalForm.categoryId}
                  onChange={(e) => setModalForm({ ...modalForm, categoryId: e.target.value })}
                  className="dark-input"
                >
                  {availableModalCats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={modalForm.date}
                  onChange={(e) => setModalForm({ ...modalForm, date: e.target.value })}
                  className="dark-input"
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
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingTx ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

