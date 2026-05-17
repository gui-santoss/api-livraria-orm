import logger from '../config/logger.js';
import * as BookService from '../services/book.service.js';

export const getAllBooks = async (req, res) => {
  const { name } = req.query;

  try {
    const books = await BookService.getAllBooks({ name });
    res.status(200).json({ books });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getBook = async (req, res) => {
  const { book_id } = req.params;

  try {
    const book = await BookService.getBookById(book_id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.status(200).json(book);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const createBook = async (req, res) => {
  const { name, isbn, stock_total, author_id, categories_id } = req.body;

  if (!isbn) return res.status(400).json({ message: 'ISBN is required.' });
  if (!name) return res.status(400).json({ message: 'Name is required.' });
  if (!author_id) return res.status(400).json({ message: 'Author is required.' });
  if (!stock_total) return res.status(400).json({ message: 'Stock quantity is required.' });
  if (!categories_id || !Array.isArray(categories_id) || categories_id.length === 0) {
    return res.status(400).json({ message: 'Categories must be a non-empty array.' });
  }

  try {
    const book = await BookService.createBook({ name, isbn, stock_total, author_id, categories_id });
    res.status(201).json(book);
  } catch (err) {
    logger.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || 'Internal server error.' });
  }
};

export const updateBook = async (req, res) => {
  const { book_id } = req.params;
  const { name, isbn, stock_total, stock_available, author_id, categories_id } = req.body;

  if (!isbn) return res.status(400).json({ message: 'ISBN is required.' });
  if (!name) return res.status(400).json({ message: 'Name is required.' });
  if (!stock_total) return res.status(400).json({ message: 'Stock quantity is required.' });
  if (!stock_available) return res.status(400).json({ message: 'Available quantity is required.' });
  if (!author_id) return res.status(400).json({ message: 'Author is required.' });
  if (!categories_id || !Array.isArray(categories_id) || categories_id.length === 0) {
    return res.status(400).json({ message: 'Categories must be a non-empty array.' });
  }

  try {
    const book = await BookService.updateBook(book_id, { name, isbn, stock_total, stock_available, author_id, categories_id });

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    res.status(200).json({ message: 'Book updated!', book });
  } catch (err) {
    logger.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({ message: err.message || 'Internal server error.' });
  }
};
