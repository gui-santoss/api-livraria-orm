import { User } from '../model/User';

exports.User = (req, res, next) => {
  User.findAll()
    .then((users) => {
      res.status(200).json({ user: users });
    })
    .catch((err) => res.status(500).json({ message: err }));
};

exports.User = (req, res, next) => {
  const userId = req.params.userId;
  User.findByPk(userId).then();
};
