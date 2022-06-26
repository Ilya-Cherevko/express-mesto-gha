const Card = require('../models/cards');
const { error } = require('../utils/errors');

const getCards = (req, res) => {
  Card.find()
    .then((card) => res.send(card))
    // eslint-disable-next-line no-undef
    .catch(() => res.status(DEF_ERR_CODE).send({ message: '500 — на сервере произошла ошибка по-умолчанию' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      error(
        err,
        res,
        'ValidationError',
        '400 - переданы некорректные данные при создании карточки',
      );
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NoValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        res
          .status(404)
          .send({ message: '404 — карточка с указанным id не найдена.' });
      }
      error(err, res, 'CastError', '400 - переданы некорректные данные при удалении карточки');
    });
};

const addLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить id в массив
    { new: true },
  )
    .orFail(new Error('NoValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        res
          .status(404)
          .send({ message: '404 — передан несуществующий id карточки' });
      }
      error(
        err,
        res,
        'CastError',
        '400 — переданы некорректные данные для постановки лайка',
      );
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать id из массива
    { new: true },
  )
    .orFail(new Error('NoValidId'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.message === 'NoValidId') {
        res
          .status(404)
          .send({ message: '404 — передан несуществующий id карточки' });
      }
      error(
        err,
        res,
        'CastError',
        '400 — переданы некорректные данные для снятия лайка',
      );
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
