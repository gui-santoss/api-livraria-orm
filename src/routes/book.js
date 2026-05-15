import express from 'express';
import * as BookController from '../controllers/book.js';

const router = express.Router();

router.get('/', BookController.getAllBooks);
router.get('/:bookId', BookController.getBook);
router.post('/', BookController.createBook);
router.put('/:bookId', BookController.updateBook);

export default router;
