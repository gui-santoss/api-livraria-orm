import { Book } from '../model/Book.model.js';
import { Author } from '../model/Author.model.js';
import { Category } from '../model/Category.model.js';
import { Op } from 'sequelize';

export const getAllBooks = async ({ name }) => {
  const where = {};

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  return Book.findAll({
    where,
    include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    order: [['name', 'ASC']],
  });
};

export const getBookById = async (book_id) => {
  return Book.findByPk(book_id, {
    include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
  });
};

export const createBook = async ({
  name,
  isbn,
  stock_total,
  author_id,
  categories_id,
}) => {
  const author = await Author.findByPk(author_id);
  if (!author) {
    const error = new Error('Author not found.');
    error.statusCode = 404;
    throw error;
  }

  const existing = await Book.findOne({ where: { isbn } });
  if (existing) {
    const error = new Error('ISBN already in use.');
    error.statusCode = 409;
    throw error;
  }

  const categories = await Category.findAll({
    where: { id: { [Op.in]: categories_id } },
  });
  if (categories.length !== categories_id.length) {
    const error = new Error('Categories not found.');
    error.statusCode = 404;
    throw error;
  }

  const book = await Book.create({
    name,
    isbn,
    stock_total,
    stock_available: stock_total,
    author_id,
  });
  await book.setCategories(categories);

  return book;
};

export const updateBook = async (
  book_id,
  { name, isbn, stock_total, stock_available, author_id, categories_id },
) => {
  const book = await Book.findByPk(book_id);
  if (!book) return null;

  const author = await Author.findByPk(author_id);
  if (!author) {
    const error = new Error('Author not found.');
    error.statusCode = 404;
    throw error;
  }

  const existing = await Book.findOne({ where: { isbn } });
  if (existing && existing.id !== parseInt(book_id)) {
    const error = new Error('ISBN already in use.');
    error.statusCode = 409;
    throw error;
  }

  const categories = await Category.findAll({
    where: { id: { [Op.in]: categories_id } },
  });
  if (categories.length !== categories_id.length) {
    const error = new Error('Categories not found.');
    error.statusCode = 404;
    throw error;
  }

  Object.assign(book, { name, isbn, stock_total, stock_available, author_id });
  const updatedBook = await book.save();
  await book.setCategories(categories);

  return updatedBook;
};
