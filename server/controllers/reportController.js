import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getMonthlyReport = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const now = new Date();
    const data = [];
    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const transactions = await prisma.transaction.findMany({
        where: { userId: req.user.id, date: { gte: start, lte: end } },
      });
      const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      data.push({ month: start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), income, expense, balance: income - expense });
    }
    res.json(data);
  } catch (error) { next(error); }
};

const getCategoryReport = async (req, res, next) => {
  try {
    const m = parseInt(req.query.month) || new Date().getMonth() + 1;
    const y = parseInt(req.query.year) || new Date().getFullYear();
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59);
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id, type: 'expense', date: { gte: start, lte: end } },
      include: { category: true },
    });
    const breakdown = {};
    transactions.forEach(t => {
      if (!breakdown[t.categoryId]) breakdown[t.categoryId] = { name: t.category.name, icon: t.category.icon, color: t.category.color, amount: 0 };
      breakdown[t.categoryId].amount += t.amount;
    });
    const sorted = Object.values(breakdown).sort((a, b) => b.amount - a.amount);
    res.json(sorted);
  } catch (error) { next(error); }
};

const exportCSV = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const where = { userId: req.user.id };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate + 'T23:59:59');
    }
    const transactions = await prisma.transaction.findMany({ where, include: { category: true }, orderBy: { date: 'desc' } });
    let csv = 'Date,Type,Category,Description,Amount\n';
    transactions.forEach(t => {
      csv += `${t.date.toISOString().split('T')[0]},${t.type},${t.category.name},"${t.description || ''}",${t.amount}\n`;
    });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csv);
  } catch (error) { next(error); }
};

export { getMonthlyReport, getCategoryReport, exportCSV };
