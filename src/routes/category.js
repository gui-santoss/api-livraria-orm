import express from 'express';
import * as CategoryController from '../controllers/category.js';

const router = express.Router();

router.get('/', CategoryController.getAllCategories);
router.get('/:categoryId', CategoryController.getCategory);
router.post('/', CategoryController.createCategory);
router.put('/:categoryId', CategoryController.updateCategory);
router.delete('/:categoryId', CategoryController.deleteCategory);
