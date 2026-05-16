import { Book } from '../model/Book';
import { Author } from '../model/Author';
import { Category } from '../model/Category';
import { Op } from 'sequelize';
import logger from '../config/logger.js';

export const getAllBooks = async (req, res) => {
  const { name } = req.query;

  const where = {};

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  try {
    const books = await Book.findAll({
      where,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      order: [['name', 'ASC']],
    });

    res.status(200).json({ books });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getBook = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findByPk(bookId, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

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

  if (!isbn) {
    return res.status(400).json({ message: 'ISBN is required.' });
  }

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  if (!author_id) {
    return res.status(400).json({ message: 'Author is required.' });
  }

  if (!stock_total) {
    return res
      .status(400)
      .json({ message: 'Stock quantity is required.' });
  }

  if (!categories_id || !Array.isArray(categories_id) || categories_id.length === 0) {
    return res.status(400).json({ message: 'Categories must be a non-empty array.' });
  }

  const stock_available = stock_total;

  try {
    const author = await Author.findByPk(author_id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    const existing_book = await Book.findOne({ where: { isbn: isbn } });

    if (existing_book) {
      return res.status(400).json({ message: 'ISBN already in use' });
    }

    const where = {};

    where.id = { [Op.in]: categories_id };

    const categories = await Category.findAll({ where });

    if (categories.length !== categories_id.length) {
      return res.status(404).json({ message: 'Categories not found.' });
    }

    const book = await Book.create({
      name,
      isbn,
      stock_total,
      stock_available,
      author_id,
    });

    await book.setCategories(categories);

    res.status(201).json(book);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateBook = async (req, res) => {
  const { book_id } = req.params;
  const { name, isbn, stock_total, stock_available, author_id, categories_id } =
    req.body;

  if (!isbn) {
    return res.status(400).json({ message: 'ISBN is required.' });
  }

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  if (!stock_total) {
    return res
      .status(400)
      .json({ message: 'Stock quantity is required.' });
  }

  if (!stock_available) {
    return res
      .status(400)
      .json({ message: 'Available quantity is required.' });
  }

  if (!author_id) {
    return res.status(400).json({ message: 'Author is required.' });
  }

  if (!categories_id || !Array.isArray(categories_id) || categories_id.length === 0) {
    return res.status(400).json({ message: 'Categories must be a non-empty array.' });
  }

  try {
    const book = await Book.findByPk(book_id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    const author = await Author.findByPk(author_id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    const existing_book = await Book.findOne({ where: { isbn } });

    if (existing_book && existing_book.id !== parseInt(book_id)) {
      return res.status(409).json({ message: 'ISBN already in use.' });
    }

    const where = {};

    where.id = { [Op.in]: categories_id };

    const categories = await Category.findAll({ where });

    if (categories.length !== categories_id.length) {
      return res.status(404).json({ message: 'Categories not found.' });
    }

    Object.assign(book, {
      name,
      isbn,
      stock_total,
      stock_available,
      author_id,
    });

    const updatedBook = await book.save();

    await book.setCategories(categories);

    res.status(200).json({ message: 'Book updated!', updatedBook });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
