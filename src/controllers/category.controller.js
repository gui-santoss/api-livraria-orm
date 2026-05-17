import logger from '../config/logger.js';
import * as CategoryService from '../services/category.service.js';

export const getAllCategories = async (req, res) => {
  const { name } = req.query;

  try {
    const categories = await CategoryService.getAllCategories({ name });
    res.status(200).json({ categories });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getCategory = async (req, res) => {
  const { category_id } = req.params;

  try {
    const category = await CategoryService.getCategoryById(category_id);

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
    return res.status(400).json({ message: 'Name is required.' });
  }

  try {
    const category = await CategoryService.createCategory({ name });
    res
      .status(201)
      .json({ message: 'Category created successfully!', category });
  } catch (err) {
    logger.error(err);
    const status = err.statusCode || 500;
    res
      .status(status)
      .json({ message: err.message || 'Internal server error.' });
  }
};

export const updateCategory = async (req, res) => {
  const { category_id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  try {
    const category = await CategoryService.updateCategory(category_id, {
      name,
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.status(200).json({ message: 'Category updated!', category });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deleteCategory = async (req, res) => {
  const { category_id } = req.params;

  try {
    const result = await CategoryService.deleteCategory(category_id);

    if (!result) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.status(200).json({ message: 'Category deleted!' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
