import { User } from '../model/User.model.js';
import { Op } from 'sequelize';

export const getAllUsers = async ({ name }) => {
  const where = {};

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  return User.findAll({ where });
};

export const getUserById = async (user_id) => {
  return User.findByPk(user_id);
};

export const createUser = async ({ name, email, is_blocked }) => {
  const existing = await User.findOne({ where: { email } });

  if (existing) {
    const error = new Error('Email already in use.');
    error.statusCode = 409;
    throw error;
  }

  return User.create({ name, email, is_blocked });
};

export const updateUser = async (user_id, { name, email, is_blocked }) => {
  const existing_user = await User.findOne({ where: { email } });

  if (existing_user && existing_user.id !== parseInt(user_id)) {
    const error = new Error('Email already in use.');
    error.statusCode = 409;
    throw error;
  }

  const user_edited = await User.findByPk(user_id);

  if (!user_edited) return null;

  Object.assign(user_edited, { name, email, is_blocked });
  return user_edited.save();
};

export const deleteUser = async (user_id) => {
  const user = await User.findByPk(user_id);

  if (!user) return null;

  await user.destroy();
  return true;
};
