import { User } from '../model/User.js';
import { Op } from 'sequelize';
import logger from '../config/logger.js';

export const getAllUsers = async (req, res) => {
  const { name } = req.query;

  const where = {};

  if (name) {
    where.name = { [Op.iLike]: `%${name}%` };
  }

  try {
    const users = await User.findAll({ where });

    res.status(200).json({ users });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const createUser = async (req, res, next) => {
  const { name, email, is_blocked } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'Name is required.',
    });
  }
  if (!email) {
    return res.status(400).json({
      message: 'Email is required.',
    });
  }
  if (is_blocked === undefined) {
    return res.status(400).json({
      message: "It's required to indicate if the user is blocked.",
    });
  }

  try {
    const existing_user = await User.findOne({ where: { email } });

    if (existing_user) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const user = await User.create({ name, email, is_blocked });

    res.status(201).json({ message: 'User created successfully!', user });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { name, email, is_blocked } = req.body;

  if (!name) {
    return res.status(400).json({
      message: 'Name is required',
    });
  }
  if (!email) {
    return res.status(400).json({
      message: 'Email is required',
    });
  }
  if (is_blocked === undefined) {
    return res.status(400).json({
      message: "It's required to indicate if the user is blocked.",
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser && existingUser.id !== parseInt(userId)) {
      return res.status(409).json({ message: 'Email already in use.' });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    Object.assign(user, { name, email, is_blocked });

    const updatedUser = await user.save();

    res.status(200).json({ message: 'User updated!', updatedUser });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted!' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
