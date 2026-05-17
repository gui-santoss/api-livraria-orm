import { Author } from '../model/Author.model.js';
import { Op } from 'sequelize';

export const getAllAuthors = async ({ name }) => {
  const where = {};

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  return Author.findAll({ where });
};

export const getAuthorById = async (author_id) => {
  return Author.findByPk(author_id);
};

export const createAuthor = async ({ name, bio }) => {
  return Author.create({ name, bio });
};

export const updateAuthor = async (author_id, { name, bio }) => {
  const author = await Author.findByPk(author_id);

  if (!author) return null;

  Object.assign(author, { name, bio });
  return author.save();
};

export const deleteAuthor = async (author_id) => {
  const author = await Author.findByPk(author_id);

  if (!author) return null;

  await author.destroy();
  return true;
};
