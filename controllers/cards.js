const Card = require('../models/card');
const NotFoundError = require('../utils/errors/not-found');
const BadRequestError = require('../utils/errors/bad-req');
const ForbiddenError = require('../utils/errors/forbid');

const getCards = (_, res, next) => {
  Card
    .find({})
    .then((cards) => res.send(cards.reverse()))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card
    .create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card
    .findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным id не найдена.'));
        return;
      }

      if (JSON.stringify(card.owner) !== JSON.stringify(req.user._id)) {
        next(new ForbiddenError('Невозможно удалить карточку.'));
        return;
      }

      // eslint-disable-next-line consistent-return
      return Card.findByIdAndDelete(cardId);
    })
    .then((c) => {
      res.send({ c });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Передан некорректный id карточки.'));
        return;
      }
      next(err);
    });
};

const addLike = (req, res, next) => {
  Card
    .findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий id карточки.'));
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Переданы некорректные данные для постановки лайка.'));
        return;
      }
      next(err);
    });
};

const deleteLike = (req, res, next) => {
  Card
    .findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий id карточки.'));
        return;
      }

      res.send(card);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Переданы некорректные данные для снятии лайка.'));
        return;
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addLike,
  deleteLike,
};
