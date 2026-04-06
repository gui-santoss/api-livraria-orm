import { User } from '../model/User.js';
import { Op } from 'sequelize';

export const getAllUsers = async (req, res, next) => {
  //implementar filtro

  User.findAll()
    .then((users) => {
      res.status(200).json({ user: users });
    })
    .catch((err) => res.status(500).json({ message: err }));
};

export const getUser = async (req, res, next) => {
  const userId = req.params.userId;
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      res.status(200).json({ user: user });
    })
    .catch((err) => res.status(500).json({ message: err }));
};

export const createUser = async (req, res, next) => {
  const { name, email, is_blocked } = req.body;

  if (!name) {
    res.status(400).send({
      message: 'Name is required.',
    });
  }
  if (!email) {
    res.status(400).send({
      message: 'Email is required.',
    });
  }
  if (is_blocked === undefined) {
    res.status(400).send({
      message: 'It`s required to indicate if the user is blocked.',
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).send({ message: 'Email already in use.' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Error creating user.' });
  }

  User.create({
    name: name,
    email: email,
    is_blocked: is_blocked,
  })
    .then((result) => {
      res.status(201).json({
        message: 'User created successfuly!',
        user: result,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { name, email, is_blocked } = req.body;

  if (!name) {
    res.status(400).send({
      message: 'Name is required',
    });
  }
  if (!email) {
    res.status(400).send({
      message: 'Email is required',
    });
  }
  if (!is_blocked) {
    res.status(400).send({
      message: 'It`s required to indicate if the user is blocked',
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).send({ message: 'Email already in use.' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: 'Error creating user.' });
  }

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      user.name = name;
      user.email = email;
      user.is_blocked = is_blocked;
      return user.save();
    })
    .then((result) => {
      if (!result) return;
      res.status(200).json({ message: 'User updated!', user: result });
    })
    .catch((err) => console.log(err));
};

export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      return User.destroy({
        where: {
          id: userId,
        },
      });
    })
    .then((result) => {
      if (!result) return;
      res.status(200).json({ message: 'User deleted!' });
    })
    .catch((err) => console.log(err));
};
