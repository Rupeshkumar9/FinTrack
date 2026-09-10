'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { reportService } from '@/services/dataService';
import { formatCurrency } from '@/utils/formatCurrency';
import toast from 'react-hot-toast';
import {
  Download,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  PieChart,
  Calendar,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const [monthly, category] = await Promise.all([
        reportService.monthly({ months: 6 }),
        reportService.category({}),
      ]);
      setMonthlyData(monthly || []);
      setCategoryData(category || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load financial reports');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const blob = await reportService.exportCSV({});
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success('CSV ledger downloaded!');
    } catch (err) {
      toast.error('CSV export failed');
    } finally {
      setExporting(false);
    }
  };

  const totalExpensesAllTime = categoryData.reduce((s, c) => s + c.amount, 0);

  // Line Chart Config
  const lineData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: 'Income',
        data: monthlyData.map((d) => d.income),
        borderColor: '#00d68f',
        backgroundColor: 'rgba(0, 214, 143, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Expense',
        data: monthlyData.map((d) => d.expense),
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.12)',
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Balance Chart Config
  const balanceData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: 'Net Surplus / Deficit',
        data: monthlyData.map((d) => d.balance),
        backgroundColor: monthlyData.map((d) => (d.balance >= 0 ? '#00d68f' : '#ff6b6b')),
        borderRadius: 6,
        barPercentage: 0.5,
      },
    ],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9898b0', font: { size: 11 }, boxWidth: 12 },
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
    <div className="space-y-6 animate-fade-scale">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Financial Intelligence & Reports
          </h1>
          <p className="text-sm text-[#9898b0] mt-1">
            Deep insights into long-term cash flow and spending distribution.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-white/10 hover:bg-white/15 border border-white/10 shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <FileSpreadsheet size={16} className="text-emerald-400" />
          <span>{exporting ? 'Exporting...' : 'Export CSV Ledger'}</span>
        </button>
      </div>

      {/* ─── CHARTS ROW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Line Chart */}
        <div className="glass-card p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Income vs Expense Trend</h3>
              <p className="text-xs text-[#9898b0]">6-Month Rolling Trajectory</p>
            </div>
            <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#4e8cff] flex items-center justify-center">
              <TrendingUp size={16} />
            </span>
          </div>

          <div className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Line data={lineData} options={chartOpts} />
            )}
          </div>
        </div>

        {/* Net Balance Surplus Bar Chart */}
        <div className="glass-card p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Net Savings</h3>
              <p className="text-xs text-[#9898b0]">Net cash retained per month</p>
            </div>
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <BarChart3 size={16} />
            </span>
          </div>

          <div className="h-64">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <Bar data={balanceData} options={chartOpts} />
            )}
          </div>
        </div>
      </div>

      {/* ─── CATEGORY BREAKDOWN TABLE ─── */}
      <div className="glass-card p-6 border border-white/10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-white">Category-Wise Spending Breakdown</h3>
            <p className="text-xs text-[#9898b0]">Ranked by total expenditure</p>
          </div>
          <span className="text-xs font-semibold text-white bg-white/5 px-3 py-1 rounded-full border border-white/10">
            Total: {formatCurrency(totalExpensesAllTime, currency)}
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#9898b0]">Crunching category metrics...</div>
        ) : categoryData.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#9898b0]">No expense categories to display yet.</div>
        ) : (
          <div className="space-y-3">
            {categoryData.map((cat, idx) => {
              const pct = totalExpensesAllTime > 0 ? ((cat.amount / totalExpensesAllTime) * 100).toFixed(1) : 0;
              return (
                <div
                  key={cat.id || idx}
                  className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-base">
                        {cat.icon || '📦'}
                      </span>
                      <div>
                        <span className="text-sm font-bold text-white">{cat.name}</span>
                        <span className="ml-2 text-xs text-[#9898b0]">({pct}%)</span>
                      </div>
                    </div>

                    <span className="text-sm font-extrabold text-white">
                      {formatCurrency(cat.amount, currency)}
                    </span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color || '#6366f1',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

