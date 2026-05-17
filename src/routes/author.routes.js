import express from 'express';
import * as AuthorController from '../controllers/author.controller.js';

const router = express.Router();

//Author routes
router.get('/', AuthorController.getAllAuthors);
router.get('/:authorId', AuthorController.getAuthor);
router.post('/', AuthorController.createAuthor);
router.put('/:authorId', AuthorController.updateAuthor);
router.delete('/:authorId', AuthorController.deleteAuthor);

export default router;
