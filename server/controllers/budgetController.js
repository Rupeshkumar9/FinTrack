import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getBudgets = async (req, res, next) => {
  try {
    const m = parseInt(req.query.month) || new Date().getMonth() + 1;
    const y = parseInt(req.query.year) || new Date().getFullYear();
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const budgets = await prisma.budget.findMany({
      where: { userId: req.user.id, month: m, year: y },
      include: { category: true },
    });

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(budgets.map(async (budget) => {
      const spent = await prisma.transaction.aggregate({
        where: { userId: req.user.id, categoryId: budget.categoryId, type: 'expense', date: { gte: startDate, lte: endDate } },
        _sum: { amount: true },
      });
      return { ...budget, spent: spent._sum.amount || 0, percentage: budget.amount > 0 ? Math.round(((spent._sum.amount || 0) / budget.amount) * 100) : 0 };
    }));

    res.json(budgetsWithSpent);
  } catch (error) { next(error); }
};

const upsertBudget = async (req, res, next) => {
  try {
    const { amount, categoryId, month, year } = req.body;
    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();

    const budget = await prisma.budget.upsert({
      where: { categoryId_month_year_userId: { categoryId, month: m, year: y, userId: req.user.id } },
      update: { amount: parseFloat(amount) },
      create: { amount: parseFloat(amount), month: m, year: y, categoryId, userId: req.user.id },
      include: { category: true },
    });
    res.json(budget);
  } catch (error) { next(error); }
};

const deleteBudget = async (req, res, next) => {
  try {
    await prisma.budget.delete({ where: { id: req.params.id, userId: req.user.id } });
    await prisma.budget.delete({ where: { id: req.params.id } });
    res.json({ message: 'Budget deleted' });
  } catch (error) { next(error); }
};

export { getBudgets, upsertBudget, deleteBudget };
