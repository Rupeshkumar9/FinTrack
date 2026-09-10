import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.user.id }, orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) { next(error); }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, icon, color, type } = req.body;
    const category = await prisma.category.create({
      data: { name, icon: icon || '📦', color: color || '#6366f1', type, userId: req.user.id },
    });
    res.status(201).json(category);
  } catch (error) { next(error); }
};

const updateCategory = async (req, res, next) => {
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id, userId: req.user.id },
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(category);
  } catch (error) { next(error); }
};

const deleteCategory = async (req, res, next) => {
  try {
    const txCount = await prisma.transaction.count({ where: { categoryId: req.params.id } });
    if (txCount > 0) return res.status(400).json({ message: 'Cannot delete category with existing transactions' });
    await prisma.category.delete({ where: { id: req.params.id, userId: req.user.id } });
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ message: 'Category deleted' });
  } catch (error) { next(error); }
};

export { getCategories, createCategory, updateCategory, deleteCategory };
