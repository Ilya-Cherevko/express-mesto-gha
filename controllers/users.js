const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../utils/errors/conflict');
const NotFoundError = require('../utils/errors/not-found');
const BadRequestError = require('../utils/errors/bad-req');
const AuthError = require('../utils/errors/auth');
const { secretKey } = require('../utils/constants');

const getUsers = (_, res, next) => {
  User
    .find({})
    .then((users) => res.send({ users }))
    .catch((err) => next(err));
};

const getMeInfo = (req, res, next) => {
  User
    .findById(req.user)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному id не найден.'));
        return;
      }
      next(err);
    });
};

const getUser = (req, res, next) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному id не найден.'));
        return;
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
        return;
      }

      if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует!'));
        return;
      }

      next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  if (!name || !about) {
    next(new NotFoundError('Переданы некорректные данные при обновлении профиля.'));
    return;
  }

  User
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
        return;
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  if (!avatar) {
    next(new NotFoundError('Переданы некорректные данные при обновлении аватара.'));
    return;
  }

  User
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
        return;
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        secretKey,
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch((err) => next(new AuthError(err.message)));
};

module.exports = {
  getUsers,
  getMeInfo,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
  login,
};
