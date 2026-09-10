'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { categoryService } from '@/services/dataService';
import toast from 'react-hot-toast';
import {
  User,
  Plus,
  Trash2,
  X,
  Coins,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

const EMOJI_PALETTE = [
  '📦', '🍔', '🚗', '🏠', '💡', '🛍️', '🎬', '🏥', '📚', '✈️',
  '💼', '💰', '📈', '🎁', '💵', '☕', '🎮', '👕', '💊', '📱',
  '🐕', '🏋️', '🎵', '🍕', '💻', '⚡', '🏖️', '🍿', '⛽', '🛒'
];

const COLOR_PALETTE = [
  '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#64748b'
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    icon: '📦',
    color: '#6366f1',
    type: 'expense',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSaving(true);
    try {
      await categoryService.create({
        name: form.name.trim(),
        icon: form.icon,
        color: form.color,
        type: form.type,
      });
      toast.success('Category created!');
      setShowModal(false);
      setForm({ name: '', icon: '📦', color: '#6366f1', type: 'expense' });
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryService.delete(id);
      toast.success('Category deleted');
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete category with active transactions');
    }
  };

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  return (
    <div className="space-y-6 max-w-4xl animate-fade-scale">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          System & Account Settings
        </h1>
        <p className="text-sm text-[#9898b0] mt-1">
          Manage your account profile and customize your income & expense categories.
        </p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6 border border-white/10">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <User size={18} className="text-[#4e8cff]" />
          <span>User Profile</span>
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-purple-500/20">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">{user?.name || 'User'}</h3>
            <p className="text-sm text-[#9898b0]">{user?.email}</p>
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 text-[#4e8cff] font-semibold border border-blue-500/20">
                Active Currency: {user?.currency || 'INR'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-[#00d68f] font-semibold border border-emerald-500/20">
                Status: Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Manager Card */}
      <div className="glass-card p-6 border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-purple-400" />
              <span>Category Management</span>
            </h2>
            <p className="text-xs text-[#9898b0] mt-0.5">
              Personalize tags and emojis for tracking income and expenses.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} /> Add Category
          </button>
        </div>

        {/* Expense Categories */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
            <span>🔴 Expense Categories</span>
            <span className="text-[#9898b0] font-normal">({expenseCategories.length})</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {expenseCategories.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">{c.icon}</span>
                  <span className="text-xs font-semibold text-white truncate">{c.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  className="opacity-0 group-hover:opacity-100 text-[#64748b] hover:text-[#ff6b6b] transition-all p-1 cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Income Categories */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
            <span>💚 Income Categories</span>
            <span className="text-[#9898b0] font-normal">({incomeCategories.length})</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {incomeCategories.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:border-white/15 transition-all"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">{c.icon}</span>
                  <span className="text-xs font-semibold text-white truncate">{c.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteCategory(c.id)}
                  className="opacity-0 group-hover:opacity-100 text-[#64748b] hover:text-[#ff6b6b] transition-all p-1 cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── ADD CATEGORY MODAL ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-6 border border-white/15 bg-[#141426] animate-fade-scale">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <h3 className="text-lg font-bold text-white">Create Custom Category</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-[#9898b0] hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                  Category Type
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-black/40 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'expense' })}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      form.type === 'expense'
                        ? 'bg-rose-500 text-white shadow-md'
                        : 'text-[#9898b0]'
                    }`}
                  >
                    🔴 Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'income' })}
                    className={`py-2 rounded-lg text-xs font-bold transition-all ${
                      form.type === 'income'
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
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Subscriptions, Pet Food, Dividend"
                  className="dark-input"
                />
              </div>

              {/* Emoji Picker Grid */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                  Choose Icon: <span className="text-white text-sm ml-1">{form.icon}</span>
                </label>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 grid grid-cols-6 sm:grid-cols-10 gap-1.5 max-h-36 overflow-y-auto">
                  {EMOJI_PALETTE.map((emoji, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setForm({ ...form, icon: emoji })}
                      className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all cursor-pointer ${
                        form.icon === emoji ? 'bg-blue-500/30 scale-110 border border-blue-500' : 'hover:bg-white/10'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker Palette */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#9898b0] mb-1.5">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_PALETTE.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setForm({ ...form, color })}
                      style={{ backgroundColor: color }}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                        form.color === color ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
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
                  {saving ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

