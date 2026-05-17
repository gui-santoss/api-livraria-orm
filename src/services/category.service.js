import { Category } from '../model/Category.model.js';
import { Op } from 'sequelize';

export const getAllCategories = async ({ name }) => {
  const where = {};

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  return Category.findAll({ where });
};

export const getCategoryById = async (author_id) => {
  return Category.findByPk(author_id);
};

export const createCategory = async ({ name }) => {
  const existing = await Category.findOne({ where: { name } });

  if (existing) {
    const error = new Error('Category already exists.');
    error.statusCode = 409;
    throw error;
  }

  return Category.create({ name });
};

export const updateCategory = async (author_id, { name }) => {
  const category = await Category.findByPk(author_id);

  if (!category) return null;

  Object.assign(category, { name });
  return category.save();
};

export const deleteCategory = async (author_id) => {
  const category = await Category.findByPk(author_id);

  if (!category) return null;

  await category.destroy();
  return true;
};
