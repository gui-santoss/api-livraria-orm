import { Author } from '../model/Author.js';
import { Op } from 'sequelize';
import logger from '../config/logger.js';

export const getAllAuthors = async (req, res) => {
  const { name } = req.query;

  const where = {};

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  try {
    const authors = await Author.findAll({ where });

    res.status(200).json(authors);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getAuthor = async (req, res, next) => {
  const { authorId } = req.params;

  try {
    const author = await Author.findByPk(authorId);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.status(200).json(author);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const createAuthor = async (req, res, next) => {
  const { name, bio } = req.body;

  if (!name) {
    return res.status(400).send({
      message: 'Name is required.',
    });
  }
  if (!bio) {
    return res.status(400).send({
      message: 'Bio is required.',
    });
  }

  try {
    const author = await Author.create({ name, bio });

    res.status(201).json(author);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateAuthor = async (req, res, next) => {
  const { authorId } = req.params;
  const { name, bio } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }
  if (!bio) {
    return res.status(400).json({ message: 'Bio is required.' });
  }

  try {
    const author = await Author.findByPk(authorId);

    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    Object.assign(author, { name, bio });

    const updatedAuthor = await author.save();

    res.status(200).json(updatedAuthor);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deleteAuthor = async (req, res, next) => {
  const { authorId } = req.params;

  try {
    const author = await Author.findByPk(authorId);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    await author.destroy();
    res.status(200).json({ message: 'Author deleted!' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
