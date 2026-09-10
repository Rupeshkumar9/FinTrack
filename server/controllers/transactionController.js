import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getTransactions = async (req, res, next) => {
  try {
    const { type, categoryId, startDate, endDate, search, page = 1, limit = 20 } = req.query;
    const where = { userId: req.user.id };
    if (type) where.type = type;
    if (categoryId) where.categoryId = categoryId;
    if (search) where.description = { contains: search };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate + 'T23:59:59');
    }
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where, include: { category: true },
        orderBy: { date: 'desc' }, skip, take: parseInt(limit),
      }),
      prisma.transaction.count({ where }),
    ]);
    res.json({ transactions, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) { next(error); }
};

const createTransaction = async (req, res, next) => {
  try {
    const { amount, type, description, date, categoryId } = req.body;
    const transaction = await prisma.transaction.create({
      data: { amount: parseFloat(amount), type, description, date: date ? new Date(date) : new Date(), categoryId, userId: req.user.id },
      include: { category: true },
    });
    res.status(201).json(transaction);
  } catch (error) { next(error); }
};

const updateTransaction = async (req, res, next) => {
  try {
    const { amount, type, description, date, categoryId } = req.body;
    const data = {};
    if (amount !== undefined) data.amount = parseFloat(amount);
    if (type) data.type = type;
    if (description !== undefined) data.description = description;
    if (date) data.date = new Date(date);
    if (categoryId) data.categoryId = categoryId;
    const transaction = await prisma.transaction.update({
      where: { id: req.params.id, userId: req.user.id }, data, include: { category: true },
      where: { id: req.params.id }, data, include: { category: true },
    });
    res.json(transaction);
  } catch (error) { next(error); }
};

const deleteTransaction = async (req, res, next) => {
  try {
    await prisma.transaction.delete({ where: { id: req.params.id, userId: req.user.id } });
    await prisma.transaction.delete({ where: { id: req.params.id } });
    res.json({ message: 'Transaction deleted' });
  } catch (error) { next(error); }
};

const getSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const m = parseInt(month) || new Date().getMonth() + 1;
    const y = parseInt(year) || new Date().getFullYear();
    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user.id, date: { gte: startDate, lte: endDate } },
      include: { category: true },
    });
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const categoryBreakdown = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const key = t.category.name;
      if (!categoryBreakdown[key]) categoryBreakdown[key] = { amount: 0, color: t.category.color, icon: t.category.icon };
      categoryBreakdown[key].amount += t.amount;
    });
    res.json({ income, expense, balance: income - expense, savingsRate: income > 0 ? ((income - expense) / income * 100).toFixed(1) : 0, categoryBreakdown, transactionCount: transactions.length });
  } catch (error) { next(error); }
};

export { getTransactions, createTransaction, updateTransaction, deleteTransaction, getSummary };
