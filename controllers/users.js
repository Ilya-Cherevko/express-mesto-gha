const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { secretKey } = require('../utils/constants');
const NotFoundError = require('../utils/errors/not-found-err');
const BadRequestError = require('../utils/errors/bad-req-err');
const AuthError = require('../utils/errors/auth');
const ConflictError = require('../utils/errors/conflict-err');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, password, email,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      password: hash,
      email,
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
        next(new ConflictError('Пользователь уже существует!'));
        return;
      }

      next(err);
    });
};

const getUsers = (_, res, next) => {
  User
    .find({})
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const getMeInfo = (req, res, next) => {
  User
    .findById(req.user)
    .then((user) => {
      if (!user) {
        // если такого пользователя нет, сгенерируем исключение
        next(new NotFoundError('Нет пользователя с таким id'));
        // next(404('Пользователь по указанному id не найден.'));
        // return;
      }
      res.send(user);
    })
  //    .catch(next); // добавили catch
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
        next(new BadRequestError('Пользователь по указанному _id не найден.'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному _id не найден'));
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

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
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

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
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
  // res.status(401).send({ message: err.message });
};

module.exports = {
  createUser,
  getMeInfo,
  getUser,
  getUsers,
  updateUser,
  updateAvatar,
  login,
};
