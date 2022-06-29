const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { secretKey } = require('../utils/constants');
const NotFoundError = require('../utils/errors/not-found-err');

const {
  error,
  DEF_ERR_CODE,
} = require('../utils/errors');

const createUser = (req, res) => {
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
      res.status(DEF_ERR_CODE).send({ message: '500 — на сервере произошла ошибка по-умолчанию' });
    });
};

const getMeInfo = (req, res, next) => {
  User
    .findById(req.user)
    .then((user) => {
      if (!user) {
        // если такого пользователя нет, сгенерируем исключение
        throw new NotFoundError('Нет пользователя с таким id');
        //        next(404('Пользователь по указанному id не найден.'));
        //        return;
      }
      res.send(user);
    })
    .catch(next); // добавили catch
//    .catch((err) => {
//      if (err.name === 'CastError') {
//        next(400('Пользователь по указанному id не найден.'));
//        return;
//      }
//      next(err);
//    });
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

const login = (req, res) => {
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
    .catch((err) => {
      // res.status(401).send({ message: err.message });
      error(
        err,
        res,
        'ValidationError',
        '401 — переданы некорректные почта или пароль',
      );
    });
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
