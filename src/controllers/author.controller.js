import logger from '../config/logger.js';
import * as AuthorService from '../services/author.service.js';

export const getAllAuthors = async (req, res) => {
  const { name } = req.query;

  try {
    const authors = await AuthorService.getAllAuthors({ name });
    res.status(200).json(authors);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getAuthor = async (req, res) => {
  const { author_id } = req.params;

  try {
    const author = await AuthorService.getAuthorById(author_id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    res.status(200).json(author);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const createAuthor = async (req, res) => {
  const { name, bio } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }
  if (!bio) {
    return res.status(400).json({ message: 'Bio is required.' });
  }

  try {
    const author = await AuthorService.createAuthor({ name, bio });
    res.status(201).json(author);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateAuthor = async (req, res) => {
  const { author_id } = req.params;
  const { name, bio } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }
  if (!bio) {
    return res.status(400).json({ message: 'Bio is required.' });
  }

  try {
    const author = await AuthorService.updateAuthor(author_id, { name, bio });

    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    res.status(200).json(author);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deleteAuthor = async (req, res) => {
  const { author_id } = req.params;

  try {
    const result = await AuthorService.deleteAuthor(author_id);

    if (!result) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    res.status(200).json({ message: 'Author deleted!' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
