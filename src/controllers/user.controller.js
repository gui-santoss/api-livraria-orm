import logger from '../config/logger.js';
import * as UserService from '../services/user.service.js';

export const getAllUsers = async (req, res) => {
  const { name } = req.query;

  try {
    const users = await UserService.getAllUsers({ name });
    res.status(200).json({ users });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const user = await UserService.getUserById(user_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const createUser = async (req, res) => {
  const { name, email, is_blocked } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  if (is_blocked === undefined) {
    return res
      .status(400)
      .json({ message: "It's required to indicate if the user is blocked." });
  }

  try {
    const user = await UserService.createUser({ name, email, is_blocked });
    res.status(201).json({ message: 'User created successfully!', user });
  } catch (err) {
    logger.error(err);
    const status = err.statusCode || 500;
    res
      .status(status)
      .json({ message: err.message || 'Internal server error.' });
  }
};

export const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { name, email, is_blocked } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  if (is_blocked === undefined) {
    return res
      .status(400)
      .json({ message: "It's required to indicate if the user is blocked." });
  }

  try {
    const user = await UserService.updateUser(user_id, {
      name,
      email,
      is_blocked,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User updated!', user });
  } catch (err) {
    logger.error(err);
    const status = err.statusCode || 500;
    res
      .status(status)
      .json({ message: err.message || 'Internal server error.' });
  }
};

export const deleteUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await UserService.deleteUser(user_id);

    if (!result) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted!' });
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
