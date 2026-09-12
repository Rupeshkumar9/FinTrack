import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', icon: '🍔', color: '#ef4444' },
  { name: 'Transport', icon: '🚗', color: '#f59e0b' },
  { name: 'Housing & Rent', icon: '🏠', color: '#8b5cf6' },
  { name: 'Utilities', icon: '💡', color: '#06b6d4' },
  { name: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { name: 'Entertainment', icon: '🎬', color: '#f97316' },
  { name: 'Healthcare', icon: '🏥', color: '#10b981' },
  { name: 'Education', icon: '📚', color: '#3b82f6' },
  { name: 'Travel', icon: '✈️', color: '#6366f1' },
  { name: 'Others', icon: '📦', color: '#64748b' },
];

const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salary', icon: '💼', color: '#10b981' },
  { name: 'Freelance', icon: '💰', color: '#3b82f6' },
  { name: 'Investments', icon: '📈', color: '#8b5cf6' },
  { name: 'Gifts', icon: '🎁', color: '#f59e0b' },
  { name: 'Other Income', icon: '💵', color: '#64748b' },
];

const generateToken = (userId) => jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

const register = async (req, res, next) => {
  try {
    const { name, email, password, currency } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&bold=true`;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        avatar,
        currency: currency || 'INR',
      },
    });

    // Seed default categories
    const expenseCats = DEFAULT_EXPENSE_CATEGORIES.map((c) => ({ ...c, type: 'expense', userId: user.id }));
    const incomeCats = DEFAULT_INCOME_CATEGORIES.map((c) => ({ ...c, type: 'income', userId: user.id }));
    await prisma.category.createMany({ data: [...expenseCats, ...incomeCats] });

    const token = generateToken(user.id);
    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, currency: user.currency },
      token,
    });
  } catch (error) { next(error); }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(user.id);
    res.json({
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar, currency: user.currency },
      token,
    });
  } catch (error) { next(error); }
};

const getMe = async (req, res) => {
  const { id, name, email, avatar, currency } = req.user;
  res.json({ id, name, email, avatar, currency });
};

export { register, login, getMe };
