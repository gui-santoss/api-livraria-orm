import { Category } from '../model/Category';
import { Op } from 'sequelize';
import logger from '../config/logger.js';

export const getAllCategories = async (req, res) => {
  const { name } = req.query;

  const where = {};

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  try {
    const categories = await Category.findAll({ where });

    res.status(200).json({ categories });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.status(200).json(category);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'Name is required.',
    });
  }

  try {
    const existingCategory = await Category.findOne({ where: { name } });

    if (existingCategory) {
      return res.status(409).send({ message: 'Category already exists.' });
    }

    const category = await Category.create({ name });

    res.status(201).json({ message: 'Category created successfully!', category });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateCategory = async (req, res) => {
  const { name } = req.body;
  const { categoryId } = req.params;

  if (!name) {
    return res.status(400).json({ message: 'Name is required ' });
  }

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    Object.assign(category, { name });

    const updatedCategory = await category.save();

    res.status(200).json({ message: 'Category updated!', updatedCategory });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    await category.destroy();
    res.status(200).json({ message: 'Category deleted!' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
