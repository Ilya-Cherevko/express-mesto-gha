const User = require('../models/users');
const { error } = require('../utils/errors');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ 
    name, 
    about, 
    avatar })
    
    .then((user) => res.send(user))
    .catch((err) => {
      error(
        err,
        res,
        'ValidationError',
        '400 — переданы некорректные данные при создании пользователя',
      );
    });
};

const getUsers = (req, res) => {
  User
    .find({})
    .then((user) => res.send(user))
    .catch(() => {
      res.status(500).send({ message: '500 — на сервере произошла ошибка по-умолчанию' });
    });
};

const getUser = (req, res) => {
  User
    .findById(req.params.userId)
    .orFail(new Error('NoValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        res.status(404).send({
          message: '404 - пользователь по указанному _id не найден',
        });
      } else {
        error(
          err,
          res,
          'CastError',
          '400 — переданы некорректные данные id пользователя',
        );
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      error(
        err,
        res,
        'ValidationError',
        '400 — переданы некорректные данные при обновлении профиля',
      );
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      error(
        err,
        res,
        'ValidationError',
        '400 — переданы некорректные данные при обновлении аватара',
      );
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
};
