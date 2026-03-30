import { User } from '../model/User.js';

export const getAllUsers = (req, res, next) => {
  User.findAll()
    .then((users) => {
      res.status(200).json({ user: users });
    })
    .catch((err) => res.status(500).json({ message: err }));
};

export const getUser = (req, res, next) => {
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

export const createUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  console.log(req.body);
  User.create({
    name: name,
    email: email,
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

export const updateUser = (req, res, next) => {
  const { userId } = req.params;
  const { newName, newEmail } = req.body;
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.name = newName;
      user.email = newEmail;
      user.save();
    })
    .then((result) => {
      res.status(200).json({ message: 'User updated!', user: result });
    })
    .catch((err) => console.log(err));
};

export const deleteUser = (req, res, next) => {
  const { userId } = req.params;
  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found!' });
      }
      User.destroy({
        where: {
          id: userId,
        },
      });
    })
    .then((result) => {
      res.status(200).json({ message: 'User deleted!' });
    })
    .catch((err) => console.log(err));
};
