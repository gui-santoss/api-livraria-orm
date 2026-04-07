import { User } from '../model/User.js';
import { Op } from 'sequelize';

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
    res.status(500).json({ message: err });
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
    res.status(500).json({ message: err });
  }
};

export const createUser = async (req, res, next) => {
  const { name, email, is_blocked } = req.body;

  if (!name) {
    return res.status(400).send({
      message: 'Name is required.',
    });
  }
  if (!email) {
    return res.status(400).send({
      message: 'Email is required.',
    });
  }
  if (is_blocked === undefined) {
    return res.status(400).send({
      message: 'It`s required to indicate if the user is blocked.',
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).send({ message: 'Email already in use.' });
    }

    const user = await User.create({ name, email, is_blocked });

    res.status(201).json({ message: 'User created succefully!', user });
  } catch (err) {
    res.status(500).send({ message: 'Error creating user.' });
  }
};

export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { name, email, is_blocked } = req.body;

  if (!name) {
    return res.status(400).send({
      message: 'Name is required',
    });
  }
  if (!email) {
    return res.status(400).send({
      message: 'Email is required',
    });
  }
  if (is_blocked === undefined) {
    return res.status(400).send({
      message: 'It`s required to indicate if the user is blocked',
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser && existingUser.id !== parseInt(userId)) {
      return res.status(409).send({ message: 'Email already in use.' });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    Object.assign(user, { name, email, is_blocked });

    const updatedUser = await user.save();

    res.status(200).json({ message: 'User updated!', updatedUser });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Error updating user.' });
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
    res.status(500).json({ message: err });
  }
};
